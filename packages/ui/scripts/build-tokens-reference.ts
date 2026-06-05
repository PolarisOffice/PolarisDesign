/**
 * Tokens reference — auto-gen TOKENS.md from `src/tokens/*.ts`.
 *
 * Why: consumer feedback (v0.8.0-rc.10) flagged that the CSS-variable
 * names aren't easy to look up. `tokens.md` is a *spec* document
 * (decisions / rationale). This file produces a flat *reference*: every
 * exported token row of {CSS variable name, Tailwind class, TS namespace
 * import, light hex, dark hex}.
 *
 * Output: packages/ui/TOKENS.md
 *
 * Usage:
 *   pnpm --filter @polaris/ui build:tokens-reference    # regenerate
 *   pnpm --filter @polaris/ui build                     # runs automatically
 *
 * CI: a check (sync) verifies the committed TOKENS.md matches what this
 * script would produce — see `.github/workflows/ci.yml`.
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  brandPalette,
  fileType,
  neutral,
  surface,
  label,
  background,
  layer,
  interaction,
  fill,
  line,
  accentBrand,
  accentAction,
  focus,
  staticColors,
  state,
  ai,
  radius,
  shadow,
  fontFamily,
  spacingNamed,
  duration,
  easing,
  zIndex,
  type ColorPair,
} from '../src/tokens';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../TOKENS.md');

const camelToKebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

type ColorGroup = Record<string, ColorPair>;

/** Same set / order as build-tokens.ts so the two files agree. */
const COLOR_GROUPS: Array<{ prefix: string; group: ColorGroup; nsExport: string }> = [
  { prefix: '',              group: brandPalette, nsExport: 'brandPalette' },
  { prefix: 'file',          group: fileType,     nsExport: 'fileType' },
  { prefix: 'neutral',       group: neutral,      nsExport: 'neutral' },
  { prefix: 'surface',       group: surface,      nsExport: 'surface' },
  { prefix: 'label',         group: label,        nsExport: 'label' },
  { prefix: 'background',    group: background,   nsExport: 'background' },
  { prefix: 'layer',         group: layer,        nsExport: 'layer' },
  { prefix: 'interaction',   group: interaction,  nsExport: 'interaction' },
  { prefix: 'fill',          group: fill,         nsExport: 'fill' },
  { prefix: 'line',          group: line,         nsExport: 'line' },
  { prefix: 'accent-brand',  group: accentBrand,  nsExport: 'accentBrand' },
  { prefix: 'accent-action', group: accentAction, nsExport: 'accentAction' },
  { prefix: 'focus',         group: focus,        nsExport: 'focus' },
  { prefix: 'static',        group: staticColors, nsExport: 'staticColors' },
  { prefix: 'state',         group: state,        nsExport: 'state' },
  { prefix: 'ai',            group: ai,           nsExport: 'ai' },
];

const HEADER = `# Polaris Design Tokens — Reference

> **AUTO-GENERATED** by \`packages/ui/scripts/build-tokens-reference.ts\`.
> Do not edit by hand — change the source modules in \`src/tokens/*.ts\`
> and run \`pnpm --filter @polaris/ui build:tokens-reference\`.
>
> 이 파일은 *어떤 변수가 있는지의 평면 레퍼런스*입니다. 토큰 *사양* (왜 / 어떻게 / dark pair) 은
> [\`/tokens.md\`](../../tokens.md) 를 보세요.

각 행은 다음 4가지 사용처를 한 번에 보여줍니다:

| 사용처 | 형식 |
|---|---|
| **CSS variable** | \`var(--polaris-NAME)\` — 인라인 CSS / 사내 컴포넌트 |
| **Tailwind class** | \`{prefix}-NAME\` 형태 (예: \`bg-accent-brand-normal\`, \`text-label-alternative\`) |
| **TS namespace** | \`import { NS } from '@polaris/ui/tokens'\` — JS 런타임에서 hex 직접 필요할 때 |
| **light / dark** | 라이트/다크 모드 hex (정합 검증용) |

---

`;

function colorTable(prefix: string, group: ColorGroup, nsExport: string): string {
  const rows: string[] = [];
  const tailwindHint = (key: string) => {
    const k = camelToKebab(key);
    return prefix ? `${prefix}-${k}` : k;
  };
  for (const [key, pair] of Object.entries(group)) {
    const varName = prefix ? `--polaris-${prefix}-${camelToKebab(key)}` : `--polaris-${camelToKebab(key)}`;
    const tw = tailwindHint(key);
    const tsRef = `${nsExport}.${key}`;
    rows.push(`| \`${varName}\` | \`${tw}\` | \`${tsRef}\` | \`${pair.light}\` | \`${pair.dark}\` |`);
  }
  return rows.join('\n');
}

