import React from 'react';
import { Table, TableBody, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Counterparty } from '../../../types';
import Row from './Row';

/**
 * Props for the CounterpartyTable component
 * @typedef {Object} TableProps
 * @property {Counterparty[]} counterparties - Array of counterparty data to display in the table
 * @property {(counterparty: Counterparty) => void} onEdit - Callback function when a row is edited
 * @property {(id: string) => void} onDelete - Callback function when a row is deleted
 */
type TableProps = {
  counterparties: Counterparty[];
  onEdit: (counterparty: Counterparty) => void;
  onDelete: (id: string) => void;
};

/**
 * Table component for displaying a list of counterparties
 * @param {TableProps} props - Component props
 * @returns {JSX.Element} Table with counterparty data and actions
 * 
 * @example
 * <CounterpartyTable
 *   counterparties={counterpartiesList}
 *   onEdit={(counterparty) => handleEdit(counterparty)}
 *   onDelete={(id) => handleDelete(id)}
 * />
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
 */
const CounterpartyTable: React.FC<TableProps> = ({ counterparties, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Название</TableHeadCell>
            <TableHeadCell>ИНН</TableHeadCell>
            <TableHeadCell>Адрес</TableHeadCell>
            <TableHeadCell>КПП</TableHeadCell>
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CounterpartyTable;
