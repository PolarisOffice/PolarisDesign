# Polaris Design Tokens — Reference

> **AUTO-GENERATED** by `packages/ui/scripts/build-tokens-reference.ts`.
> Do not edit by hand — change the source modules in `src/tokens/*.ts`
> and run `pnpm --filter @polaris/ui build:tokens-reference`.
>
> 이 파일은 *어떤 변수가 있는지의 평면 레퍼런스*입니다. 토큰 *사양* (왜 / 어떻게 / dark pair) 은
> [`/tokens.md`](../../tokens.md) 를 보세요.

각 행은 다음 4가지 사용처를 한 번에 보여줍니다:

| 사용처 | 형식 |
|---|---|
| **CSS variable** | `var(--polaris-NAME)` — 인라인 CSS / 사내 컴포넌트 |
| **Tailwind class** | `{prefix}-NAME` 형태 (예: `bg-accent-brand-normal`, `text-label-alternative`) |
| **TS namespace** | `import { NS } from '@polaris/ui/tokens'` — JS 런타임에서 hex 직접 필요할 때 |
| **light / dark** | 라이트/다크 모드 hex (정합 검증용) |

---


## 1. 컬러 토큰

> `var(--polaris-bg-...)` 처럼 직접 쓰거나, Tailwind 유틸리티 (`bg-...`, `text-...`, `border-...`) 로 접근. 텍스트 컬러는 Tailwind `text-` 와 충돌 방지를 위해 `text-fg-*` 로 노출됩니다 (`label.*` 토큰).


### 1.1. `Brand palette (no prefix)` (`brandPalette`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-blue` | `blue` | `brandPalette.blue` | `#1D7FF9` | `#5C9FFF` |
| `--polaris-green` | `green` | `brandPalette.green` | `#51B41B` | `#3FCB72` |
| `--polaris-orange` | `orange` | `brandPalette.orange` | `#FD8900` | `#FF8F4D` |
| `--polaris-red` | `red` | `brandPalette.red` | `#F95C5C` | `#FF6962` |
| `--polaris-purple` | `purple` | `brandPalette.purple` | `#6F3AD0` | `#9B85FF` |

### 1.2. `file` (`fileType`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-file-docx` | `file-docx` | `fileType.docx` | `#1D7FF9` | `#5C9FFF` |
| `--polaris-file-hwp` | `file-hwp` | `fileType.hwp` | `#1D7FF9` | `#5C9FFF` |
| `--polaris-file-xlsx` | `file-xlsx` | `fileType.xlsx` | `#51B41B` | `#3FCB72` |
| `--polaris-file-pptx` | `file-pptx` | `fileType.pptx` | `#FD8900` | `#FF8F4D` |
| `--polaris-file-pdf` | `file-pdf` | `fileType.pdf` | `#F95C5C` | `#FF6962` |

### 1.3. `neutral` (`neutral`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-neutral-0` | `neutral-0` | `neutral.0` | `#FFFFFF` | `#0B0B12` |
| `--polaris-neutral-50` | `neutral-50` | `neutral.50` | `#FAFAFB` | `#131320` |
| `--polaris-neutral-100` | `neutral-100` | `neutral.100` | `#F4F4F7` | `#1B1B2A` |
| `--polaris-neutral-200` | `neutral-200` | `neutral.200` | `#E8E8EE` | `#232336` |
| `--polaris-neutral-300` | `neutral-300` | `neutral.300` | `#D5D5DE` | `#2D2D45` |
| `--polaris-neutral-400` | `neutral-400` | `neutral.400` | `#B5B5C4` | `#4A4A66` |
| `--polaris-neutral-500` | `neutral-500` | `neutral.500` | `#8C8CA0` | `#6B6B85` |
| `--polaris-neutral-600` | `neutral-600` | `neutral.600` | `#6E6E84` | `#8B8BA3` |
| `--polaris-neutral-700` | `neutral-700` | `neutral.700` | `#4F4F63` | `#B4B4C8` |
| `--polaris-neutral-800` | `neutral-800` | `neutral.800` | `#2F2F40` | `#D5D5DE` |
| `--polaris-neutral-900` | `neutral-900` | `neutral.900` | `#1A1A26` | `#EDEDF2` |
| `--polaris-neutral-1000` | `neutral-1000` | `neutral.1000` | `#0B0B12` | `#FFFFFF` |

