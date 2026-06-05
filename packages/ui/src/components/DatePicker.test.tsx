import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatePicker } from './DatePicker';

describe('DatePicker', () => {
  it('renders trigger with placeholder when no value', () => {
    render(<DatePicker placeholder="만료일 선택" />);
    expect(screen.getByRole('button', { name: '날짜 선택' })).toBeInTheDocument();
    expect(screen.getByText('만료일 선택')).toBeInTheDocument();
  });

  it('formats the trigger label with date-fns when value is set', () => {
    render(<DatePicker value={new Date(2026, 11, 31)} />);
    // ko locale + default `yyyy-MM-dd`.
    expect(screen.getByText('2026-12-31')).toBeInTheDocument();
  });

  it('renders a hidden form input when name is set (form-action friendly)', () => {
    const { container } = render(
      <DatePicker name="expiry" value={new Date(2026, 11, 31)} />
    );
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).not.toBeNull();
    expect(hidden).toHaveAttribute('name', 'expiry');
    expect((hidden as HTMLInputElement).value).toBe('2026-12-31');
  });

  it('does NOT render the hidden input when name is omitted', () => {
    const { container } = render(<DatePicker value={new Date(2026, 11, 31)} />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });

  it('hidden input value follows valueFormat when provided', () => {
    const { container } = render(
      <DatePicker name="expiry" value={new Date(2026, 11, 31)} valueFormat="yyyyMMdd" />
    );
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.value).toBe('20261231');
  });

  it('hidden input value is empty string when no date is selected', () => {
    const { container } = render(<DatePicker name="expiry" />);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.value).toBe('');
  });

  it('forwards required to the hidden input', () => {
    const { container } = render(<DatePicker name="x" required />);
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('required');
  });

  it('mirrors disabled to the hidden input so disabled fields drop out of form payloads', () => {
    // HTML spec: disabled controls are NOT serialized into FormData. If
    // we forgot to mirror `disabled` onto the hidden input, a disabled
    // DatePicker would still ship its last value to the server — the
    // exact bug Codex review caught at v0.8.0-rc.0.
    const { container } = render(<DatePicker name="x" value={new Date(2026, 11, 31)} disabled />);
    const hidden = container.querySelector('input[type="hidden"]');
    expect(hidden).toHaveAttribute('disabled');
  });

  describe('label / helperText / error (v0.8.0-rc.9)', () => {
    it('renders a label above the trigger', () => {
      render(<DatePicker label="만료일" placeholder="선택" />);
      expect(screen.getByText('만료일')).toBeInTheDocument();
    });

    it('renders helperText below the trigger', () => {
      render(<DatePicker label="만료일" helperText="YYYY-MM-DD 형식" />);
      expect(screen.getByText('YYYY-MM-DD 형식')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('renders error message and sets aria-invalid', () => {
      render(<DatePicker label="만료일" error="과거 날짜는 선택할 수 없습니다" />);
      expect(screen.getByRole('alert')).toHaveTextContent('과거 날짜는 선택할 수 없습니다');
      expect(screen.getByRole('button', { name: '날짜 선택' })).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });
  });

  describe('size prop (rc.10)', () => {
    it('default size keeps Button md (40px / h-10)', () => {
      render(<DatePicker label="만료일" />);
      const trigger = screen.getByRole('button', { name: '날짜 선택' });
      expect(trigger.className).toContain('h-10');
    });

    it('size="lg" renders 52px trigger matching Input', () => {
      render(<DatePicker label="만료일" size="lg" />);
      const trigger = screen.getByRole('button', { name: '날짜 선택' });
      expect(trigger.className).toContain('h-[52px]');
      expect(trigger.className).toContain('px-5');
    });
  });
});
