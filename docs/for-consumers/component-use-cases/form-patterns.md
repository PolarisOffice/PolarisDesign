# Form 패턴 가이드 — Polaris Design System

> 폼 (form) 구성에 자주 등장하는 6가지 패턴과, 각각에 어떤 컴포넌트를 써야 하는지의 *결정 가이드*. spec 자체는 [`/DESIGN.md`](../../../DESIGN.md) 또는 컴포넌트 JSDoc, 본 문서는 *어떤 상황에 무엇을 쓰는가* 만 다룹니다.
>
> v0.8.0-rc.9 (2026-06-05) — KCAS-platform 컨슈머 피드백 + 후속 webhook 폼 케이스의 종합

---

## 폼 구성 시 6가지 정형 패턴

| # | 패턴 | 권장 컴포넌트 | 안티 패턴 |
|---|---|---|---|
| 1 | 단일 텍스트 / 숫자 입력 | `<Input label helperText error />` | label 없이 placeholder 만 두기 |
| 2 | 라벨 + Select / Combobox / DatePicker | `<SelectField>` / `<Combobox label>` / `<DatePicker label>` | Select 위에 직접 `<label>` 붙여서 한 줄 띄우기 |
| 3 | 단일 체크박스 / 토글 | `<Checkbox label>` / `<Switch label>` | div 옆에 raw checkbox 배치 |
| 4 | 다중 체크박스 그룹 | `<CheckboxGroup>` + `<CheckboxGroupItem>` | flex로 raw `<Checkbox>` 나열, fieldset 없음 |
| 5 | 단일 선택 (mutually exclusive) | `<RadioGroup>` + `<RadioGroupItem>` | `<Select>` 로 2~3개 옵션 처리 |
| 6 | 옵션 박스 / 설정 클러스터 | `<FieldGroup variant="boxed">` | div+회색 bg 직접 작성 |

---

## 1. 단일 텍스트 입력

### use when

- 1줄 짜리 텍스트 / URL / 숫자 입력

### 권장 코드

```tsx
import { Input } from '@polaris/ui';

<Input
  label="구독 이름"
  helperText="콘솔에 표시될 이름"
  placeholder="예: 보안 감사용 webhook"
  required
/>

// 에러 상태
<Input
  label="Webhook URL"
  type="url"
  error="https:// 로 시작해야 합니다"
  defaultValue="example.com/hook"
/>
```

### 안티 패턴

```tsx
// ❌ label 없이 placeholder 만으로 라벨 대체 → screen reader 가 읽지 못함
<Input placeholder="구독 이름" />
```

---

## 2. 라벨 + Select / Combobox / DatePicker

**v0.8.0-rc.9 신규**: `<Select>`/`<Combobox>`/`<DatePicker>`/`<DateRangePicker>` 에 모두 `label`/`helperText`/`error`/`containerClassName` 가 추가되었습니다. `<Input>` 과 동일한 *above-label* 패턴이 자동 적용됩니다.

### `<SelectField>` — Select 의 라벨 wrapper

기존 `<Select> + <SelectTrigger> + <SelectContent>` 패턴은 그대로 유지되며, 라벨이 필요한 1단계 wrapper 로 `<SelectField>` 를 새로 추가했습니다.

```tsx
import { SelectField, SelectItem } from '@polaris/ui';

<SelectField
  label="전달 대상"
  placeholder="선택하세요"
  defaultValue="slack"
  helperText="알림이 도착할 채널"
>
  <SelectItem value="slack">Slack</SelectItem>
  <SelectItem value="teams">Microsoft Teams</SelectItem>
  <SelectItem value="webhook">Custom Webhook</SelectItem>
</SelectField>
```

복잡한 케이스 (그룹, separator, custom trigger UI) 는 기존 `<Select>` + sub-components 사용. `<SelectField>` 는 90% 케이스를 한 줄로 줄이기 위한 prefab.

### `<Combobox label>` — 검색 가능한 선택

