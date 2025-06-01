import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import counterpartyService from '../services/CounterpartyService';

// Mock the counterparty service
jest.mock('../services/CounterpartyService', () => ({
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
  },
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders header', async () => {
    await act(async () => {
      render(<App />);
    });

    expect(screen.getByText(/МойСклад/i)).toBeInTheDocument();
  });

  test('loads and displays counterparties', async () => {
    await act(async () => {
      render(<App />);
    });

    // Wait for the counterparties to be loaded
    const companyName = await screen.findByText('Test Company');
    expect(companyName).toBeInTheDocument();
    expect(counterpartyService.getAllCounterparties).toHaveBeenCalledTimes(1);
  });
});
