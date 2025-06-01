import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CounterpartyModal from './Modal';
import '@testing-library/jest-dom';
import { Counterparty } from '../../../types';

const mockCounterparty: Counterparty = {
  id: '1',
  name: 'ООО Компания 42',
  inn: '22345678901',
  address: 'г. Москва, ул. Примерная, д. 1',
  kpp: '123456789',
};

describe('CounterpartyModal', () => {
  it('renders and displays fields', () => {
    render(
      <CounterpartyModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={jest.fn()}
        counterparty={mockCounterparty}
      />
    );
    expect(screen.getByLabelText(/Название/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ИНН/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Адрес/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/КПП/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/ООО Компания 42/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/22345678901/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/г. Москва, ул. Примерная, д. 1/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/123456789/)).toBeInTheDocument();
  });

  it('validates input and calls onSave and onClose', () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(<CounterpartyModal isOpen={true} onClose={onClose} onSave={onSave} />);

    // Try to submit with empty fields
    fireEvent.click(screen.getByText(/Сохранить/i));
    expect(onSave).not.toHaveBeenCalled();

    // Fill in valid data
    fireEvent.change(screen.getByLabelText(/Название/i), { target: { value: 'Test Name' } });
    fireEvent.change(screen.getByLabelText(/ИНН/i), { target: { value: '22345678901' } });
    fireEvent.change(screen.getByLabelText(/Адрес/i), { target: { value: 'Test Address' } });
    fireEvent.change(screen.getByLabelText(/КПП/i), { target: { value: '123456789' } });

    fireEvent.click(screen.getByText(/Сохранить/i));
    expect(onSave).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = jest.fn();
    render(<CounterpartyModal isOpen={true} onClose={onClose} onSave={jest.fn()} />);
    fireEvent.click(screen.getByText(/Отмена/i));
    expect(onClose).toHaveBeenCalled();
  });
});