```tsx
import { Combobox } from '@polaris/ui';

<Combobox
  label="대상 사용자"
  options={users}
  multiple
  value={selectedUsers}
  onChange={setSelectedUsers}
  placeholder="이메일 검색"
  helperText="여러 명 선택 가능"
/>

// 에러 상태
<Combobox
  label="담당자"
  options={users}
  error="최소 1명 선택"
/>
```

### `<DatePicker label>` / `<DateRangePicker label>`

```tsx
import { DatePicker, DateRangePicker } from '@polaris/ui';

<DatePicker
  label="만료일"
  helperText="YYYY-MM-DD 형식"
  name="expiry"
/>

<DateRangePicker
  label="조회 기간"
  helperText="최대 31일"
  name="range"
/>
```

### 안티 패턴

```tsx
// ❌ label 위에 직접 글자 두고 SelectTrigger 만 따로 배치 → htmlFor 안 묶임, a11y X
<>
  <div>전달 대상</div>
  <Select> ... </Select>
</>

// ❌ Combobox 위에 label 직접 작성 — id 매칭 안됨
<>
  <label>대상</label>
  <Combobox options={...} />
</>
```

`label` 을 직접 prop 으로 넘기면 `useId()` 로 생성된 ID 가 자동으로 htmlFor↔id 짝지어집니다.

---

## 3. 단일 체크박스 / 토글

### Checkbox — boolean 선택

```tsx
import { Checkbox } from '@polaris/ui';

<Checkbox
  label="이용 약관에 동의합니다"
  helperText="필수"
  required
/>

// AI 컨텍스트 — NOVA Purple
<Checkbox variant="ai" label="AI 학습 데이터로 활용 동의" />
```

### Switch — 즉시 적용되는 on/off

```tsx
import { Switch } from '@polaris/ui';

<Switch
  label="이메일 알림"
  helperText="새 댓글이 달리면 즉시 전송"
  defaultChecked
/>
```

**Checkbox vs Switch 선택 기준**:
- 폼 안에서 *제출 시점에* 적용되는 boolean → **Checkbox**
- 변경 즉시 적용되는 설정 (toggle) → **Switch**

---

## 4. 다중 체크박스 그룹 ★ v0.8.0-rc.9 신규

여러 옵션을 *복수 선택* 하는 패턴. native `<fieldset>` + `<legend>` 가 자동으로 들어가서 screen reader 가 "라벨이 묶인 N개 체크박스 그룹" 으로 인식합니다.

```tsx
import { CheckboxGroup, CheckboxGroupItem } from '@polaris/ui';
import { useState } from 'react';

function SubscribeForm() {
  const [events, setEvents] = useState<string[]>([]);
  return (
    <CheckboxGroup
      label="구독 이벤트"
      helperText="최소 1개 이상 선택"
      cols={4}
      value={events}
      onValueChange={setEvents}
    >
      <CheckboxGroupItem value="view"             label="열람 성공(view)" />
      <CheckboxGroupItem value="download"         label="다운로드(download)" />
      <CheckboxGroupItem value="denied"           label="접근 거부(denied)" />
      <CheckboxGroupItem value="email_submitted"  label="이메일 제출(email_submitted)" />
      <CheckboxGroupItem value="password_failed"  label="비밀번호 실패(password_failed)" />
    </CheckboxGroup>
  );
}
```

### cols prop

| cols | mobile | sm (≥640px) | md (≥768px) |
|---|---|---|---|
| `1` | 1 | 1 | 1 |
| `2` | 1 | 2 | 2 |
| `3` | 1 | 2 | 3 |
| `4` (기본) | 1 | 2 | 4 |

### 에러 상태

```tsx
<CheckboxGroup
  label="권한"
  error="최소 1개 권한을 선택해야 합니다"
  value={[]}
>
  <CheckboxGroupItem value="read"   label="읽기" />
  <CheckboxGroupItem value="write"  label="쓰기" />
  <CheckboxGroupItem value="admin"  label="관리" />
</CheckboxGroup>
```

### 안티 패턴

