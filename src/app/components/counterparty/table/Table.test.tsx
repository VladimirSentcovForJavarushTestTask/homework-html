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

// Mock the context values
const mockContextValue = {
  counterparties: mockCounterparties,
  isLoading: false,
  loadedSuccess: true,
  handleEdit: jest.fn(),
  handleDelete: jest.fn(),
  handleAddNew: jest.fn(),
  setIsModalOpen: jest.fn(),
  isModalOpen: false,
  selectedCounterparty: null,
};

// Mock the CounterpartyContext
jest.mock('../../../context/CounterpartyContext', () => ({
  useCounterpartyContext: () => mockContextValue,
}));

describe('CounterpartyTable', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('renders table headers and rows', () => {
    render(<CounterpartyTable />);

    expect(screen.getByText(/Название/i)).toBeInTheDocument();
    expect(screen.getByText(/ИНН/i)).toBeInTheDocument();
    expect(screen.getByText(/Адрес/i)).toBeInTheDocument();
    expect(screen.getByText(/КПП/i)).toBeInTheDocument();

    expect(screen.getByText(/ООО Компания 42/i)).toBeInTheDocument();
    expect(screen.getByText(/ИП Иванов И.И./i)).toBeInTheDocument();
  });

  test('calls handleEdit and handleDelete', () => {
    render(<CounterpartyTable />);

    // Simulate double click on the first row (edit)
    fireEvent.doubleClick(screen.getByText(/ООО Компания 42/i));
    expect(mockContextValue.handleEdit).toHaveBeenCalled();

    // Simulate click on the first delete button
    fireEvent.click(screen.getAllByText(/Удалить/i)[0]);
    expect(mockContextValue.handleDelete).toHaveBeenCalled();
  });

  test('shows loading spinner when isLoading is true', () => {
    // Override the mock context value for this test
    /* eslint-disable no-undef */
    jest
      .spyOn(require('../../../context/CounterpartyContext'), 'useCounterpartyContext')
      .mockReturnValue({ ...mockContextValue, isLoading: true });
    /* eslint-enable no-undef */

    render(<CounterpartyTable />);

    // Check if loading text is present
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument();

    // Check if spinner is present (it has role="status" in Flowbite)
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Verify that table content is not shown
    expect(screen.queryByText(/ООО Компания 42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ИП Иванов И.И./i)).not.toBeInTheDocument();
  });

  test('shows error message when loadedSuccess is false', () => {
    // Override the mock context value for this test
    /* eslint-disable no-undef */
    jest
      .spyOn(require('../../../context/CounterpartyContext'), 'useCounterpartyContext')
      .mockReturnValue({ ...mockContextValue, loadedSuccess: false });
    /* eslint-enable no-undef */

    render(<CounterpartyTable />);

    // Check if error message is present
    expect(screen.getByText(/Ошибка загрузки данных/i)).toBeInTheDocument();

    // Verify that table content is not shown
    expect(screen.queryByText(/ООО Компания 42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ИП Иванов И.И./i)).not.toBeInTheDocument();

    // Verify that loading spinner is not shown
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('shows empty state message when counterparties list is empty', () => {
    // Override the mock context value for this test
    /* eslint-disable no-undef */
    jest
      .spyOn(require('../../../context/CounterpartyContext'), 'useCounterpartyContext')
      .mockReturnValue({ ...mockContextValue, counterparties: [] });
    /* eslint-enable no-undef */

    render(<CounterpartyTable />);

    // Check if empty state message is present
    expect(screen.getByText(/Нет данных/i)).toBeInTheDocument();

    // Verify that table headers are still shown
    expect(screen.getByText(/Название/i)).toBeInTheDocument();
    expect(screen.getByText(/ИНН/i)).toBeInTheDocument();
    expect(screen.getByText(/Адрес/i)).toBeInTheDocument();
    expect(screen.getByText(/КПП/i)).toBeInTheDocument();

    // Verify that no rows are shown
    expect(screen.queryByText(/ООО Компания 42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ИП Иванов И.И./i)).not.toBeInTheDocument();
  });
});