### 1.4. `surface` (`surface`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-surface-popover` | `surface-popover` | `surface.popover` | `#FFFFFF` | `#232336` |
| `--polaris-surface-modal` | `surface-modal` | `surface.modal` | `#FFFFFF` | `#2D2D45` |

### 1.5. `label` (`label`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-label-normal` | `label-normal` | `label.normal` | `#26282B` | `#D8D8D8` |
| `--polaris-label-neutral` | `label-neutral` | `label.neutral` | `#454C53` | `#9E9E9E` |
| `--polaris-label-alternative` | `label-alternative` | `label.alternative` | `#72787F` | `#797979` |
| `--polaris-label-assistive` | `label-assistive` | `label.assistive` | `#9EA4AA` | `#6B6B6B` |
| `--polaris-label-inverse` | `label-inverse` | `label.inverse` | `#FFFFFF` | `#232323` |
| `--polaris-label-disabled` | `label-disabled` | `label.disabled` | `#C9CDD2` | `#595959` |

### 1.6. `background` (`background`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-background-base` | `background-base` | `background.base` | `#FFFFFF` | `#232323` |
| `--polaris-background-disabled` | `background-disabled` | `background.disabled` | `#F2F4F6` | `#2D2D2D` |

### 1.7. `layer` (`layer`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-layer-surface` | `layer-surface` | `layer.surface` | `#FFFFFF` | `#282828` |
| `--polaris-layer-overlay` | `layer-overlay` | `layer.overlay` | `rgba(0, 0, 0, 0.5)` | `rgba(0, 0, 0, 0.5)` |

### 1.8. `interaction` (`interaction`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-interaction-hover` | `interaction-hover` | `interaction.hover` | `#F2F4F6` | `#4A4A4A` |
| `--polaris-interaction-pressed` | `interaction-pressed` | `interaction.pressed` | `#E8EBED` | `#595959` |

### 1.9. `fill` (`fill`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-fill-neutral` | `fill-neutral` | `fill.neutral` | `#F7F8F9` | `#2D2D2D` |
| `--polaris-fill-normal` | `fill-normal` | `fill.normal` | `#F2F4F6` | `#3B3B3B` |
| `--polaris-fill-strong` | `fill-strong` | `fill.strong` | `#E8EBED` | `#595959` |

### 1.10. `line` (`line`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-line-neutral` | `line-neutral` | `line.neutral` | `#E8EBED` | `#3B3B3B` |
| `--polaris-line-normal` | `line-normal` | `line.normal` | `#C9CDD2` | `#595959` |
| `--polaris-line-strong` | `line-strong` | `line.strong` | `#B3B8BD` | `#6B6B6B` |
| `--polaris-line-disabled` | `line-disabled` | `line.disabled` | `#F2F4F6` | `#2D2D2D` |

### 1.11. `accent-brand` (`accentBrand`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-accent-brand-normal` | `accent-brand-normal` | `accentBrand.normal` | `#1D7FF9` | `#1D7FF9` |
| `--polaris-accent-brand-strong` | `accent-brand-strong` | `accentBrand.strong` | `#1458AD` | `#60A5FA` |
| `--polaris-accent-brand-bg` | `accent-brand-bg` | `accentBrand.bg` | `#D9EAFF` | `#0B3263` |
| `--polaris-accent-brand-bg-hover` | `accent-brand-bg-hover` | `accentBrand.bgHover` | `#BBD8FD` | `#0F4588` |
| `--polaris-accent-brand-normal-subtle` | `accent-brand-normal-subtle` | `accentBrand.normalSubtle` | `#E8F2FE` | `#1A2238` |

