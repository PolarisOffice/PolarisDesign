import { forwardRef, useId, type ReactNode } from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { ErrorIcon } from '../icons';
import { cn } from '../lib/cn';

/* ================================================================== *
 * RadioGroup — single-select group with shared label + a11y
 * (v0.8.0-rc.9 NEW — follow-up A3 from design-team)
 * ================================================================== *
 *
 * The single-select sibling of `<CheckboxGroup>`. Same layout (fieldset
 * + legend + responsive grid) and API shape (label / helperText / error
 * / cols / value / onValueChange), but radio semantics: exactly one
 * item selected at a time, arrow-key navigation, `role="radiogroup"`
 * via Radix.
 *
 * Visual variants match `<Checkbox>`:
 *   - `default` (Brand Blue) — general use
 *   - `ai` (NOVA Purple) — AI / NOVA contexts (pair with `<Button variant="ai">`)
 *
 * @example
 * ```tsx
 * <RadioGroup
 *   label="알림 빈도"
 *   cols={3}
 *   value={frequency}
 *   onValueChange={setFrequency}
 * >
 *   <RadioGroupItem value="instant" label="즉시 (실시간)" />
 *   <RadioGroupItem value="hourly" label="시간당 1회" />
 *   <RadioGroupItem value="daily" label="하루 1회" />
 * </RadioGroup>
 * ```
 */

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'onValueChange'> {
  /** Group legend rendered above the radio grid. */
  label?: ReactNode;
  /** Helper text below the whole group. */
  helperText?: ReactNode;
  /** Error message — ErrorIcon-prefixed below the grid. */
  error?: ReactNode;
  /** Currently selected value. */
  value?: string;
  /** Fires when selection changes. */
  onValueChange?: (next: string) => void;
  /** Grid columns at md+. Default: 4. Mobile collapses to 1, sm to 2. */
  cols?: 1 | 2 | 3 | 4;
  /** Visual variant — `default` (Brand Blue) or `ai` (NOVA Purple). Default: `default`. */
  variant?: 'default' | 'ai';
  /** Class for the outer fieldset container. */
  containerClassName?: string;
  /** Class for the inner grid. */
  gridClassName?: string;
  /** Items — `<RadioGroupItem value label />` children. */
  children: ReactNode;
}

const COLS_CLASS: Record<NonNullable<RadioGroupProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
};

import { createContext, useContext } from 'react';
interface RadioGroupContextValue {
  variant: 'default' | 'ai';
  hasError: boolean;
}
const RadioGroupVariantContext = createContext<RadioGroupContextValue>({
  variant: 'default',
  hasError: false,
});

export const RadioGroup = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      label,
      helperText,
      error,
      cols = 4,
      variant = 'default',
      containerClassName,
      gridClassName,
      children,
      ...rootProps
    },
    ref,
  ) => {
    const id = useId();
    const messageId = error || helperText ? `${id}-msg` : undefined;
    const isError = Boolean(error);

    return (
      <fieldset
        className={cn(
          'flex flex-col gap-polaris-2xs font-polaris',
          'border-0 p-0 m-0',
          containerClassName,
        )}
        aria-invalid={isError || undefined}
        aria-describedby={messageId}
      >
        {label && (
          <legend className="text-polaris-body3 text-label-neutral">
            {label}
          </legend>
        )}
        <RadioGroupVariantContext.Provider value={{ variant, hasError: isError }}>
          <RadioGroupPrimitive.Root
            ref={ref}
            className={cn('grid gap-polaris-2xs', COLS_CLASS[cols], gridClassName)}
            {...rootProps}
          >
            {children}
          </RadioGroupPrimitive.Root>
        </RadioGroupVariantContext.Provider>
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
RadioGroup.displayName = 'RadioGroup';

/* ─── RadioGroupItem ──────────────────────────────────────────── */

export interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'children'> {
  /** Visible label rendered to the right of the radio circle. */
  label?: ReactNode;
  /** Helper text below the label. */
  helperText?: ReactNode;
  /** Container className wrapping the radio + label. */
  containerClassName?: string;
}

export const RadioGroupItem = forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ label, helperText, className, containerClassName, id: providedId, ...props }, ref) => {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const { variant, hasError } = useContext(RadioGroupVariantContext);

  const circle = (
    <RadioGroupPrimitive.Item
      id={id}
      ref={ref}
      className={cn(
        'peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-background-base transition-colors',
        'focus-visible:outline-none focus-visible:shadow-polaris-focus',
        'disabled:cursor-not-allowed disabled:opacity-50',
        // Default variant — Brand Blue
        variant === 'default' && [
          'border-line-normal',
          'data-[state=checked]:border-accent-brand-normal',
        ],
        // AI variant — NOVA Purple
        variant === 'ai' && [
          'border-line-normal',
          'data-[state=checked]:border-ai-normal',
        ],
        hasError && 'border-state-error focus-visible:outline-state-error',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        className={cn(
          'h-2 w-2 rounded-full',
          variant === 'default' && 'bg-accent-brand-normal',
          variant === 'ai' && 'bg-ai-normal',
        )}
      />
    </RadioGroupPrimitive.Item>
  );

  if (!label && !helperText) return circle;
  return (
    <div className={cn('flex items-start gap-2', containerClassName)}>
      {circle}
      <div className="flex flex-col gap-0.5 -mt-0.5">
        {label && (
          <label
            htmlFor={id}
            className="text-polaris-body2 text-label-normal cursor-pointer select-none"
          >
            {label}
          </label>
        )}
        {helperText && (
          <p className="text-polaris-helper text-label-alternative">{helperText}</p>
        )}
      </div>
    </div>
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';
