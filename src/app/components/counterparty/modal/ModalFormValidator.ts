import { CounterpartyFormData} from '../../../types';

/**
 * Validates INN (Taxpayer Identification Number)
 * INN must be exactly 11 digits
 *
 * @param {string} [inn] - The INN to validate
 * @returns {boolean} True if INN is valid (11 digits), false otherwise
 *
 * @example
 * validateInn('12345678901') // returns true
 * validateInn('123') // returns false
 */
const validateInn = (inn?: string): boolean => {
  if (!inn) {
    return false;
  }
  return /^\d{11}$/.test(inn);
};

/**
 * Validates KPP (Tax Registration Reason Code)
 * KPP must be exactly 9 digits
 *
 * @param {string} [kpp] - The KPP to validate
 * @returns {boolean} True if KPP is valid (9 digits), false otherwise
 *
 * @example
 * validateKpp('123456789') // returns true
 * validateKpp('123') // returns false
 */
const validateKpp = (kpp?: string): boolean => {
  if (!kpp) {
    return false;
  }
  return /^\d{9}$/.test(kpp);
};

/**
 * Validates address
 * Address must not be empty
 *
 * @param {string} [address] - The address to validate
 * @returns {boolean} True if address is not empty, false otherwise
 *
 * @example
 * validateAddress('г. Москва, ул. Ленина, д. 1') // returns true
 * validateAddress('') // returns false
 */
const validateAddress = (address?: string): boolean => {
  if (!address) {
    return false;
  }
  return address.length > 0;
};

/**
 * Validates name
 * Name must not be empty
 *
 * @param {string} [name] - The name to validate
 * @returns {boolean} True if name is not empty, false otherwise
 *
 * @example
 * validateName('ООО Компания') // returns true
 * validateName('') // returns false
 */
const validateName = (name?: string): boolean => {
  if (!name) {
    return false;
  }
  return name.length > 0;
};

/**
 * Validation rules for each form field
 * Each field has a validation function and an error message
 */
const counterPartyFormValidator: Record<
  keyof CounterpartyFormData,
  {
    message: string;
    errorHandler: (value?: string) => boolean;
  }
> = {
  name: { errorHandler: validateName, message: 'Название не может быть пустым' },
  inn: { errorHandler: validateInn, message: 'ИНН должен содержать 11 цифр' },
  kpp: { errorHandler: validateKpp, message: 'КПП должен содержать 9 цифр' },
  address: { errorHandler: validateAddress, message: 'Адрес не может быть пустым' },
  id: { errorHandler: () => true, message: '' },
};

/**
 * Final Form-compatible validation function
 * @param {CounterpartyFormData} values - Form values to validate
 * @returns {Partial<CounterpartyFormData>} Object with validation errors
 */
export const validate = (values: CounterpartyFormData): Partial<CounterpartyFormData> => {
  const errors: Partial<CounterpartyFormData> = {};

  for (const [key, value] of Object.entries(values)) {
    const validator = counterPartyFormValidator[key as keyof CounterpartyFormData];
    if (validator && !validator.errorHandler(value)) {
      errors[key as keyof CounterpartyFormData] = validator.message;
    }
  }

  return errors;
};
