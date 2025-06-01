import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Counterparty, CounterpartyFormData } from '../types';
import counterpartyService from '../../services/CounterpartyService';

interface CounterpartyContextType {
  counterparties: Counterparty[];
  isModalOpen: boolean;
  editingCounterparty: Counterparty | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddNew: () => void;
  handleEdit: (counterparty: Counterparty) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSave: (data: CounterpartyFormData) => Promise<void>;
}

const CounterpartyContext = createContext<CounterpartyContextType | undefined>(undefined);

export const useCounterparty = () => {
  const context = useContext(CounterpartyContext);
  if (!context) {
    throw new Error('useCounterparty must be used within a CounterpartyProvider');
  }
  return context;
};

interface CounterpartyProviderProps {
  children: ReactNode;
}

export const CounterpartyProvider: React.FC<CounterpartyProviderProps> = ({ children }) => {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCounterparty, setEditingCounterparty] = useState<Counterparty | undefined>();

  useEffect(() => {
    loadCounterparties();
  }, []);

  const loadCounterparties = async () => {
    try {
      const data = await counterpartyService.getAllCounterparties();
      setCounterparties(data);
    } catch (error) {
      console.error('Failed to load counterparties:', error);
    }
  };

  const handleAddNew = () => {
    setEditingCounterparty(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (counterparty: Counterparty) => {
    setEditingCounterparty(counterparty);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedCounterparties = await counterpartyService.deleteCounterparty(id);
      setCounterparties(updatedCounterparties);
    } catch (error) {
      console.error('Failed to delete counterparty:', error);
    }
  };

  const handleSave = async (data: CounterpartyFormData) => {
    try {
      let updatedCounterparties: Counterparty[];

      if (data.id) {
        updatedCounterparties = await counterpartyService.updateCounterparty(data.id, data);
      } else {
        updatedCounterparties = await counterpartyService.createCounterparty(data);
      }

      setCounterparties(updatedCounterparties);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save counterparty:', error);
    }
  };

  const value = {
    counterparties,
    isModalOpen,
    editingCounterparty,
    setIsModalOpen,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
  };

  return <CounterpartyContext.Provider value={value}>{children}</CounterpartyContext.Provider>;
};