### 1.12. `accent-action` (`accentAction`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-accent-action-normal` | `accent-action-normal` | `accentAction.normal` | `#000000` | `#FFFFFF` |
| `--polaris-accent-action-strong` | `accent-action-strong` | `accentAction.strong` | `#454C53` | `#F2F4F6` |

### 1.13. `focus` (`focus`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-focus-ring` | `focus-ring` | `focus.ring` | `#60A5FA` | `#60A5FA` |

### 1.14. `static` (`staticColors`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-static-white` | `static-white` | `staticColors.white` | `#FFFFFF` | `#FFFFFF` |
| `--polaris-static-black` | `static-black` | `staticColors.black` | `#000000` | `#000000` |

### 1.15. `state` (`state`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-state-new` | `state-new` | `state.new` | `#FB4949` | `#FB4949` |
| `--polaris-state-success` | `state-success` | `state.success` | `#51B41B` | `#51B41B` |
| `--polaris-state-success-bg` | `state-success-bg` | `state.successBg` | `#EDF7E8` | `#20480A` |
| `--polaris-state-warning` | `state-warning` | `state.warning` | `#FD8900` | `#FD8900` |
| `--polaris-state-warning-bg` | `state-warning-bg` | `state.warningBg` | `#FEF3E5` | `#653600` |
| `--polaris-state-error` | `state-error` | `state.error` | `#F95C5C` | `#F95C5C` |
| `--polaris-state-error-bg` | `state-error-bg` | `state.errorBg` | `#FEEEEE` | `#632424` |
| `--polaris-state-info` | `state-info` | `state.info` | `#1D7FF9` | `#1D7FF9` |
| `--polaris-state-info-bg` | `state-info-bg` | `state.infoBg` | `#E8F2FE` | `#0B3263` |
| `--polaris-state-success-strong` | `state-success-strong` | `state.successStrong` | `#387D12` | `#A8D98D` |
| `--polaris-state-warning-strong` | `state-warning-strong` | `state.warningStrong` | `#B05F00` | `#FEC47F` |
| `--polaris-state-error-strong` | `state-error-strong` | `state.errorStrong` | `#AD4040` | `#FCADAD` |
| `--polaris-state-info-strong` | `state-info-strong` | `state.infoStrong` | `#1458AD` | `#8EBFFC` |

### 1.16. `ai` (`ai`)

| CSS 변수 | Tailwind | TS namespace | Light | Dark |
|---|---|---|---|---|
| `--polaris-ai-normal` | `ai-normal` | `ai.normal` | `#6F3AD0` | `#9B85FF` |
| `--polaris-ai-strong` | `ai-strong` | `ai.strong` | `#511BB2` | `#A896FF` |
| `--polaris-ai-hover` | `ai-hover` | `ai.hover` | `#F5F1FD` | `#2A2247` |
| `--polaris-ai-pressed` | `ai-pressed` | `ai.pressed` | `#E0D1FF` | `#3E0F8D` |


## 2. Radius

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-radius-2xs` | `radius-2xs` | `radius.2xs` | `2px` |
| `--polaris-radius-xs` | `radius-xs` | `radius.xs` | `4px` |
| `--polaris-radius-sm` | `radius-sm` | `radius.sm` | `8px` |
| `--polaris-radius-md` | `radius-md` | `radius.md` | `12px` |
| `--polaris-radius-lg` | `radius-lg` | `radius.lg` | `16px` |
| `--polaris-radius-xl` | `radius-xl` | `radius.xl` | `24px` |
| `--polaris-radius-2xl` | `radius-2xl` | `radius.2xl` | `38px` |
| `--polaris-radius-pill` | `radius-pill` | `radius.pill` | `9999px` |


## 3. Shadow

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-shadow-light` | `shadow-light` | `shadow.light` | `[object Object]` |
| `--polaris-shadow-dark` | `shadow-dark` | `shadow.dark` | `[object Object]` |


## 4. Font family

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-font-sans` | `font-sans` | `fontFamily.sans` | `"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif` |
| `--polaris-font-mono` | `font-mono` | `fontFamily.mono` | `"JetBrains Mono", "D2Coding", ui-monospace, monospace` |