```tsx
// ❌ flex + raw Checkbox 나열 → fieldset 없음, 그룹 라벨 미연결
<div className="flex flex-wrap gap-2">
  <span>구독 이벤트</span>
  <Checkbox label="열람" />
  <Checkbox label="다운로드" />
  ...
</div>

// ❌ CheckboxGroupItem 을 CheckboxGroup 밖에서 사용 → 런타임 throw
<CheckboxGroupItem value="x" label="x" /> // throws "must be rendered inside <CheckboxGroup>"
```

---

## 5. 단일 선택 (mutually exclusive) ★ v0.8.0-rc.9 신규

옵션이 *2~5개 정도* 이고 *서로 배타적* 일 때. Select 보다 한 눈에 비교 가능.

```tsx
import { RadioGroup, RadioGroupItem } from '@polaris/ui';
import { useState } from 'react';

function NotifyForm() {
  const [freq, setFreq] = useState('instant');
  return (
    <RadioGroup
      label="알림 빈도"
      cols={3}
      value={freq}
      onValueChange={setFreq}
    >
      <RadioGroupItem value="instant"  label="즉시 (실시간)" helperText="이벤트 발생 즉시 전송" />
      <RadioGroupItem value="hourly"   label="시간당 1회" />
      <RadioGroupItem value="daily"    label="하루 1회" helperText="오전 9시 기준" />
    </RadioGroup>
  );
}
```

### RadioGroup vs Select 선택 기준

- 옵션이 *6개 이상* → Select (공간 절약)
- 옵션이 *2~5개* 이고 한 눈에 비교가 도움 → **RadioGroup**
- 옵션마다 *설명이 필요* → **RadioGroup** (`<RadioGroupItem helperText>` 지원)

### AI 컨텍스트

```tsx
<RadioGroup variant="ai" label="NOVA 응답 스타일">
  <RadioGroupItem value="concise"  label="간결" />
  <RadioGroupItem value="detailed" label="상세" />
</RadioGroup>
```

---

## 6. 옵션 박스 / 설정 클러스터 ★ v0.8.0-rc.9 신규

여러 폼 필드 묶음을 *시각적으로 하나의 단위* 로 보여줘야 할 때 — 관리자 / 설정 화면의 "옵션 박스" 패턴.

### plain — 라벨링만 (회색 배경 X)

```tsx
import { FieldGroup, Input, SelectField, SelectItem } from '@polaris/ui';

<FieldGroup label="기본 정보" description="모든 필드는 필수입니다">
  <Input label="이름" />
  <SelectField label="유형">
    <SelectItem value="prod">프로덕션</SelectItem>
    <SelectItem value="staging">스테이징</SelectItem>
  </SelectField>
</FieldGroup>
```

### boxed — 회색 surface 강조

```tsx
import { FieldGroup, Checkbox } from '@polaris/ui';

// webhook 폼의 "즉시 활성화" 옵션 처럼 단일 강조 박스
<FieldGroup variant="boxed">
  <Checkbox label="즉시 활성화" helperText="저장 후 바로 이벤트 수신 시작" defaultChecked />
</FieldGroup>

// 여러 toggle 묶음
<FieldGroup variant="boxed" label="고급 옵션" description="대부분의 경우 기본값 권장">
  <Switch label="HMAC 서명 검증" defaultChecked />
  <Switch label="재시도 자동화" defaultChecked />
  <Switch label="감사 로그 보관 (90일)" />
</FieldGroup>
```

### 안티 패턴

```tsx
// ❌ div + 회색 background 직접 작성 → 토큰 일관성 깨짐
<div className="bg-gray-50 rounded p-4">
  <Checkbox label="즉시 활성화" />
</div>

// ✅ 대신 FieldGroup variant="boxed" 사용
<FieldGroup variant="boxed">
  <Checkbox label="즉시 활성화" />
</FieldGroup>
```

### FieldGroup vs CheckboxGroup/RadioGroup 선택 기준

- **CheckboxGroup / RadioGroup**: 같은 *질문* 에 대한 옵션 (semantic group)
- **FieldGroup**: 서로 다른 *필드들* 의 시각적 묶음 (visual grouping)

