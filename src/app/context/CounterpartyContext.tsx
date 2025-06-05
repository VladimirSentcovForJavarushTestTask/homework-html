import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { Counterparty, CounterpartyFormData } from '../types';
import counterpartyService from '../../services/CounterpartyService';
import isEqual from 'lodash/isEqual';

/**
 * State interface for the Counterparty context
 * @interface CounterpartyContextState
 * @property {Counterparty[]} counterparties - List of all counterparties
 * @property {boolean} isModalOpen - Controls the visibility of the modal
 * @property {boolean} isLoading - Indicates if data is currently being loaded
 * @property {boolean} loadedSuccess - Indicates if the last data load was successful
 * @property {Counterparty | undefined} editingCounterparty - Currently edited counterparty, if any
 */
type CounterpartyContextState = {
  counterparties: Counterparty[];
  isModalOpen: boolean;
  isLoading: boolean;
  loadedSuccess: boolean;
  editingCounterparty: Counterparty | undefined;
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
 * Props for the CounterpartyProvider component
 * @interface CounterpartyProviderProps
 * @property {ReactNode} children - Child components that will have access to the context
 */
interface CounterpartyProviderProps {
  children: ReactNode;
}

/**
 * Initial state for the counterparty reducer
 * @constant
 */
const initialState: CounterpartyContextState = {
  counterparties: [],
  isModalOpen: false,
  isLoading: true,
  loadedSuccess: true,
  editingCounterparty: undefined,
};

/* ---------- Actions ---------- */

/**
 * Enum defining all possible action types for the reducer
 * @enum {string}
 * @property {string} LOAD_START - Indicates the start of a data loading operation
 * @property {string} LOAD_SUCCESS - Indicates successful data loading
 * @property {string} LOAD_ERROR - Indicates a data loading error
 * @property {string} OPEN_ADD_MODAL - Opens the modal for adding a new counterparty
 * @property {string} OPEN_EDIT_MODAL - Opens the modal for editing an existing counterparty
 * @property {string} CLOSE_MODAL - Closes the modal
 * @property {string} DELETE_COUNTERPARTY - Deletes a counterparty
 * @property {string} UPDATE_COUNTERPARTY - Updates an existing counterparty
 * @property {string} CREATE_COUNTERPARTY - Creates a new counterparty
 */
enum ActionType {
  LOAD_START = 'LOAD_START',
  LOAD_SUCCESS = 'LOAD_SUCCESS',
  LOAD_ERROR = 'LOAD_ERROR',
  OPEN_ADD_MODAL = 'OPEN_ADD_MODAL',
  OPEN_EDIT_MODAL = 'OPEN_EDIT_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
  DELETE_COUNTERPARTY = 'DELETE_COUNTERPARTY',
  UPDATE_COUNTERPARTY = 'UPDATE_COUNTERPARTY',
  CREATE_COUNTERPARTY = 'CREATE_COUNTERPARTY',
}

/**
 * Union type of all possible actions for the reducer
 * @typedef {Object} Action
 * @property {ActionType} type - The type of action
 * @property {any} [payload] - Optional payload for the action
 */
type Action =
  | { type: ActionType.LOAD_START }
  | { type: ActionType.LOAD_SUCCESS; payload: Counterparty[] }
  | { type: ActionType.LOAD_ERROR }
  | { type: ActionType.OPEN_ADD_MODAL }
  | { type: ActionType.OPEN_EDIT_MODAL; payload: Counterparty }
  | { type: ActionType.CLOSE_MODAL }
  | { type: ActionType.DELETE_COUNTERPARTY; payload: string }
  | { type: ActionType.UPDATE_COUNTERPARTY; payload: Counterparty }
  | { type: ActionType.CREATE_COUNTERPARTY; payload: Counterparty };

/* ---------- Reducer ---------- */

/**
 * Helper function to replace a counterparty in the array
 * @param {Counterparty[]} counterparties - Array of counterparties
 * @param {Counterparty} counterparty - Counterparty to replace
 * @returns {Counterparty[]} New array with replaced counterparty
 * @private
 */
function replaceCounterparty(counterparties: Counterparty[], counterparty: Counterparty) {
  const index = counterparties.findIndex((cp) => cp.id === counterparty.id);
  if (index !== -1) {
    counterparties[index] = counterparty;
  }
  return [...counterparties];
}

/**
 * Helper function to add a new counterparty to the array
 * @param {Counterparty[]} counterparties - Array of counterparties
 * @param {Counterparty} counterparty - Counterparty to add
 * @returns {Counterparty[]} New array with added counterparty
 * @private
 */
function addCounterparty(counterparties: Counterparty[], counterparty: Counterparty) {
  counterparties.push(counterparty);
  return [...counterparties];
}

/**
 * Reducer function for managing counterparty state
 * @param {CounterpartyContextState} state - Current state
 * @param {Action} action - Action to be performed
 * @returns {CounterpartyContextState} New state
 * @private
 */
const reducer = (state: CounterpartyContextState, action: Action) => {
  switch (action.type) {
    case ActionType.LOAD_START:
      return { ...state, isLoading: true };
    case ActionType.LOAD_SUCCESS:
      return { ...state, isLoading: false, counterparties: action.payload, loadedSuccess: true };
    case ActionType.LOAD_ERROR:
      return { ...state, isLoading: false, loadedSuccess: false };
    case ActionType.OPEN_ADD_MODAL:
      return { ...state, isModalOpen: true, editingCounterparty: undefined };
    case ActionType.OPEN_EDIT_MODAL:
      return { ...state, isModalOpen: true, editingCounterparty: action.payload };
    case ActionType.CLOSE_MODAL:
      return { ...state, isModalOpen: false };
    case ActionType.DELETE_COUNTERPARTY:
      return {
        ...state,
        counterparties: state.counterparties.filter(
          (counterparty) => counterparty.id !== action.payload
        ),
      };
    case ActionType.UPDATE_COUNTERPARTY:
      return {
        ...state,
        counterparties: replaceCounterparty(state.counterparties, action.payload),
      };
    case ActionType.CREATE_COUNTERPARTY:
      return {
        ...state,
        counterparties: addCounterparty(state.counterparties, action.payload),
      };
    default:
      return state;
  }
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
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    firstLoad().then(() => {
      window.setInterval(async () => {
        await loadCounterparties();
      }, 10000);
    });
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
  const handleEdit = async (counterpartyId: string) => {
    const counterparty = await counterpartyService.getCounterpartyById(counterpartyId);
    dispatch({ type: ActionType.OPEN_EDIT_MODAL, payload: counterparty });
  };

  /**
   * Handles deleting a counterparty
   * @param {string} id - The ID of the counterparty to delete
   * @returns {Promise<void>}
   * @public
   */
  const handleDelete = async (id: string): Promise<void> => {
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
  };

  /**
   * Handles saving a counterparty (create or update)
   * @param {CounterpartyFormData} data - The counterparty data to save
   * @returns {Promise<void>}
   * @public
   */
  const handleSave = async (data: CounterpartyFormData): Promise<void> => {
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
  };

  /**
   * Controls the visibility of the modal
   * @param {boolean} isOpen - Whether the modal should be open
   * @public
   */
  const setIsModalOpen = (isOpen: boolean) =>
    isOpen
      ? dispatch({ type: ActionType.OPEN_ADD_MODAL })
      : dispatch({ type: ActionType.CLOSE_MODAL });

  /**
   * Handles adding a new counterparty
   * @public
   */
  const handleAddNew = () => dispatch({ type: ActionType.OPEN_ADD_MODAL });

  const value: CounterpartyContextType = {
    counterparties: [...state.counterparties],
    editingCounterparty: state.editingCounterparty ? { ...state.editingCounterparty } : undefined,
    isLoading: state.isLoading,
    isModalOpen: state.isModalOpen,
    loadedSuccess: state.loadedSuccess,
    setIsModalOpen,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
  };

  return <CounterpartyContext.Provider value={value}>{children}</CounterpartyContext.Provider>;
};
