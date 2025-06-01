import React from 'react';
import { Table, TableBody, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { Counterparty } from '../../../types';
import Row from './Row';

type TableProps = {
  counterparties: Counterparty[];
  onEdit: (counterparty: Counterparty) => void;
  onDelete: (id: string) => void;
};

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
