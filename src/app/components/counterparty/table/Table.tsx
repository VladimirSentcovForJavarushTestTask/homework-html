import React from 'react';
import { Spinner, Table, TableBody, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Counterparty } from '../../../types';
import Row from './Row';
import { useCounterpartyContext } from '../../../context/CounterpartyContext';

/**
 * Type definition for a field in the counterparty table
 * @typedef {Object} TableField
 * @property {keyof Counterparty} key - The key of the field in the Counterparty interface
 * @property {string} label - The display label for the field in Russian
 */
type TableField = {
  key: keyof Counterparty;
  label: string;
};

/**
 * Array of fields to display in the counterparty table
 * @constant
 * @type {readonly TableField[]}
 * @description Defines the structure and order of fields in the counterparty table
 * Each field contains:
 * - key: The property name from the Counterparty interface
 * - label: The display name in Russian
 */
export const FIELDS: readonly TableField[] = [
  { key: 'name', label: 'Название' },
  { key: 'inn', label: 'ИНН' },
  { key: 'address', label: 'Адрес' },
  { key: 'kpp', label: 'КПП' },
] as const;

/**
 * Table component for displaying a list of counterparties
 * @returns {JSX.Element} Table with counterparty data and actions
 *
 *
 * @description
 * This component renders a table with the following columns:
 * - Название (Name)
 * - ИНН (Tax ID)
 * - Адрес (Address)
 * - КПП (Tax Registration Reason Code)
 * - Actions (Delete button)
 *
 * Features:
 * - Double-click on a row to edit
 * - Click delete button to remove a counterparty
 * - Responsive design with horizontal scroll for small screens
 * - Loading state with spinner
 * - Error state with message
 * - Empty state with message
 */
const CounterpartyTable = () => {
  const { counterparties, isLoading, loadedSuccess, handleEdit, handleDelete } =
    useCounterpartyContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="xl" />
        <span className="ml-3 text-gray-500">Загрузка...</span>
      </div>
    );
  }

  if (!loadedSuccess) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-red-600">Ошибка загрузки данных</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            {FIELDS.map(({ key, label }) => (
              <TableHeadCell key={key}>{label}</TableHeadCell>
            ))}
            <TableHeadCell>
              <span className="sr-only">Действия</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {counterparties.map((counterparty) => (
            <Row
              key={counterparty.id}
              counterparty={counterparty}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
      {counterparties.length ? (
        <div className="flex justify-center items-center h-32">
          <span className="text-gray-500">Нет данных</span>
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <span className="text-gray-500">Получено {counterparties.length} контрагентов</span>
        </div>
      )}
    </div>
  );
};

export default CounterpartyTable;
