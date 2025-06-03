import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CounterpartyProvider, useCounterpartyContext } from './CounterpartyContext';
import counterpartyService from '../../services/CounterpartyService';

// Mock the counterparty service
jest.mock('../../services/CounterpartyService', () => ({
  __esModule: true,
  default: {
    getAllCounterparties: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Company',
        inn: '12345678901',
        address: 'Test Address',
        kpp: '123456789',
      },
    ]),
    createCounterparty: jest.fn().mockResolvedValue([
      {
        id: '2',
        name: 'New Company',
        inn: '98765432101',
        address: 'New Address',
        kpp: '987654321',
      },
    ]),
    updateCounterparty: jest.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Updated Company',
        inn: '12345678901',
        address: 'Updated Address',
        kpp: '123456789',
      },
    ]),
    deleteCounterparty: jest.fn().mockResolvedValue([]),
  },
}));

// Test component that uses the context
const TestComponent = () => {
  const { counterparties, isModalOpen, handleAddNew, handleEdit, handleDelete, handleSave } =
    useCounterpartyContext();

  return (
    <div>
      <button onClick={handleAddNew}>Add New</button>
      <div data-testid="counterparties">
        {counterparties.map((c) => (
          <div key={c.id}>
            <span>{c.name}</span>
            <button onClick={() => handleEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </div>
        ))}
      </div>
      {isModalOpen && <div data-testid="modal">Modal Open</div>}
    </div>
  );
};

describe('CounterpartyContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loads counterparties on mount', async () => {
    await act(async () => {
      render(
        <CounterpartyProvider>
          <TestComponent />
        </CounterpartyProvider>
      );
    });

    expect(counterpartyService.getAllCounterparties).toHaveBeenCalledTimes(1);
    expect(await screen.findByText('Test Company')).toBeInTheDocument();
  });

  test('handles add new', async () => {
    await act(async () => {
      render(
        <CounterpartyProvider>
          <TestComponent />
        </CounterpartyProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Add New'));
    });

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  test('handles delete', async () => {
    await act(async () => {
      render(
        <CounterpartyProvider>
          <TestComponent />
        </CounterpartyProvider>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    expect(counterpartyService.deleteCounterparty).toHaveBeenCalledWith('1');
  });
});
