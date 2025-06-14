import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterpartyModal from './Modal';
import '@testing-library/jest-dom';
import { Counterparty } from '../../../types';
import * as CounterpartyContext from '../../../context/CounterpartyContext';

const mockCounterparty: Counterparty = {
  id: '1',
  name: 'ООО Компания 42',
  inn: '22345678901',
  address: 'г. Москва, ул. Примерная, д. 1',
  kpp: '123456789',
};

// Mock the context values
const createMockContext = (overrides = {}) => ({
  isModalOpen: true,
  handleSave: jest.fn(),
  editingCounterparty: mockCounterparty,
  setIsModalOpen: jest.fn(),
  counterparties: [],
  isLoading: false,
  loadedSuccess: true,
  handleEdit: jest.fn(),
  handleDelete: jest.fn(),
  handleAddNew: jest.fn(),
  selectedCounterparty: null,
  ...overrides,
});

// Mock the CounterpartyContext
jest.mock('../../../context/CounterpartyContext', () => ({
  useCounterpartyContext: jest.fn(),
}));

describe('CounterpartyModal', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('renders and displays fields', () => {
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(createMockContext());
    render(<CounterpartyModal />);

    expect(screen.getByLabelText(/Название/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ИНН/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Адрес/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/КПП/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/ООО Компания 42/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/22345678901/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/г. Москва, ул. Примерная, д. 1/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/123456789/)).toBeInTheDocument();
  });

  it('validates input and calls handleSave and setIsModalOpen', () => {
    const mockContext = createMockContext({ editingCounterparty: null });
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(mockContext);
    render(<CounterpartyModal />);

    // Try to submit with empty fields
    fireEvent.click(screen.getByText(/Сохранить/i));
    expect(mockContext.handleSave).not.toHaveBeenCalled();

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/Название/i), { target: { value: 'Test Name' } });
    fireEvent.change(screen.getByLabelText(/ИНН/i), { target: { value: '22345678901' } });
    fireEvent.change(screen.getByLabelText(/Адрес/i), { target: { value: 'Test Address' } });
    fireEvent.change(screen.getByLabelText(/КПП/i), { target: { value: '123456789' } });

    fireEvent.click(screen.getByText(/Сохранить/i));
    expect(mockContext.handleSave).toHaveBeenCalled();
  });

  it('calls setIsModalOpen when cancel is clicked', () => {
    const mockContext = createMockContext();
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(mockContext);
    render(<CounterpartyModal />);
    fireEvent.click(screen.getByText(/Отмена/i));
    expect(mockContext.setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('shows correct title for new counterparty', () => {
    jest
      .spyOn(CounterpartyContext, 'useCounterpartyContext')
      .mockReturnValue(createMockContext({ editingCounterparty: null }));
    render(<CounterpartyModal />);
    expect(screen.getByText(/Новый контрагент/i)).toBeInTheDocument();
  });

  it('shows correct title for editing counterparty', () => {
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(createMockContext());
    render(<CounterpartyModal />);
    expect(screen.getByText(/Редактировать контрагента/i)).toBeInTheDocument();
  });

  it('validates INN format', () => {
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(createMockContext());
    render(<CounterpartyModal />);

    // Try invalid INN
    fireEvent.change(screen.getByLabelText(/ИНН/i), { target: { value: '123' } });
    expect(screen.getByText(/ИНН должен содержать 11 цифр/i)).toBeInTheDocument();

    // Try valid INN
    fireEvent.change(screen.getByLabelText(/ИНН/i), { target: { value: '22345678901' } });
    expect(screen.queryByText(/ИНН должен содержать 11 цифр/i)).not.toBeInTheDocument();
  });

  it('validates KPP format', () => {
    jest.spyOn(CounterpartyContext, 'useCounterpartyContext').mockReturnValue(createMockContext());
    render(<CounterpartyModal />);

    // Try invalid KPP
    fireEvent.change(screen.getByLabelText(/КПП/i), { target: { value: '123' } });
    expect(screen.getByText(/КПП должен содержать 9 цифр/i)).toBeInTheDocument();

    // Try valid KPP
    fireEvent.change(screen.getByLabelText(/КПП/i), { target: { value: '123456789' } });
    expect(screen.queryByText(/КПП должен содержать 9 цифр/i)).not.toBeInTheDocument();
  });
});
