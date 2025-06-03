import { CounterpartyFormData, FormErrors } from '../../../types';

/**
 * Validates INN (Taxpayer Identification Number)
 * @param {string} [inn] - The INN to validate
 * @returns {boolean} True if INN is valid (11 digits), false otherwise
 */
export const validateInn = (inn?: string): boolean => {
  if (!inn) {
    return false;
  }
  return /^\d{11}$/.test(inn);
};

/**
 * Validates KPP (Tax Registration Reason Code)
 * @param {string} [kpp] - The KPP to validate
 * @returns {boolean} True if KPP is valid (9 digits), false otherwise
 */
export const validateKpp = (kpp?: string): boolean => {
  if (!kpp) {
    return false;
  }
  return /^\d{9}$/.test(kpp);
};

/**
 * Validates address
 * @param {string} [address] - The address to validate
 * @returns {boolean} True if address is not empty, false otherwise
 */
export const validateAddress = (address?: string): boolean => {
  if (!address) {
    return false;
  }
  return address.length > 0;
};

/**
 * Validates name
 * @param {string} [name] - The name to validate
 * @returns {boolean} True if name is not empty, false otherwise
 */
export const validateName = (name?: string): boolean => {
  if (!name) {
    return false;
  }
  return name.length > 0;
};

/**
 * Validates all counterparty fields
 * @param {CounterpartyFormData} counterparty - The counterparty data to validate
 * @returns {boolean} True if all fields are valid, false otherwise
 */
export const isValidConteParty = (counterparty: CounterpartyFormData): boolean => {
  return (
    validateInn(counterparty.inn) &&
    validateKpp(counterparty.kpp) &&
    validateAddress(counterparty.address) &&
    validateName(counterparty.name)
  );
};

/**
 * Validates form data and sets error messages
 * @param {CounterpartyFormData} counterparty - The counterparty data to validate
 * @param setErrors - Callback function to set error messages
 */
export const validateForm = (
  counterparty: CounterpartyFormData,
  setErrors: (errors: FormErrors) => void
): void => {
  const newErrors: FormErrors = {};
  if (!validateName(counterparty.name)) {
    newErrors.name = 'Название не может быть пустым';
  }
  if (!validateAddress(counterparty.address)) {
    newErrors.address = 'Адрес не может быть пустым';
  }
  if (!validateInn(counterparty.inn)) {
    newErrors.inn = 'ИНН должен содержать 11 цифр';
  }
  if (!validateKpp(counterparty.kpp)) {
    newErrors.kpp = 'КПП должен содержать 9 цифр';
  }
  setErrors(newErrors);
};
