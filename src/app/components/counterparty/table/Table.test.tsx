import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
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

describe('CounterpartyTable', () => {
  test('renders table headers and rows', () => {
    render(
      <CounterpartyTable
        counterparties={mockCounterparties}
        isLoading={false}
        loadSuccess={true}
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
      <CounterpartyTable
        counterparties={mockCounterparties}
        isLoading={false}
        onEdit={onEdit}
        loadSuccess={true}
        onDelete={onDelete}
      />
    );

    // Simulate double click on the first row (edit)
    fireEvent.doubleClick(screen.getByText(/ООО Компания 42/i));
    expect(onEdit).toHaveBeenCalled();

    // Simulate click on the first delete button
    fireEvent.click(screen.getAllByText(/Удалить/i)[0]);
    expect(onDelete).toHaveBeenCalled();
  });

  test('shows loading spinner when isLoading is true', () => {
    render(
      <CounterpartyTable
        counterparties={mockCounterparties}
        isLoading={true}
        onEdit={jest.fn()}
        loadSuccess={true}
        onDelete={jest.fn()}
      />
    );

    // Check if loading text is present
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();

    // Check if spinner is present (it has role="status" in Flowbite)
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Verify that table content is not shown
    expect(screen.queryByText(/ООО Компания 42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ИП Иванов И.И./i)).not.toBeInTheDocument();
  });

  test('shows error message when loadSuccess is false', () => {
    render(
      <CounterpartyTable
        counterparties={mockCounterparties}
        isLoading={false}
        loadSuccess={false}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    // Check if error message is present
    expect(screen.getByText(/Ошибка загрузки данных/i)).toBeInTheDocument();

    // Verify that table content is not shown
    expect(screen.queryByText(/ООО Компания 42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ИП Иванов И.И./i)).not.toBeInTheDocument();

    // Verify that loading spinner is not shown
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
