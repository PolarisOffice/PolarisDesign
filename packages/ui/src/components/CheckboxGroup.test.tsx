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
});
