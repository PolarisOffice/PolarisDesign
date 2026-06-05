import { forwardRef, useId, type ReactNode } from 'react';
import { Checkbox } from './Checkbox';
import { ErrorIcon } from '../icons';
import { cn } from '../lib/cn';

/* ================================================================== *
 * CheckboxGroup — multi-select group with shared label + a11y
 * (v0.8.0-rc.9 NEW — follow-up A3 from design-team)
 * ================================================================== *
 *
 * Common admin / settings pattern: "구독 이벤트", "권한 부여", "알림 종류"
 * — a labeled fieldset of related checkboxes laid out as a responsive
 * grid. Consumers used to assemble this by hand with native `<fieldset>`
 * + raw `<Checkbox>` + manual layout / value accumulation. CheckboxGroup
 * bundles the standard pattern.
 *
 * Compared to a single `<Checkbox>`:
 *   - Renders a real `<fieldset>` + `<legend>` for screen reader grouping
 *   - Auto-manages array state via `value: string[]` + `onValueChange`
 *   - Lays children out as a responsive grid (`cols={1|2|3|4}`)
 *   - Shared `helperText` / `error` below the whole group
 *
 * @example
 * ```tsx
 * <CheckboxGroup
 *   label="구독 이벤트"
 *   cols={4}
 *   value={events}
 *   onValueChange={setEvents}
 * >
 *   <CheckboxGroupItem value="view" label="열람 성공(view)" />
 *   <CheckboxGroupItem value="download" label="다운로드(download)" />
 *   <CheckboxGroupItem value="denied" label="접근 거부(denied)" />
 *   <CheckboxGroupItem value="email_submitted" label="이메일 제출(email_submitted)" />
 *   <CheckboxGroupItem value="password_failed" label="비밀번호 실패(password_failed)" />
 * </CheckboxGroup>
 * ```
 *
 * For *single-select* (mutually exclusive) groups, use `<RadioGroup>` —
 * same layout / API shape but radio semantics.
 */

interface CheckboxGroupContextValue {
  name?: string;
  value: ReadonlyArray<string>;
  onItemToggle: (itemValue: string, next: boolean) => void;
  /** When the group is in error state, items pass `error` flag through to Checkbox styling. */
  hasError: boolean;
}

// Lightweight context — created inside CheckboxGroup and consumed by
// CheckboxGroupItem. We avoid React.createContext to keep the bundle
// small; each item gets the context via React.cloneElement instead.
// (See implementation below.)

export interface CheckboxGroupProps
  extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** Group legend rendered above the checkbox grid (in `<legend>`). */
  label?: ReactNode;
  /** Helper text below the whole group. */
  helperText?: ReactNode;
  /** Error message — same ErrorIcon-prefix layout as form fields. */
  error?: ReactNode;
  /** Form name shared by all items (each item's input gets `name={...}`). */
  name?: string;
  /** Selected values. Pair with `onValueChange`. */
  value?: ReadonlyArray<string>;
  /** Fires with the new selection array (immutable). */
  onValueChange?: (next: string[]) => void;
  /** Grid columns at md+. Default: 4. Mobile collapses to 1, sm to 2. */
  cols?: 1 | 2 | 3 | 4;
  /** Class for the outer fieldset container. */
  containerClassName?: string;
  /** Class for the inner grid. */
  gridClassName?: string;
  /** Items — typically `<CheckboxGroupItem value label />` children. */
  children: ReactNode;
}

const COLS_CLASS: Record<NonNullable<CheckboxGroupProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
};

// Context implementation. Using React.createContext directly so it's
// inspectable in devtools + plays nicely with the test environment.
import { createContext, useContext } from 'react';
const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  (
    {
      label,
      helperText,
      error,
      name,
      value = [],
      onValueChange,
      cols = 4,
      containerClassName,
      gridClassName,
      children,
      ...fieldsetProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = generatedId;
    const messageId = error || helperText ? `${id}-msg` : undefined;
    const isError = Boolean(error);

    const onItemToggle = (itemValue: string, next: boolean) => {
      if (!onValueChange) return;
      const current = [...value];
      if (next) {
        if (!current.includes(itemValue)) current.push(itemValue);
      } else {
        const idx = current.indexOf(itemValue);
        if (idx >= 0) current.splice(idx, 1);
      }
      onValueChange(current);
    };

    return (
      <fieldset
        ref={ref}
        className={cn(
          'flex flex-col gap-polaris-2xs font-polaris',
          'border-0 p-0 m-0', // reset native fieldset chrome
          containerClassName,
        )}
        aria-invalid={isError || undefined}
        aria-describedby={messageId}
        {...fieldsetProps}
      >
        {label && (
          <legend className="text-polaris-body3 text-label-neutral">
            {label}
          </legend>
        )}
        <CheckboxGroupContext.Provider value={{ name, value, onItemToggle, hasError: isError }}>
          <div className={cn('grid gap-polaris-2xs', COLS_CLASS[cols], gridClassName)}>
            {children}
          </div>
        </CheckboxGroupContext.Provider>
        {error ? (
          <p
            id={messageId}
            role="alert"
            className="flex items-start gap-polaris-3xs text-polaris-helper text-state-error"
          >
            <ErrorIcon size={16} className="shrink-0 mt-px" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={messageId} className="text-polaris-helper text-label-alternative">
            {helperText}
          </p>
        ) : null}
      </fieldset>
    );
  },
);
CheckboxGroup.displayName = 'CheckboxGroup';

/* ─── CheckboxGroupItem ──────────────────────────────────────────── */

export interface CheckboxGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'value' | 'checked' | 'onCheckedChange' | 'name'> {
  /** Unique value within the group — added to / removed from the group's `value` array. */
  value: string;
  /** Visible label rendered to the right of the box. */
  label?: ReactNode;
}

export const CheckboxGroupItem = forwardRef<
  React.ElementRef<typeof Checkbox>,
  CheckboxGroupItemProps
>(({ value, label, ...rest }, ref) => {
  const ctx = useContext(CheckboxGroupContext);
  if (!ctx) {
    // Useful dev error — using <CheckboxGroupItem> outside <CheckboxGroup>
    // would silently fall back to native <Checkbox> behavior, which is
    // confusing. Throwing makes the misuse loud.
    throw new Error(
      'CheckboxGroupItem must be rendered inside <CheckboxGroup>. For standalone usage, use <Checkbox> directly.',
    );
  }
  const checked = ctx.value.includes(value);
  return (
    <Checkbox
      ref={ref}
      label={label}
      checked={checked}
      onCheckedChange={(next) => ctx.onItemToggle(value, next === true)}
      name={ctx.name}
      value={value}
      {...rest}
    />
  );
});
CheckboxGroupItem.displayName = 'CheckboxGroupItem';
