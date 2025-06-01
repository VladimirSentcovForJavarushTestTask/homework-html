import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterpartyTable from './Table';
import { Counterparty } from '../../../types';

const mockCounterparties: Counterparty[] = [
  {
    id: '1',
    name: 'ООО Компания 42',
    inn: '12345678901',
    address: 'г. Москва, ул. Примерная, д. 1',
    kpp: '123456789',
  },
  {
    id: '2',
    name: 'ИП Иванов И.И.',
    inn: '98765432101',
    address: 'г. Санкт-Петербург, пр. Невский, д. 2',
    kpp: '987654321',
  },
];

test('renders table headers and rows', () => {
  render(
    <CounterpartyTable
      counterparties={mockCounterparties}
      onEdit={jest.fn()}
      onDelete={jest.fn()}
    />
  );

  expect(screen.getByText(/Название/i)).toBeInTheDocument();
  expect(screen.getByText(/ИНН/i)).toBeInTheDocument();
  expect(screen.getByText(/Адрес/i)).toBeInTheDocument();
  expect(screen.getByText(/КПП/i)).toBeInTheDocument();

  expect(screen.getByText(/ООО Компания 42/i)).toBeInTheDocument();
  expect(screen.getByText(/ИП Иванов И.И./i)).toBeInTheDocument();
});

test('calls onEdit and onDelete', () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  render(
    <CounterpartyTable counterparties={mockCounterparties} onEdit={onEdit} onDelete={onDelete} />
  );

  // Simulate double click on the first row (edit)
  fireEvent.doubleClick(screen.getByText(/ООО Компания 42/i));
  expect(onEdit).toHaveBeenCalled();

  // Simulate click on the first delete button
  fireEvent.click(screen.getAllByText(/Удалить/i)[0]);
  expect(onDelete).toHaveBeenCalled();
});
