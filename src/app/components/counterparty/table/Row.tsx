import { Button, TableCell, TableRow } from 'flowbite-react';
import React from 'react';
import { Counterparty } from '../../../types';
import './table.css';
import { escapeHtml } from '../../../utils/utils';
import { FIELDS } from './Table';

/**
 * Props for the Row component
 * @typedef {Object} RowProps
 * @property {Counterparty} counterparty - The counterparty data to display in the row
 * @property {(counterpartyId: string) => void} onEdit - Callback function when row is double-clicked for editing
 * @property {(id: string) => void} onDelete - Callback function when delete button is clicked
 */
type RowProps = {
  counterparty: Counterparty;
  onEdit: (counterpartId: string) => void;
  onDelete: (id: string) => void;
};

/**
 * Row component for displaying a single counterparty in the table
 * @param {RowProps} props - Component props
 * @returns {JSX.Element} Table row with counterparty data and actions
 *
 * @example
 * <Row
 *   counterparty={counterpartyData}
 *   onEdit={(counterparty) => handleEdit(counterparty)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 */
const Row = ({ counterparty, onEdit, onDelete }: RowProps) => {
  return (
    <TableRow
      key={counterparty.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
      onDoubleClick={() => {
        onEdit(counterparty.id);
      }}
    >
      {FIELDS.map(({ key }) => (
        <TableCell key={key}>{escapeHtml(counterparty[key])}</TableCell>
      ))}
      <TableCell>
        <Button
          className="delete-btn dark:border-gray-700"
          size="xs"
          color="white"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(counterparty.id);
          }}
        >
          Удалить
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Row;
