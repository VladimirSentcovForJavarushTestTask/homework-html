import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormError from './FormError';

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