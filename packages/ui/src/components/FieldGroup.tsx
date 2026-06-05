import { forwardRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/* ================================================================== *
 * FieldGroup — visual container for related form fields
 * (v0.8.0-rc.9 NEW)
 * ================================================================== *
 *
 * Wraps a *cluster of related form fields* — a checkbox + helper text,
 * a labeled toggle pair, an "options box" — in the standard surface
 * tint that signals "this is one logical setting unit, not three loose
 * fields". The webhook-subscription form is the canonical example:
 *
 *   [ name input ]   [ delivery target select ]
 *   [ webhook URL ]  [ signing secret ]
 *   ┌─────────────────────────────────────────┐
 *   │ ● 즉시 활성화                            │   ← FieldGroup boxed
 *   └─────────────────────────────────────────┘
 *   [ CheckboxGroup: 구독 이벤트 ]
 *
 * The boxed variant is `bg-fill-neutral` + `rounded-polaris-md` +
 * `p-polaris-md` — same surface tone as filled chips so it reads as
 * "secondary surface inside a form". The plain variant drops the bg
 * but keeps the inner spacing — useful when nesting inside an
 * already-tinted container (Card variant="padded", Drawer body, etc.).
 *
 * **Spec status**: design team confirmation pending — the boxed surface
 * is a recommendation from the consumer-feedback round (KCAS adoption
 * piece). Likely to be tuned (padding / radius / bg shade) once the
 * design team sees it in context. API itself is stable.
 *
 * @example
 * ```tsx
 * <FieldGroup label="기본 정보">
 *   <Input label="이름" />
 *   <SelectField label="유형"> ... </SelectField>
 * </FieldGroup>
 *
 * // Boxed — emphasizes a single setting cluster
 * <FieldGroup variant="boxed">
 *   <Checkbox label="즉시 활성화" defaultChecked />
 * </FieldGroup>
 * ```
 */
export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Optional label rendered above the group (no `<fieldset>`/`<legend>`
   * — pure visual heading). For ARIA-group semantics use
   * `<CheckboxGroup>` / `<RadioGroup>` instead.
   */
  label?: ReactNode;
  /** Helper text below the label, above the children. */
  description?: ReactNode;
  /**
   * - `plain` (default) — vertical stack with gap, no background
   * - `boxed` — adds `bg-fill-neutral` + radius + padding (the "options
   *   box" pattern used in admin / settings screens)
   */
  variant?: 'plain' | 'boxed';
  /** Gap between children. Default: `sm` (16px). */
  gap?: 'xs' | 'sm' | 'md' | 'lg';
}

const GAP_CLASS: Record<NonNullable<FieldGroupProps['gap']>, string> = {
  xs: 'gap-polaris-3xs',
  sm: 'gap-polaris-2xs',
  md: 'gap-polaris-sm',
  lg: 'gap-polaris-md',
};

export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  (
    {
      label,
      description,
      variant = 'plain',
      gap = 'sm',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'font-polaris',
          variant === 'boxed' && 'bg-fill-neutral rounded-polaris-md p-polaris-md',
          className,
        )}
        {...props}
      >
        {label && (
          <div className="mb-polaris-2xs">
            <div className="text-polaris-body3 text-label-neutral font-medium">{label}</div>
            {description && (
              <p className="text-polaris-helper text-label-alternative mt-polaris-4xs">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={cn('flex flex-col', GAP_CLASS[gap])}>{children}</div>
      </div>
    );
  },
);
FieldGroup.displayName = 'FieldGroup';
