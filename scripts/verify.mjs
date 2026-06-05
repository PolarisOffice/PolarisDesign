#!/usr/bin/env node
/**
 * verify — run every CI-equivalent check locally, in the same order CI does.
 *
 * Designed for `pnpm verify` (manual) and as a git pre-push hook
 * (auto, opt-in via `pnpm verify:install-hook`).
 *
 * Why a script and not just a script chain in package.json:
 *   1. Sequential streaming output (vs interleaved chaos with `&&`).
 *   2. Per-step duration printed — easy to spot the slow link.
 *   3. Skip e2e by default (slow, browser required) — opt-in via
 *      `--with-e2e` or `VERIFY_E2E=1`.
 *   4. Stops on first failure with a clean summary; exit 1 propagates to
 *      git hook so push is blocked.
 *
 * What's checked (mirrors `.github/workflows/ci.yml`):
 *   1. @polaris/ui build (token + DESIGN.md regen + tsup)
 *   2. token sync (committed tokens.css matches generator)
 *   3. DESIGN.md sync
 *   4. root version sync
 *   5. @polaris/lint build
 *   6. ui-source dead-alias scan (polaris-codemod-v08 --check)
 *   7. typecheck (all packages)
 *   8. @polaris/ui tests (vitest + node:test)
 *   9. @polaris/lint tests (rule + codemod)
 *  10. @polaris/plugin tests (PostToolUse hook smoke)
 *  11. demo lint (warnings allowed, errors fail)
 *  12. template-next lint (--max-warnings=0 strict)
 *  13. demo build
 *  14. template-next build
 *  15. (optional) e2e visual regression
 *
 * Each step runs in a child process. We don't bypass the existing scripts
 * — we drive `pnpm` exactly the way CI does — so behavior stays in sync.
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const withE2E = args.includes('--with-e2e') || process.env.VERIFY_E2E === '1';
const start = Date.now();

// Auto-detect "drift" check eligibility:
//
// `git diff --exit-code <file>` after `pnpm build` is meant to catch the
// case where someone edited `tokens.ts` but didn't commit the regenerated
// `tokens.css`. CI runs on a clean checkout so the diff cleanly isolates
// drift. Locally — especially as a pre-push hook — a user mid-edit may
// have legitimate WIP in those files, and the check would fire on the
// WIP rather than on real drift.
//
// Strategy: per file, skip the check (with a warning) if the file is
// already dirty in the working tree before the build. The build will
// still regenerate; if there was *additional* drift on top of the WIP,
// it just won't be caught here — but CI catches it anyway. Other 11
// checks still run.
function isDirty(file) {
  return spawnSync('git', ['diff', '--quiet', '--', file]).status !== 0;
}

const driftSkippable = ['packages/ui/src/styles/tokens.css', 'DESIGN.md', 'packages/ui/TOKENS.md'].filter(isDirty);
if (driftSkippable.length > 0) {
  console.log(`(skipping sync drift checks for dirty files: ${driftSkippable.join(', ')} — CI's clean checkout will still catch drift)`);
}
const driftStep = (label, file) => isDirty(file)
  ? [`${label} (skipped — dirty)`, ['true']]
  : [label, ['git', 'diff', '--exit-code', file]];

const STEPS = [
  ['Build @polaris/ui',                ['pnpm', '--filter', '@polaris/ui', 'build']],
  driftStep('Verify token sync',          'packages/ui/src/styles/tokens.css'),
  driftStep('Verify TOKENS.md sync',      'packages/ui/TOKENS.md'),
  driftStep('Verify DESIGN.md sync',      'DESIGN.md'),
  ['Verify root version sync',         ['node', 'scripts/sync-root-version.mjs', '--check']],
  ['Build @polaris/lint',              ['pnpm', '--filter', '@polaris/lint', 'build']],
  // v0.8 release-gate: catch dead-class / dead-token usage in @polaris/ui
  // sources before they ship. Codex review found 5 components on
  // `bg-surface-border*` after rc.0 because no automated check covered
  // the package's own source. We scope to `components/` and `ribbon/`
  // since `tokens/` and `tailwind/` legitimately mention legacy names
  // in JSDoc / migration comments (codemod would false-positive there).
  ['Check ui sources for deprecated alias',
                                       ['node', 'packages/lint/bin/polaris-codemod-v08.mjs', '--check',
                                        'packages/ui/src/components',
                                        'packages/ui/src/ribbon']],
  ['Typecheck (all packages)',         ['pnpm', '-r', 'typecheck']],
  ['Test — @polaris/ui',               ['pnpm', '--filter', '@polaris/ui', 'test']],
  ['Test — @polaris/lint rules',       ['pnpm', '--filter', '@polaris/lint', 'test']],
  ['Test — @polaris/plugin hook',      ['pnpm', '--filter', '@polaris/plugin', 'test']],
  ['Lint — demo',                      ['pnpm', '--filter', 'demo', 'lint']],
  ['Lint — template-next (strict)',    ['pnpm', '--filter', 'polaris-template-next', 'lint']],
  ['Build — demo',                     ['pnpm', '--filter', 'demo', 'build']],
  ['Build — template-next',            ['pnpm', '--filter', 'polaris-template-next', 'build']],
];

if (withE2E) {
  STEPS.push(['E2E visual regression', ['pnpm', 'test:e2e']]);
}

const results = [];
let firstFailure = -1;

for (let i = 0; i < STEPS.length; i++) {
  const [label, cmd] = STEPS[i];
  process.stdout.write(`[${String(i + 1).padStart(2)}/${STEPS.length}] ${label} … `);
  const t0 = Date.now();
  const r = spawnSync(cmd[0], cmd.slice(1), {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  const ms = Date.now() - t0;
  const ok = r.status === 0;
  results.push({ label, cmd: cmd.join(' '), ms, ok, stdout: r.stdout, stderr: r.stderr, code: r.status });
  process.stdout.write(`${ok ? '✓' : '✗'} (${(ms / 1000).toFixed(1)}s)\n`);
  if (!ok) {
    firstFailure = i;
    break;
  }
}

const total = ((Date.now() - start) / 1000).toFixed(1);

if (firstFailure === -1) {
  console.log(`\n✓ ${STEPS.length} checks passed in ${total}s${withE2E ? '' : ' (e2e skipped — pass --with-e2e to include)'}`);
  process.exit(0);
}

const failed = results[firstFailure];
console.log(`\n✗ FAILED at step ${firstFailure + 1}/${STEPS.length}: ${failed.label}\n`);
console.log(`Command: ${failed.cmd}`);
console.log(`Exit:    ${failed.code}\n`);
if (failed.stdout) {
  console.log('--- stdout (last 60 lines) ---');
  console.log(failed.stdout.split('\n').slice(-60).join('\n'));
}
if (failed.stderr) {
  console.log('\n--- stderr (last 30 lines) ---');
  console.log(failed.stderr.split('\n').slice(-30).join('\n'));
}
console.log(`\n${firstFailure} of ${STEPS.length} steps passed before failure (${total}s elapsed).`);
process.exit(1);
