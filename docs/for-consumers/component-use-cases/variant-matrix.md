# Variant 매트릭스 — Polaris Design System

> 컴포넌트별 `variant` prop 의 *어휘 차이* 와 *의미 매핑* 가이드. 컨슈머 피드백 (rc.10) 에서 "컴포넌트마다 variant 단어가 달라서 옮길 때 헷갈린다" 를 해결하기 위한 단일 참조표.
>
> spec 자체는 [`/DESIGN.md`](../../../DESIGN.md), 본 문서는 *컴포넌트 × variant* 매핑 + 의미 일관성만 다룹니다.

---

## 한눈 매트릭스

각 컬럼은 *의미 (semantic intent)*, 각 행은 컴포넌트의 그 의미에 해당하는 `variant` 값.

| 의미 | Badge | Button | Stat (`deltaVariant`) | Alert / Toast | Checkbox / Switch / RadioGroup |
|---|---|---|---|---|---|
| **기본 / 중립** | `neutral` | — *(default: `primary`)* | `neutral` | `neutral` | `default` |
| **브랜드 강조** | `primary` | `primary` | — | — | — |
| **AI / NOVA** | `secondary` | `ai` | — | — | `ai` |
| **성공 / 긍정** | `success` | — | **`positive`** | `success` | — |
| **경고** | `warning` | — | — | `warning` | — |
| **정보** | `info` | — | — | `info` | — |
| **에러 / 부정** | `danger` | `danger` | **`negative`** | `danger` | — |
| **계층 / 보조** | — | `secondary` / `tertiary` / `ghost` / `dark` | `accent` | — | — |
| **파일 타입 (docx/xlsx/pptx/pdf/hwp)** | `docx` / `xlsx` / `pptx` / `pdf` / `hwp` | — | — | — | — |

— 셀은 *해당 컴포넌트가 그 의미를 지원하지 않음* 을 뜻합니다.

---

## ⚠ 두 가지 footgun

### 1. `Stat` 의 `positive` ↔ 다른 컴포넌트의 `success`

**의도적 차이**: `Stat` 은 KPI delta (전월 대비, 매출 변화 등) 의 *수치적 방향* 이라서 `positive`/`negative` 어휘를 씁니다. 다른 컴포넌트의 `success`/`danger` 는 *상태/결과* 의미.

```tsx
// 동일한 시각 (초록색), 다른 단어
<Badge variant="success">완료</Badge>       // 상태 = 성공
<Stat deltaVariant="positive" delta="+12%"/> // 수치 = 증가

<Badge variant="danger">실패</Badge>         // 상태 = 실패
<Stat deltaVariant="negative" delta="-3%"/>  // 수치 = 감소
```

매핑 규칙:
- 상태/결과 → `success` / `danger` (Badge, Alert, Toast 등)
- 수치/변화량 → `positive` / `negative` (Stat 전용)

### 2. `Button` 에는 `success`/`warning`/`info` 가 없음

**의도적 부재**: 버튼은 *사용자가 액션을 취하는* 컨트롤. "성공한 버튼"/"경고 버튼" 은 의미가 모호 — 액션을 *방해* 합니다. 대신 `Alert` / `Toast` 로 시스템 메시지를 전달.

```tsx
// ❌ 안티 패턴 (지원 안 됨)
<Button variant="success">저장</Button>

// ✅ 권장
<Button variant="primary">저장</Button>
// 저장 성공 후:
toast({ variant: 'success', title: '저장됨' });
```

위험 액션 (삭제 등) 만 예외로 `danger` 지원:

```tsx
<Button variant="danger">계정 삭제</Button>
```

---

## 컴포넌트별 전체 variant 리스트

### `<Badge>`

| variant | 용도 | 토큰 |
|---|---|---|
| `neutral` | 일반 태그 | label-neutral |
| `primary` | 브랜드 강조 | accent-brand-normal |
| `secondary` | AI / NOVA 컨텍스트 | ai-normal |
| `success` | 완료 / active 상태 | state-success |
| `warning` | 보류 / 검토 필요 | state-warning |
| `danger` | 거절 / 실패 / 오류 | state-error |
| `info` | 안내 / 진행 중 | state-info |
| `docx` / `xlsx` / `pptx` / `pdf` / `hwp` | 파일 타입 표시 | file-* |