```
<FieldGroup label="webhook 설정">
  <Input label="URL" />
  <SelectField label="형식"> ... </SelectField>
  <CheckboxGroup label="구독 이벤트"> ... </CheckboxGroup>  ← FieldGroup 안에 CheckboxGroup 중첩 OK
  <FieldGroup variant="boxed">
    <Switch label="즉시 활성화" />
  </FieldGroup>
</FieldGroup>
```

---

## 종합 예시 — Webhook 구독 폼

KCAS-platform 컨슈머 피드백 + 후속 webhook 폼에서 도출된 *완전한 폼* 예시:

```tsx
import {
  Input,
  SelectField,
  SelectItem,
  Checkbox,
  CheckboxGroup,
  CheckboxGroupItem,
  FieldGroup,
  Button,
} from '@polaris/ui';
import { useState } from 'react';

export function WebhookSubscriptionForm() {
  const [events, setEvents] = useState<string[]>(['view', 'download']);
  return (
    <form className="flex flex-col gap-polaris-md">
      <FieldGroup label="기본 정보">
        <Input label="구독 이름" placeholder="예: 보안 감사용 webhook" required />
        <SelectField label="전달 대상" defaultValue="slack" required>
          <SelectItem value="slack">Slack</SelectItem>
          <SelectItem value="teams">Microsoft Teams</SelectItem>
          <SelectItem value="webhook">Custom Webhook</SelectItem>
        </SelectField>
      </FieldGroup>

      <Input
        label="Webhook URL"
        type="url"
        placeholder="https://hooks.slack.com/services/..."
        helperText="HTTPS 만 허용"
        required
      />

      <FieldGroup variant="boxed">
        <Checkbox label="즉시 활성화" helperText="저장 후 바로 이벤트 수신 시작" defaultChecked />
      </FieldGroup>

      <CheckboxGroup
        label="구독 이벤트"
        helperText="최소 1개 이상 선택"
        cols={4}
        value={events}
        onValueChange={setEvents}
      >
        <CheckboxGroupItem value="view"             label="열람 성공(view)" />
        <CheckboxGroupItem value="download"         label="다운로드(download)" />
        <CheckboxGroupItem value="denied"           label="접근 거부(denied)" />
        <CheckboxGroupItem value="email_submitted"  label="이메일 제출(email_submitted)" />
        <CheckboxGroupItem value="password_failed"  label="비밀번호 실패(password_failed)" />
      </CheckboxGroup>

      <div className="flex gap-polaris-2xs justify-end">
        <Button variant="ghost" type="button">취소</Button>
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
}
```

이 패턴은 KCAS 피드백에서 지적된 *"폼 구성 시 어떤 컴포넌트를 써야 할지 모르겠다"* 를 해결합니다.

---

## react-hook-form 통합

위 컴포넌트들은 모두 `@polaris/ui/form` subpath 의 `<FormField>` 와 페어로 동작합니다:

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@polaris/ui/form';
import { CheckboxGroup, CheckboxGroupItem } from '@polaris/ui';

<Form {...form}>
  <FormField
    control={form.control}
    name="events"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <CheckboxGroup
            label="구독 이벤트"
            value={field.value}
            onValueChange={field.onChange}
          >
            <CheckboxGroupItem value="view" label="열람" />
            <CheckboxGroupItem value="download" label="다운로드" />
          </CheckboxGroup>
        </FormControl>
      </FormItem>
    )}
  />
</Form>
```

`<FormField>` 가 이미 `<fieldset>` + 라벨링을 제공하면 `<CheckboxGroup label>` 은 생략 가능. 충돌 시 react-hook-form 의 라벨링이 우선.

---

## 관련 문서

- [컴포넌트 spec (auto-gen)](../../../DESIGN.md)
- [컴포넌트 카탈로그](../../../packages/ui/COMPONENTS.md)
- [`<Badge>` use case](badge.md)
- [컨슈머 마이그레이션 가이드](../migration/README.md)
