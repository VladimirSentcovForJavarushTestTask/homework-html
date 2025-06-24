import React from 'react';

/**
 * Props for the FormError component
 * @interface FormErrorProps
 * @property {string | undefined} error - The error message to display
 * @property {boolean | undefined} dirty - Whether the field has been modified
 * @property {boolean | undefined} touched - Whether the field has been touched/focused
 */
type FormErrorProps = {
  error?: string;
  dirty?: boolean;
  touched?: boolean;
};

/**
 * Determines the color for an input field based on validation status and value
 * 
 * @param {boolean} hasError - Whether the field has a validation error
 * @param {string} value - The current value of the field
 * @returns {'failure' | 'success' | 'gray'} The color to apply to the input
 * 
 * @example
 * ```tsx
 * getInputColor(true, '') // returns 'failure'
 * getInputColor(false, 'some value') // returns 'success'
 * getInputColor(false, '') // returns 'gray'
 * ```
 */
export const getInputColor = (hasError: boolean, value: string): 'failure' | 'success' | 'gray' => {
  if (hasError) {
    return 'failure';
  }
  return value ? 'success' : 'gray';
};

/**
 * FormError component for displaying validation errors
 * 
 * This component renders error messages for form fields when validation fails.
 * It only shows errors when the field has been touched or modified and has an error.
 * 
 * @param {FormErrorProps} props - Component props
 * @returns {JSX.Element | null} Error message element or null if no error should be shown
 * 
 * @example
 * ```tsx
 * <FormError error="This field is required" dirty={true} touched={true} />
 * ```
 */
const FormError = ({ error, dirty, touched }: FormErrorProps) => {
  if (error && (touched || dirty)) {
    return <p className="text-red-600 text-xs mt-1">{error}</p>;
  }
  return null;
};

export default FormError; 