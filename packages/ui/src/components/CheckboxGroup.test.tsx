import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup, CheckboxGroupItem } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  it('renders a fieldset with legend as accessible group label', () => {
    render(
      <CheckboxGroup label="구독 이벤트" value={[]} onValueChange={() => {}}>
        <CheckboxGroupItem value="view" label="열람 성공" />
        <CheckboxGroupItem value="download" label="다운로드" />
      </CheckboxGroup>,
    );
    // legend gets exposed via the fieldset group
    const group = screen.getByRole('group', { name: '구독 이벤트' });
    expect(group.tagName.toLowerCase()).toBe('fieldset');
  });

  it('marks group as aria-invalid when error is set + renders ErrorIcon alert', () => {
    render(
      <CheckboxGroup label="권한" value={[]} onValueChange={() => {}} error="최소 1개 선택">
        <CheckboxGroupItem value="r" label="읽기" />
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: '권한' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('최소 1개 선택');
  });

  it('toggles values via onValueChange (add)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CheckboxGroup label="이벤트" value={[]} onValueChange={onChange}>
        <CheckboxGroupItem value="view" label="열람" />
        <CheckboxGroupItem value="download" label="다운로드" />
      </CheckboxGroup>,
    );
    await user.click(screen.getByText('열람'));
    expect(onChange).toHaveBeenCalledWith(['view']);
  });

  it('toggles values via onValueChange (remove)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CheckboxGroup label="이벤트" value={['view', 'download']} onValueChange={onChange}>
        <CheckboxGroupItem value="view" label="열람" />
        <CheckboxGroupItem value="download" label="다운로드" />
      </CheckboxGroup>,
    );
    await user.click(screen.getByText('열람'));
    expect(onChange).toHaveBeenCalledWith(['download']);
  });

  it('throws a clear error when CheckboxGroupItem is rendered outside CheckboxGroup', () => {
    // Suppress React's console.error noise for the expected throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<CheckboxGroupItem value="x" label="X" />),
    ).toThrowError(/inside <CheckboxGroup>/);
    spy.mockRestore();
  });

  it('renders helperText when no error', () => {
    render(
      <CheckboxGroup label="권한" helperText="복수 선택 가능">
        <CheckboxGroupItem value="r" label="읽기" />
      </CheckboxGroup>,
    );
    expect(screen.getByText('복수 선택 가능')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  describe('uncontrolled mode (rc.10) — defaultValue + name', () => {
    it('renders with defaultValue checked when no onValueChange is given', () => {
      render(
        <CheckboxGroup label="구독 이벤트" name="events" defaultValue={['view']}>
          <CheckboxGroupItem value="view" label="열람" />
          <CheckboxGroupItem value="download" label="다운로드" />
        </CheckboxGroup>,
      );
      expect(screen.getByLabelText('열람')).toBeChecked();
      expect(screen.getByLabelText('다운로드')).not.toBeChecked();
    });

    it('toggling internally updates state without onValueChange', async () => {
      const user = userEvent.setup();
      render(
        <CheckboxGroup label="구독 이벤트" name="events" defaultValue={[]}>
          <CheckboxGroupItem value="view" label="열람" />
        </CheckboxGroup>,
      );
      await user.click(screen.getByText('열람'));
      expect(screen.getByLabelText('열람')).toBeChecked();
    });

    it('items render with the group name on Radix bubble inputs when inside a <form> (RSC payload path)', () => {
      // Radix Checkbox renders the BubbleInput (`<input type="checkbox">`
      // mirror) only when the component lives inside a `<form>` — that's
      // when it would actually be serialized into FormData. Outside a
      // form, the BubbleInput is omitted (no payload to bubble into).
      // For RSC server-action use, the consumer wraps the group in
      // `<form action={...}>` anyway, which is what we test here.
      const { container } = render(
        <form>
          <CheckboxGroup label="구독 이벤트" name="events" defaultValue={['view']}>
            <CheckboxGroupItem value="view" label="열람" />
            <CheckboxGroupItem value="download" label="다운로드" />
          </CheckboxGroup>
        </form>,
      );
      const inputs = container.querySelectorAll('input[name="events"]');
      // 2 items → 2 bubble inputs, both with name="events".
      expect(inputs.length).toBe(2);
      const values = Array.from(inputs).map((el) => (el as HTMLInputElement).value);
      expect(values).toContain('view');
      expect(values).toContain('download');
      // The bubble input matching the defaulted item should be checked.
      const viewInput = Array.from(inputs).find(
        (el) => (el as HTMLInputElement).value === 'view',
      ) as HTMLInputElement | undefined;
      expect(viewInput?.checked).toBe(true);
    });

    it('FormData round-trips defaultValue + post-toggle changes (RSC server-action)', async () => {
      const user = userEvent.setup();
      const captured: Record<string, FormDataEntryValue[]> = {};
      function TestForm() {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              captured.events = fd.getAll('events');
            }}
          >
            <CheckboxGroup label="구독 이벤트" name="events" defaultValue={['view']}>
              <CheckboxGroupItem value="view" label="열람" />
              <CheckboxGroupItem value="download" label="다운로드" />
              <CheckboxGroupItem value="denied" label="거부" />
            </CheckboxGroup>
            <button type="submit">제출</button>
          </form>
        );
      }
      render(<TestForm />);
      // Add 'download' (toggle on), keep 'view' (already on).
      await user.click(screen.getByText('다운로드'));
      await user.click(screen.getByText('제출'));
      expect(captured.events).toContain('view');
      expect(captured.events).toContain('download');
      expect(captured.events).not.toContain('denied');
    });

    it('controlled mode still wins when value is supplied', () => {
      const { rerender } = render(
        <CheckboxGroup label="x" value={['view']} onValueChange={() => {}}>
          <CheckboxGroupItem value="view" label="열람" />
          <CheckboxGroupItem value="download" label="다운로드" />
        </CheckboxGroup>,
      );
      expect(screen.getByLabelText('열람')).toBeChecked();
      // Parent flips value — child must follow
      rerender(
        <CheckboxGroup label="x" value={['download']} onValueChange={() => {}}>
          <CheckboxGroupItem value="view" label="열람" />
          <CheckboxGroupItem value="download" label="다운로드" />
        </CheckboxGroup>,
      );
      expect(screen.getByLabelText('열람')).not.toBeChecked();
      expect(screen.getByLabelText('다운로드')).toBeChecked();
    });

    it('onValueChange still fires in uncontrolled mode (observer pattern)', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <CheckboxGroup label="x" name="events" defaultValue={[]} onValueChange={onChange}>
          <CheckboxGroupItem value="view" label="열람" />
        </CheckboxGroup>,
      );
      await user.click(screen.getByText('열람'));
      expect(onChange).toHaveBeenCalledWith(['view']);
    });
  });
});
