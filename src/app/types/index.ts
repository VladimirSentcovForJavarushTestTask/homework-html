export interface Counterparty {
  id: string;
  name: string;
  inn: string;
  address: string;
  kpp: string;
}

export interface CounterpartyFormData {
  id?: string;
  name: string;
  inn: string;
  address: string;
  kpp: string;
}
