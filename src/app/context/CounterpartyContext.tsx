import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Counterparty, CounterpartyFormData } from '../types';
import counterpartyService from '../../services/CounterpartyService';

/**
 * Interface defining the shape of the Counterparty context
 * @interface CounterpartyContextType
 * @property {Counterparty[]} counterparties - List of all counterparties
 * @property {boolean} isModalOpen - Controls the visibility of the modal
 * @property {boolean} isLoading - Indicates if data is currently being loaded
 * @property {Counterparty | undefined} editingCounterparty - Currently edited counterparty, if any
 * @property {(isOpen: boolean) => void} setIsModalOpen - Function to control modal visibility
 * @property {() => void} handleAddNew - Function to handle adding a new counterparty
 * @property {(counterparty: Counterparty) => void} handleEdit - Function to handle editing a counterparty
 * @property {(id: string) => Promise<void>} handleDelete - Function to handle deleting a counterparty
 * @property {(data: CounterpartyFormData) => Promise<void>} handleSave - Function to handle saving a counterparty
 */
interface CounterpartyContextType {
  counterparties: Counterparty[];
  isModalOpen: boolean;
  isLoading: boolean;
  editingCounterparty: Counterparty | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddNew: () => void;
  handleEdit: (counterparty: Counterparty) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSave: (data: CounterpartyFormData) => Promise<void>;
}

/**
 * Context for managing counterparty data and operations
 */
const CounterpartyContext = createContext<CounterpartyContextType | null>(null);

/**
 * Hook to access the Counterparty context
 * @returns {CounterpartyContextType} The Counterparty context
 * @throws {Error} If used outside of CounterpartyProvider
 *
 * @example
 * const { counterparties, handleAddNew } = useCounterpartyContext();
 */
export const useCounterpartyContext = () => {
  const context = useContext(CounterpartyContext);
  if (!context) {
    throw new Error('useCounterparty must be used within a CounterpartyProvider');
  }
  return context;
};

/**
 * Props for the CounterpartyProvider component
 * @interface CounterpartyProviderProps
 * @property {ReactNode} children - Child components that will have access to the context
 */
interface CounterpartyProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and provides counterparty context
 * @param {CounterpartyProviderProps} props - Component props
 * @returns {JSX.Element} Provider component with context value
 *
 * @example
 * <CounterpartyProvider>
 *   <App />
 * </CounterpartyProvider>
 */
export const CounterpartyProvider: React.FC<CounterpartyProviderProps> = ({ children }) => {
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCounterparty, setEditingCounterparty] = useState<Counterparty | undefined>();

  useEffect(() => {
    loadCounterparties();
  }, []);

  /**
   * Loads all counterparties from the service
   * @private
   */
  const loadCounterparties = async () => {
    try {
      setIsLoading(true);
      const data = await counterpartyService.getAllCounterparties();
      setCounterparties(data);
    } catch (error) {
      console.error('Failed to load counterparties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles adding a new counterparty by opening the modal
   * @public
   */
  const handleAddNew = () => {
    setEditingCounterparty(undefined);
    setIsModalOpen(true);
  };

  /**
   * Handles editing an existing counterparty
   * @param {Counterparty} counterparty - The counterparty to edit
   * @public
   */
  const handleEdit = (counterparty: Counterparty) => {
    setEditingCounterparty(counterparty);
    setIsModalOpen(true);
  };

  /**
   * Handles deleting a counterparty
   * @param {string} id - The ID of the counterparty to delete
   * @returns {Promise<void>}
   * @public
   */
  const handleDelete = async (id: string) => {
    try {
      const updatedCounterparties = await counterpartyService.deleteCounterparty(id);
      setCounterparties(updatedCounterparties);
    } catch (error) {
      console.error('Failed to delete counterparty:', error);
    }
  };

  /**
   * Handles saving a counterparty (create or update)
   * @param {CounterpartyFormData} data - The counterparty data to save
   * @returns {Promise<void>}
   * @public
   */
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
    isLoading,
    editingCounterparty,
    setIsModalOpen,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
  };

  return <CounterpartyContext.Provider value={value}>{children}</CounterpartyContext.Provider>;
};
