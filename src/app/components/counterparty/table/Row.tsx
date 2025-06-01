import { Button, TableCell, TableRow } from 'flowbite-react';
import React from 'react';
import { Counterparty } from '../../../types';
import './table.css';
import { escapeHtml } from '../../../utils/utils';

type RowProps = {
  counterparty: Counterparty;
  onEdit: (counterparty: Counterparty) => void;
  onDelete: (id: string) => void;
};

const Row = ({ counterparty, onEdit, onDelete }: RowProps) => {
  return (
    <TableRow
      key={counterparty.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
      onDoubleClick={() => {
        onEdit(counterparty);
      }}
    >
      <TableCell>{escapeHtml(counterparty.name)}</TableCell>
      <TableCell>{escapeHtml(counterparty.inn)}</TableCell>
      <TableCell>{escapeHtml(counterparty.address)}</TableCell>
      <TableCell>{escapeHtml(counterparty.kpp)}</TableCell>
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
