import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { Counterparty, CounterpartyFormData } from '../types';
import counterpartyService from '../../services/CounterpartyService';
import isEqual from 'lodash/isEqual';
import {
  ActionType,
  CounterpartyContextState,
  counterpartyInitialState,
  counterpartyReducer,
} from './ConterpatyStore';
import { cleanUpTimer, registrarTimer } from '../utils/utils';

/**
 * Props for the CounterpartyProvider component
 * @interface CounterpartyProviderProps
 * @property {ReactNode} children - Child components that will have access to the context
 */
type CounterpartyProviderProps = {
  children: ReactNode;
};

/**
 * Interface defining the shape of the Counterparty context
 * @interface CounterpartyContextType
 * @property {Counterparty[]} counterparties - List of all counterparties
 * @property {boolean} isModalOpen - Controls the visibility of the modal
 * @property {boolean} isLoading - Indicates if data is currently being loaded
 * @property {boolean} loadedSuccess - Indicates if the last data load was successful
 * @property {Counterparty | undefined} editingCounterparty - Currently edited counterparty, if any
 * @property {(isOpen: boolean) => void} setIsModalOpen - Function to control modal visibility
 * @property {() => void} handleAddNew - Function to handle adding a new counterparty
 * @property {(counterpartyId: string) => void} handleEdit - Function to handle editing a counterparty
 * @property {(id: string) => Promise<void>} handleDelete - Function to handle deleting a counterparty
 * @property {(data: CounterpartyFormData) => Promise<void>} handleSave - Function to handle saving a counterparty
 */
type CounterpartyContextType = {
  setIsModalOpen: (isOpen: boolean) => void;
  handleAddNew: () => void;
  handleEdit: (counterpartyId: string) => void;
  handleDelete: (id: string) => Promise<void>;
  handleSave: (data: CounterpartyFormData) => Promise<void>;
} & CounterpartyContextState;

/**
 * Context for managing counterparty data and operations
 * @constant
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
  const [state, dispatch] = useReducer(counterpartyReducer, counterpartyInitialState);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      await firstLoad();
      registrarTimer(timerRef, async () => {
        await loadCounterparties();
      });
    };
    bootstrap();
    return () => cleanUpTimer(timerRef);
  }, []);

  /**
   * Loads all counterparties from the service
   * @private
   */
  const loadCounterparties = async () => {
    try {
      dispatch({
        type: ActionType.LOAD_SUCCESS,
        payload: await counterpartyService.getAllCounterparties(),
      });
    } catch (error) {
      console.error('Failed to load counterparties:', error);
      dispatch({ type: ActionType.LOAD_ERROR });
    }
  };

  /**
   * Performs the initial load of counterparties
   * @private
   */
  const firstLoad = async () => {
    dispatch({ type: ActionType.LOAD_START });
    await loadCounterparties();
  };

  /**
   * Handles editing an existing counterparty
   * @param {string} counterpartyId - The counterparty to edit
   * @public
   */
  const handleEdit = useCallback(async (counterpartyId: string) => {
    const counterparty = await counterpartyService.getCounterpartyById(counterpartyId);
    dispatch({ type: ActionType.OPEN_EDIT_MODAL, payload: counterparty });
  }, []);

  /**
   * Handles deleting a counterparty
   * @param {string} id - The ID of the counterparty to delete
   * @returns {Promise<void>}
   * @public
   */
  const handleDelete = useCallback(async (id: string): Promise<void> => {
    try {
      dispatch({ type: ActionType.DELETE_COUNTERPARTY, payload: id });
      const updatedList = await counterpartyService.deleteCounterparty(id);
      if (!isEqual(updatedList, state.counterparties)) {
        dispatch({ type: ActionType.LOAD_SUCCESS, payload: updatedList });
        return;
      }
    } catch (error) {
      dispatch({ type: ActionType.LOAD_ERROR });
      console.error('Failed to delete counterparty:', error);
    }
  }, []);

  /**
   * Handles saving a counterparty (create or update)
   * @param {CounterpartyFormData} data - The counterparty data to save
   * @returns {Promise<void>}
   * @public
   */
  const handleSave = useCallback(async (data: CounterpartyFormData): Promise<void> => {
    try {
      let updatedCounterparties: Counterparty[];
      if (data.id) {
        dispatch({ type: ActionType.UPDATE_COUNTERPARTY, payload: { ...data, id: data.id } });
        updatedCounterparties = await counterpartyService.updateCounterparty(data.id, data);
      } else {
        updatedCounterparties = await counterpartyService.createCounterparty({
          ...data,
          id: crypto.randomUUID(),
        });
      }
      if (!isEqual(updatedCounterparties, state.counterparties)) {
        dispatch({ type: ActionType.LOAD_SUCCESS, payload: updatedCounterparties });
      }
    } catch (error) {
      dispatch({ type: ActionType.LOAD_ERROR });
    } finally {
      dispatch({ type: ActionType.CLOSE_MODAL });
    }
  }, []);

  /**
   * Controls the visibility of the modal
   * @param {boolean} isOpen - Whether the modal should be open
   * @public
   */
  const setIsModalOpen = useCallback(
    (isOpen: boolean) =>
      isOpen
        ? dispatch({ type: ActionType.OPEN_ADD_MODAL })
        : dispatch({ type: ActionType.CLOSE_MODAL }),
    []
  );

  /**
   * Handles adding a new counterparty
   * @public
   */
  const handleAddNew = useCallback(() => dispatch({ type: ActionType.OPEN_ADD_MODAL }), []);

  const value = useMemo<CounterpartyContextType>(
    () => ({
      counterparties: state.counterparties,
      editingCounterparty: state.editingCounterparty ?? undefined,
      isLoading: state.isLoading,
      isModalOpen: state.isModalOpen,
      loadedSuccess: state.loadedSuccess,
      setIsModalOpen,
      handleAddNew,
      handleEdit,
      handleDelete,
      handleSave,
    }),
    [
      state.counterparties,
      state.editingCounterparty,
      state.isLoading,
      state.isModalOpen,
      state.loadedSuccess,
      setIsModalOpen,
      handleAddNew,
      handleEdit,
      handleDelete,
      handleSave,
    ]
  );

  return <CounterpartyContext.Provider value={value}>{children}</CounterpartyContext.Provider>;
};