`tone` (별도 axis): `subtle` (기본, 옅은 bg) / `solid` (꽉찬 bg) / `outline`.

### `<Button>`

| variant | 용도 |
|---|---|
| `primary` (기본) | 주 액션 — 폼 제출, 저장, 다음 단계 |
| `secondary` | 보조 액션 — 같은 화면의 다음 우선순위 |
| `tertiary` | 3단계 액션 — 인라인 옵션 |
| `ghost` | 비강조 액션 — 취소, 닫기 |
| `dark` | 다크 톤 강조 (드물게 사용) |
| `ai` | AI 액션 — NOVA 트리거, AI 기능 시작 |
| `danger` | 파괴적 액션 — 삭제, 영구 차단 |

`size`: `xs` (24) / `sm` (32) / `md` (40, 기본) / `lg` (48) / `xl` (54) / `2xl` (64).

### `<Stat>` (`deltaVariant`)

| variant | 용도 |
|---|---|
| `neutral` (기본) | delta 정보 표시 — 색 강조 없음 |
| `accent` | 브랜드 컬러로 강조 |
| `positive` | 수치 증가 → 초록 (`state-success` 와 동일 hex) |
| `negative` | 수치 감소 → 빨강 (`state-error` 와 동일 hex) |

### `<Alert>` / `<Toast>`

| variant | 용도 | 아이콘 |
|---|---|---|
| `neutral` (기본) | 일반 안내 | — |
| `success` | 작업 성공 알림 | ✓ |
| `warning` | 주의 필요 | ⚠ |
| `info` | 진행 상황 / 팁 | i |
| `danger` | 에러 / 실패 | ⚠ |

### `<Checkbox>` / `<Switch>` / `<RadioGroup>`

| variant | 용도 |
|---|---|
| `default` (기본) | 브랜드 블루 |
| `ai` | NOVA Purple — Button `variant="ai"` 와 페어 |

---

## 디자인 결정 — 왜 어휘가 안 맞춰지나

| 결정 | 사유 |
|---|---|
| `Stat positive/negative` 유지 | KPI delta 는 수치 *방향* 의미. `success/failure` 는 부적절 (성공한 매출 감소?) |
| `Button` 에 `success/warning/info` 미지원 | 액션은 결과를 *만들어내는* 것. 결과는 toast/alert 로. 버튼이 "성공 색" 이면 사용자가 결과를 *이미 받은 것처럼* 오인 |
| 파일 타입은 `Badge` 만 | docx/xlsx/pptx/pdf/hwp 는 파일 *유형 식별* — Badge 의 도메인 |
| `secondary` 가 Badge 에서 AI 인데 Button 에선 `ai` | Badge `secondary` 는 *2번째 강조* 라는 추상적 의미, Button 은 *액션 의도* 라서 명시적 `ai` 사용 — 둘 다 NOVA Purple |

---

## 마이그레이션 cheat sheet

다른 디자인 시스템 / 사내 직접 작성 컴포넌트에서 옮겨올 때:

| 자주 보는 어휘 | Polaris 매핑 |
|---|---|
| `default` | `neutral` (Badge/Alert/Toast/Stat) · `default` (Checkbox/Switch) · `primary` (Button) |
| `error` | `danger` |
| `positive` (Badge / Alert) | `success` |
| `negative` (Badge / Alert) | `danger` |
| `green` (semantic) | `success` 또는 `positive` (Stat) |
| `red` (semantic) | `danger` 또는 `negative` (Stat) |
| `outline` (Button) | `tertiary` 또는 `ghost` |
| `link` (Button) | `ghost` |
| `cta` (Button) | `primary` (`size="lg"` 또는 `"xl"` 조합) |

---

## 관련 문서

- [컴포넌트 spec (auto-gen)](../../../DESIGN.md)
- [컴포넌트 카탈로그](../../../packages/ui/COMPONENTS.md)
- [폼 패턴 가이드](form-patterns.md)
- [`<Badge>` 도메인 use case](badge.md)
