import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormError, { getInputColor } from './FormError';

describe('getInputColor', () => {
  it('returns failure when there is an error', () => {
    expect(getInputColor(true, '')).toBe('failure');
    expect(getInputColor(true, 'some value')).toBe('failure');
  });

  it('returns success when there is no error and value exists', () => {
    expect(getInputColor(false, 'some value')).toBe('success');
    expect(getInputColor(false, '123')).toBe('success');
  });

  it('returns gray when there is no error and value is empty', () => {
    expect(getInputColor(false, '')).toBe('gray');
    expect(getInputColor(false, '   ')).toBe('gray');
  });

  it('handles whitespace-only values as empty', () => {
    expect(getInputColor(false, '   ')).toBe('gray');
    expect(getInputColor(false, '\t\n')).toBe('gray');
  });
});

describe('FormError', () => {
  it('renders error message when error exists and field is touched', () => {
    render(<FormError error="This field is required" touched={true} />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600', 'text-xs', 'mt-1');
  });

  it('renders error message when error exists and field is dirty', () => {
    render(<FormError error="Invalid format" dirty={true} />);
    
    expect(screen.getByText('Invalid format')).toBeInTheDocument();
  });

  it('renders error message when error exists and both touched and dirty are true', () => {
    render(<FormError error="Multiple validation errors" touched={true} dirty={true} />);
    
    expect(screen.getByText('Multiple validation errors')).toBeInTheDocument();
  });

  it('does not render when error exists but neither touched nor dirty', () => {
    const { container } = render(<FormError error="This should not show" />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when no error exists', () => {
    const { container } = render(<FormError touched={true} dirty={true} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when error is empty string', () => {
    const { container } = render(<FormError error="" touched={true} dirty={true} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('does not render when error is undefined', () => {
    const { container } = render(<FormError error={undefined} touched={true} dirty={true} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('handles Russian error messages', () => {
    render(<FormError error="ИНН должен содержать 11 цифр" touched={true} />);
    
    expect(screen.getByText('ИНН должен содержать 11 цифр')).toBeInTheDocument();
  });

  it('handles special characters in error messages', () => {
    render(<FormError error="Error with @#$%^&*() characters" touched={true} />);
    
    expect(screen.getByText('Error with @#$%^&*() characters')).toBeInTheDocument();
  });
}); 