/** Tokens stored as flat scalar maps (radius, shadow, fontFamily, spacing, motion, zIndex). */
function flatTable(prefix: string, group: Record<string, unknown>, nsExport: string): string {
  const rows: string[] = [];
  for (const [key, value] of Object.entries(group)) {
    const varName = `--polaris-${prefix}-${camelToKebab(key)}`;
    const tw = `${prefix}-${camelToKebab(key)}`;
    const tsRef = `${nsExport}.${key}`;
    // Coerce to string + escape pipes in CSS values (drop-shadow filters etc.)
    const displayValue = String(value).replace(/\|/g, '\\|');
    rows.push(`| \`${varName}\` | \`${tw}\` | \`${tsRef}\` | \`${displayValue}\` |`);
  }
  return rows.join('\n');
}

const sections: string[] = [];

sections.push(HEADER);

// ─── Color groups ─────────────────────────────────────────────
sections.push('## 1. 컬러 토큰\n');
sections.push(
  '> `var(--polaris-bg-...)` 처럼 직접 쓰거나, Tailwind 유틸리티 (`bg-...`, `text-...`, `border-...`) 로 접근. 텍스트 컬러는 Tailwind `text-` 와 충돌 방지를 위해 `text-fg-*` 로 노출됩니다 (`label.*` 토큰).\n',
);

for (const { prefix, group, nsExport } of COLOR_GROUPS) {
  const title = prefix || 'Brand palette (no prefix)';
  sections.push(`\n### 1.${COLOR_GROUPS.indexOf(COLOR_GROUPS.find((g) => g.prefix === prefix)!) + 1}. \`${title}\` (\`${nsExport}\`)\n`);
  sections.push(
    `| CSS 변수 | Tailwind | TS namespace | Light | Dark |\n|---|---|---|---|---|`,
  );
  sections.push(colorTable(prefix, group, nsExport));
}

// ─── Radius ──────────────────────────────────────────────────
sections.push('\n\n## 2. Radius\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('radius', radius as unknown as Record<string, unknown>, 'radius'));

// ─── Shadow ──────────────────────────────────────────────────
sections.push('\n\n## 3. Shadow\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('shadow', shadow as unknown as Record<string, unknown>, 'shadow'));

// ─── Font family ────────────────────────────────────────────
sections.push('\n\n## 4. Font family\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('font', fontFamily as unknown as Record<string, unknown>, 'fontFamily'));

// ─── Spacing (named) ─────────────────────────────────────────
sections.push('\n\n## 5. Spacing (named)\n');
sections.push(
  `> 4px scale 토큰 (\`4xs\` 2px, \`3xs\` 4px, …). Tailwind 는 \`p-polaris-...\`, \`m-polaris-...\`, \`gap-polaris-...\`.\n`,
);
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('spacing', spacingNamed as unknown as Record<string, unknown>, 'spacingNamed'));

// ─── Motion ─────────────────────────────────────────────────
sections.push('\n\n## 6. Motion — duration\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('duration', duration as unknown as Record<string, unknown>, 'duration'));
sections.push('\n\n### Motion — easing\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(flatTable('easing', easing as unknown as Record<string, unknown>, 'easing'));

// ─── Z-index ───────────────────────────────────────────────
sections.push('\n\n## 7. z-index\n');
sections.push(
  `| CSS 변수 | Tailwind | TS namespace | 값 |\n|---|---|---|---|`,
);
sections.push(
  flatTable('z', zIndex as unknown as Record<string, unknown>, 'zIndex'),
);

// ─── Footer ────────────────────────────────────────────────
sections.push('\n\n---\n');
sections.push(
  '## 사용 가이드\n\n' +
  '- **Tailwind 클래스 우선** — 99% 케이스는 `bg-accent-brand-normal`, `text-label-alternative` 등 유틸리티 클래스로 충분합니다.\n' +
  '- **CSS 변수 직접** — 사내 컴포넌트 / 인라인 스타일 / 외부 라이브러리에 hex 가 아닌 토큰을 주입해야 할 때: `style={{ backgroundColor: "var(--polaris-accent-brand-normal)" }}`.\n' +
  '- **TS namespace** — 런타임에 hex 가 *직접* 필요할 때 (chart.js 색상, canvas 그리기 등): `import { accentBrand } from "@polaris/ui/tokens"; accentBrand.normal.light`.\n' +
  '- **하드코딩 금지** — 어떤 경우에도 hex 직접 쓰지 마세요. 다크모드 페어 / 토큰 변경 시 자동 전파 끊김.\n\n' +
  '관련: [`tokens.md`](../../tokens.md) (사양 + 결정 사유) · [`/DESIGN.md`](../../DESIGN.md) (컴포넌트 spec).\n',
);

writeFileSync(OUTPUT, sections.join('\n') + '\n', 'utf-8');
console.log(`✓ Wrote ${OUTPUT}`);
