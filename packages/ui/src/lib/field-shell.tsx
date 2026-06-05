import { type ReactNode } from 'react';
import { ErrorIcon } from '../icons';
import { cn } from './cn';

/**
 * `FieldShell` — internal helper that renders the standard form-field
 * chrome (above-label, helperText, error with icon) around any control.
 * Used by `<Select>` / `<Combobox>` / `<DatePicker>` / `<DateRangePicker>`
 * to share the same vertical layout as `<DateTimeInput>` /
 * `<TimeInput>` / `<FileInput>` / `<FileDropZone>`.
 *
 * Why not the floating-label pattern (`<Input>`)? Floating labels only
 * make sense when there's a single text input that the user types into.
 * For pickers / dropdowns / combobox triggers — where the "value display"
 * is itself a button or read-only — the above-label pattern is clearer
 * and matches what consumers reach for first.
 *
 * Layout (vertical stack):
 *
 *   [label]                         — text-polaris-body3 / label-neutral
 *   [control: children]
 *   [helperText OR error]           — text-polaris-helper
 *     · helperText: label-alternative
 *     · error:      state-error + ErrorIcon prefix
 *
 * `messageId` is wired into `aria-describedby` of the inner control via
 * the `htmlFor` / `id` pair returned in `bind`.
 */
export interface FieldShellProps {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  /** Container className (around the whole field stack). */
  containerClassName?: string;
  /** The control element — typically a button / trigger / input. */
  children: ReactNode;
  /** Stable id for the inner control's `id` attribute (so `<label htmlFor>` wires up). */
  id: string;
}

export function FieldShell({
  label,
  helperText,
  error,
  containerClassName,
  children,
  id,
}: FieldShellProps) {
  const messageId = error || helperText ? `${id}-msg` : undefined;
  const isError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-polaris-2xs font-polaris', containerClassName)}>
      {label && (
        <label htmlFor={id} className="text-polaris-body3 text-label-neutral">
          {label}
        </label>
      )}
      {children}
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
    </div>
  );
}

/** Returns the ARIA attributes the inner control should bind (a11y wiring). */
export function fieldA11y(id: string, hasError: boolean, hasMessage: boolean) {
  return {
    id,
    'aria-invalid': hasError || undefined,
    'aria-describedby': hasMessage ? `${id}-msg` : undefined,
  };
}
