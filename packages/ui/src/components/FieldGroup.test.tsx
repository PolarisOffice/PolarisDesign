import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldGroup } from './FieldGroup';

describe('FieldGroup', () => {
  it('renders children inside a div container', () => {
    render(
      <FieldGroup>
        <span>child-1</span>
        <span>child-2</span>
      </FieldGroup>,
    );
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
  });

  it('renders label + description above the children', () => {
    render(
      <FieldGroup label="기본 정보" description="모든 필드는 필수입니다">
        <span>field</span>
      </FieldGroup>,
    );
    expect(screen.getByText('기본 정보')).toBeInTheDocument();
    expect(screen.getByText('모든 필드는 필수입니다')).toBeInTheDocument();
  });

  it('applies boxed surface classes when variant="boxed"', () => {
    const { container } = render(
      <FieldGroup variant="boxed">
        <span>child</span>
      </FieldGroup>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('bg-fill-neutral');
    expect(root.className).toContain('rounded-polaris-md');
    expect(root.className).toContain('p-polaris-md');
  });

  it('omits boxed classes for default (plain) variant', () => {
    const { container } = render(
      <FieldGroup>
        <span>child</span>
      </FieldGroup>,
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).not.toContain('bg-fill-neutral');
    expect(root.className).not.toContain('p-polaris-md');
  });
});
