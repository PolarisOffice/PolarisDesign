import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupItem } from './RadioGroup';

describe('RadioGroup', () => {
  it('renders a fieldset legend + Radix radiogroup inside', () => {
    render(
      <RadioGroup label="알림 빈도" value="instant" onValueChange={() => {}}>
        <RadioGroupItem value="instant" label="즉시" />
        <RadioGroupItem value="daily" label="하루 1회" />
      </RadioGroup>,
    );
    // Outer fieldset exposes legend as group name
    expect(screen.getByRole('group', { name: '알림 빈도' })).toBeInTheDocument();
    // Radix renders a separate role=radiogroup
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('fires onValueChange when an item is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup label="빈도" value="instant" onValueChange={onChange}>
        <RadioGroupItem value="instant" label="즉시" />
        <RadioGroupItem value="daily" label="하루 1회" />
      </RadioGroup>,
    );
    await user.click(screen.getByText('하루 1회'));
    expect(onChange).toHaveBeenCalledWith('daily');
  });

  it('renders error alert with ErrorIcon and aria-invalid on fieldset', () => {
    render(
      <RadioGroup label="등급" error="필수 항목입니다">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('필수 항목입니다');
    expect(screen.getByRole('group', { name: '등급' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helperText when no error', () => {
    render(
      <RadioGroup label="등급" helperText="1개만 선택">
        <RadioGroupItem value="a" label="A" />
      </RadioGroup>,
    );
    expect(screen.getByText('1개만 선택')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('renders bare item (no label) as a single radio', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="A only" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'A only' })).toBeInTheDocument();
  });
});
