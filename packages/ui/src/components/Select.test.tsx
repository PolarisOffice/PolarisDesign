import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectField,
} from './Select';

describe('Select', () => {
  it('renders the trigger with the current value', () => {
    render(
      <Select defaultValue="docx">
        <SelectTrigger aria-label="파일 형식">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="docx">DOCX</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
        </SelectContent>
      </Select>
    );
    const trigger = screen.getByRole('combobox', { name: '파일 형식' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('DOCX');
  });

  it('SelectTrigger has whitespace-nowrap to prevent line wrapping', () => {
    render(
      <Select>
        <SelectTrigger aria-label="긴 옵션">
          <SelectValue placeholder="..." />
        </SelectTrigger>
      </Select>
    );
    expect(screen.getByRole('combobox')).toHaveClass('whitespace-nowrap');
  });
});

describe('SelectField', () => {
  it('renders a label wired to the trigger via htmlFor/id', () => {
    render(
      <SelectField label="전달 대상" placeholder="선택하세요" defaultValue="slack">
        <SelectItem value="slack">Slack</SelectItem>
        <SelectItem value="teams">Teams</SelectItem>
      </SelectField>,
    );
    const trigger = screen.getByRole('combobox', { name: '전달 대상' });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent('Slack');
  });

  it('renders helperText below the trigger', () => {
    render(
      <SelectField label="대상" helperText="기본값: Slack">
        <SelectItem value="slack">Slack</SelectItem>
      </SelectField>,
    );
    expect(screen.getByText('기본값: Slack')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows error message with role=alert + sets aria-invalid', () => {
    render(
      <SelectField label="대상" error="필수 항목입니다">
        <SelectItem value="slack">Slack</SelectItem>
      </SelectField>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('필수 항목입니다');
    expect(screen.getByRole('combobox', { name: '대상' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });
});
