import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Row from './Row';
import { Table, TableBody } from 'flowbite-react';
import { Counterparty } from '../../../types';

const counterparty: Counterparty = {
  id: '1',
  name: 'ООО Компания 42',
  inn: '22345678901',
  address: 'г. Москва, ул. Примерная, д. 1',
  kpp: '123456789',
};

test('renders row data', () => {
  render(
    <Table>
      <TableBody>
        <Row counterparty={counterparty} onEdit={jest.fn()} onDelete={jest.fn()} />
      </TableBody>
    </Table>
  );

  expect(screen.getByText(/ООО Компания 42/i)).toBeInTheDocument();
  expect(screen.getByText(/22345678901/)).toBeInTheDocument();
  expect(screen.getByText(/г. Москва, ул. Примерная, д. 1/)).toBeInTheDocument();
  expect(screen.getByText(/123456789/)).toBeInTheDocument();
});

test('calls onEdit and onDelete', () => {
  const onEdit = jest.fn();
  const onDelete = jest.fn();

  render(
    <Table>
      <TableBody>
        <Row counterparty={counterparty} onEdit={onEdit} onDelete={onDelete} />
      </TableBody>
    </Table>
  );

  fireEvent.doubleClick(screen.getByText(/ООО Компания 42/i));
  expect(onEdit).toHaveBeenCalled();

  fireEvent.click(screen.getByText(/Удалить/i));
  expect(onDelete).toHaveBeenCalled();
});
