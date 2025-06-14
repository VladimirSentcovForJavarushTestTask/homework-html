export type CounterpartyFormFields = {
  name: string;
  inn: string;
  address: string;
  kpp: string;
};

export type CounterpartyFormErrors = Partial<Record<keyof CounterpartyFormFields, string>>;

export type CounterpartyFormData = {
  id?: string;
} & CounterpartyFormFields;

export type Counterparty = {
  id: string;
} & CounterpartyFormFields;