## 5. Spacing (named)

> 4px scale 토큰 (`4xs` 2px, `3xs` 4px, …). Tailwind 는 `p-polaris-...`, `m-polaris-...`, `gap-polaris-...`.

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-spacing-none` | `spacing-none` | `spacingNamed.none` | `0` |
| `--polaris-spacing-4xs` | `spacing-4xs` | `spacingNamed.4xs` | `2px` |
| `--polaris-spacing-3xs` | `spacing-3xs` | `spacingNamed.3xs` | `4px` |
| `--polaris-spacing-2xs` | `spacing-2xs` | `spacingNamed.2xs` | `8px` |
| `--polaris-spacing-xs` | `spacing-xs` | `spacingNamed.xs` | `12px` |
| `--polaris-spacing-sm` | `spacing-sm` | `spacingNamed.sm` | `16px` |
| `--polaris-spacing-md` | `spacing-md` | `spacingNamed.md` | `20px` |
| `--polaris-spacing-lg` | `spacing-lg` | `spacingNamed.lg` | `24px` |
| `--polaris-spacing-xl` | `spacing-xl` | `spacingNamed.xl` | `32px` |
| `--polaris-spacing-2xl` | `spacing-2xl` | `spacingNamed.2xl` | `40px` |
| `--polaris-spacing-3xl` | `spacing-3xl` | `spacingNamed.3xl` | `48px` |
| `--polaris-spacing-4xl` | `spacing-4xl` | `spacingNamed.4xl` | `64px` |


## 6. Motion — duration

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-duration-instant` | `duration-instant` | `duration.instant` | `100ms` |
| `--polaris-duration-fast` | `duration-fast` | `duration.fast` | `150ms` |
| `--polaris-duration-normal` | `duration-normal` | `duration.normal` | `250ms` |
| `--polaris-duration-slow` | `duration-slow` | `duration.slow` | `350ms` |


### Motion — easing

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-easing-in-out` | `easing-in-out` | `easing.inOut` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--polaris-easing-out` | `easing-out` | `easing.out` | `cubic-bezier(0, 0, 0.2, 1)` |
| `--polaris-easing-in` | `easing-in` | `easing.in` | `cubic-bezier(0.4, 0, 1, 1)` |


## 7. z-index

| CSS 변수 | Tailwind | TS namespace | 값 |
|---|---|---|---|
| `--polaris-z-base` | `z-base` | `zIndex.base` | `0` |
| `--polaris-z-dropdown` | `z-dropdown` | `zIndex.dropdown` | `100` |
| `--polaris-z-sticky` | `z-sticky` | `zIndex.sticky` | `200` |
| `--polaris-z-dim` | `z-dim` | `zIndex.dim` | `300` |
| `--polaris-z-modal` | `z-modal` | `zIndex.modal` | `400` |
| `--polaris-z-toast` | `z-toast` | `zIndex.toast` | `500` |


---

## 사용 가이드

- **Tailwind 클래스 우선** — 99% 케이스는 `bg-accent-brand-normal`, `text-label-alternative` 등 유틸리티 클래스로 충분합니다.
- **CSS 변수 직접** — 사내 컴포넌트 / 인라인 스타일 / 외부 라이브러리에 hex 가 아닌 토큰을 주입해야 할 때: `style={{ backgroundColor: "var(--polaris-accent-brand-normal)" }}`.
- **TS namespace** — 런타임에 hex 가 *직접* 필요할 때 (chart.js 색상, canvas 그리기 등): `import { accentBrand } from "@polaris/ui/tokens"; accentBrand.normal.light`.
- **하드코딩 금지** — 어떤 경우에도 hex 직접 쓰지 마세요. 다크모드 페어 / 토큰 변경 시 자동 전파 끊김.

관련: [`tokens.md`](../../tokens.md) (사양 + 결정 사유) · [`/DESIGN.md`](../../DESIGN.md) (컴포넌트 spec).

