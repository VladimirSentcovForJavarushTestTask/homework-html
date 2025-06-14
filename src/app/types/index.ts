/**
 * Base form fields for a counterparty
 * @interface CounterpartyFormFields
 * @property {string} name - The name of the counterparty
 * @property {string} inn - Taxpayer Identification Number (11 digits)
 * @property {string} address - Physical address of the counterparty
 * @property {string} kpp - Tax Registration Reason Code (9 digits)
 */
export type CounterpartyFormFields = {
  name: string;
  inn: string;
  address: string;
  kpp: string;
};

/**
 * Error messages for form fields
 * @interface CounterpartyFormErrors
 * @property {string} [name] - Error message for the name field
 * @property {string} [inn] - Error message for the INN field
 * @property {string} [address] - Error message for the address field
 * @property {string} [kpp] - Error message for the KPP field
 */
export type CounterpartyFormErrors = Partial<Record<keyof CounterpartyFormFields, string>>;

/**
 * Form data for creating or editing a counterparty
 * @interface CounterpartyFormData
 * @property {string} [id] - Optional ID for existing counterparties
 * @extends CounterpartyFormFields
 */
export type CounterpartyFormData = {
  id?: string;
} & CounterpartyFormFields;

/**
 * Complete counterparty entity with required ID
 * @interface Counterparty
 * @property {string} id - Unique identifier for the counterparty
 * @extends CounterpartyFormFields
 */
export type Counterparty = {
  id: string;
} & CounterpartyFormFields;
