import { Counterparty } from '../types';

/**
 * State interface for the Counterparty context
 * @interface CounterpartyContextState
 * @property {Counterparty[]} counterparties - List of all counterparties
 * @property {boolean} isModalOpen - Controls the visibility of the modal
 * @property {boolean} isLoading - Indicates if data is currently being loaded
 * @property {boolean} loadedSuccess - Indicates if the last data load was successful
 * @property {Counterparty | undefined} editingCounterparty - Currently edited counterparty, if any
 */
export type CounterpartyContextState = {
  counterparties: Counterparty[];
  isModalOpen: boolean;
  isLoading: boolean;
  loadedSuccess: boolean;
  editingCounterparty?: Counterparty;
};

/**
 * Initial state for the counterparty reducer
 * @constant
 */
export const counterpartyInitialState: CounterpartyContextState = {
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
export enum ActionType {
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
export type Action =
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
  return counterparties.map((cp) => (cp.id === counterparty.id ? counterparty : cp));
}

/**
 * Helper function to add a new counterparty to the array
 * @param {Counterparty[]} counterparties - Array of counterparties
 * @param {Counterparty} counterparty - Counterparty to add
 * @returns {Counterparty[]} New array with added counterparty
 * @private
 */
function addCounterparty(counterparties: Counterparty[], counterparty: Counterparty) {
  return [...counterparties, counterparty];
}

/**
 * Reducer function for managing counterparty state
 * @param {CounterpartyContextState} state - Current state
 * @param {Action} action - Action to be performed
 * @returns {CounterpartyContextState} New state
 * @private
 */
export const counterpartyReducer = (state: CounterpartyContextState, action: Action) => {
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
      return { ...state, isModalOpen: false, editingCounterparty: undefined };
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
