import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

/**
 * Test suite for the Header component
 * @description Tests the rendering and functionality of the Header component
 */
describe('Header', () => {
  /**
   * Test case: renders header with logo and add button
   * @description Verifies that the header renders correctly with all its elements
   */
  it('renders header with logo and add button', () => {
    render(<Header onAddNew={jest.fn()} />);

    // Check if logo is present
    expect(screen.getByAltText('МойСклад Logo')).toBeInTheDocument();

    // Check if brand name is present
    expect(screen.getByText('МойСклад')).toBeInTheDocument();

    // Check if add button is present
    expect(screen.getByText('Добавить')).toBeInTheDocument();
  });

  /**
   * Test case: calls onAddNew when add button is clicked
   * @description Verifies that the onAddNew callback is called when the add button is clicked
   */
  it('calls onAddNew when add button is clicked', () => {
    const onAddNew = jest.fn();
    render(<Header onAddNew={onAddNew} />);

    // Click the add button
    fireEvent.click(screen.getByText('Добавить'));

    // Verify that onAddNew was called
    expect(onAddNew).toHaveBeenCalledTimes(1);
  });

  /**
   * Test case: logo links to home page
   * @description Verifies that the logo is properly linked to the home page
   */
  it('logo links to home page', () => {
    render(<Header onAddNew={jest.fn()} />);

    // Check if logo link points to home page
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  /**
   * Test case: header has correct styling classes
   * @description Verifies that the header has the correct styling classes for responsive design
   */
  it('has correct styling classes', () => {
    render(<Header onAddNew={jest.fn()} />);

    // Check if logo has responsive height classes
    const logo = screen.getByAltText('МойСклад Logo');
    expect(logo).toHaveClass('h-6', 'sm:h-9');

    // Check if brand name has correct text styling
    const brandName = screen.getByText('МойСклад');
    expect(brandName).toHaveClass('text-xl', 'font-semibold', 'dark:text-white');
  });
}); 