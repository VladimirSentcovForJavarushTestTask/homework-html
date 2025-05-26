import './modal.css';
import {escapeHtml} from "../../../utils/utils";

/**
 * @typedef {Object} Counterparty
 * @property {string} id - Unique identifier for the counterparty
 * @property {string} name - Name of the counterparty (company or individual)
 * @property {string} inn - Tax identification number (11 digits)
 * @property {string} address - Physical address
 * @property {string} kpp - Tax registration reason code (9 digits)
 */

/**
 * CounterpartyModal class manages the modal dialog for creating and editing counterparties.
 * It handles form validation, data submission, and modal visibility.
 *
 * @class CounterpartyModal
 */
export class CounterpartyModal {
  /**
   * Creates an interactive modal for adding / editing counterparties.
   *
   * @param {(data: Counterparty) => void} onSave
   *        Callback executed after a successful form submission, receiving
   *        the counterparty object to persist.
   * @param {HTMLElement}      [modal=document.getElementById('counterparty-modal')]
   *        Root modal element. When omitted, the element with ID
   *        "counterparty-modal" is used.
   * @param {HTMLFormElement}  [form=document.getElementById('counterparty-form')]
   *        Form inside the modal. Defaults to the element with ID
   *        "counterparty-form".
   * @param {HTMLButtonElement}[cancelBtn=document.getElementById('cancel-btn')]
   *        Button that closes the modal without saving. Defaults to the element
   *        with ID "cancel-btn".
   *
   * @throws {Error} If any of the required DOM elements cannot be found.
   */

  constructor(
      onSave,
      modal = document.getElementById('counterparty-modal'),
      form = document.getElementById('counterparty-form'),
      cancelBtn = document.getElementById('cancel-btn')
  ) {
    this.onSave = onSave;
    this.modal = modal;
    this.form = form;
    this.cancelBtn = cancelBtn;
    this.currentId = null;

    if (!this.modal || !this.form || !this.cancelBtn) {
      throw new Error('Required modal elements not found');
    }

    this.setupEventListeners();
  }

  /**
   * Sets up all event listeners for the modal form.
   * Handles form submission, cancel button, and input validation.
   *
   * @method setupEventListeners
   * @private
   */
  setupEventListeners = () => {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        const formData = new FormData(this.form);
        const data = {
          id: escapeHtml(this.currentId),
          name: escapeHtml(formData.get('name')),
          inn: escapeHtml(formData.get('inn')),
          address: escapeHtml(formData.get('address')),
          kpp: escapeHtml(formData.get('kpp'))
        };
        this.onSave(data);
        this.hide();
      }
    });

    this.cancelBtn.addEventListener('click', () => {
      this.hide();
    });

    // Add input validation listeners
    const innInput = document.getElementById('inn');
    const kppInput = document.getElementById('kpp');
    const innError = document.getElementById('inn-error');
    const kppError = document.getElementById('kpp-error');

    innInput.addEventListener('input', () => {
      this.validateInn(innInput, innError);
    });

    kppInput.addEventListener('input', () => {
      this.validateKpp(kppInput, kppError);
    });
  }

  /**
   * Validates the INN (Tax Identification Number) input.
   * INN must be exactly 11 digits.
   *
   * @method validateInn
   * @private
   * @param {HTMLInputElement} input - The INN input element
   * @param {HTMLElement} errorElement - The element to display error message
   * @returns {boolean} True if INN is valid, false otherwise
   */
  validateInn(input, errorElement) {
    const value = input.value;
    if (value.length !== 11 || !/^\d+$/.test(value)) {
      errorElement.classList.remove('hidden');
      return false;
    }
    errorElement.classList.add('hidden');
    return true;
  }

  /**
   * Validates the KPP (Tax Registration Reason Code) input.
   * KPP must be exactly 9 digits.
   *
   * @method validateKpp
   * @private
   * @param {HTMLInputElement} input - The KPP input element
   * @param {HTMLElement} errorElement - The element to display error message
   * @returns {boolean} True if KPP is valid, false otherwise
   */
  validateKpp(input, errorElement) {
    const value = input.value;
    if (value.length !== 9 || !/^\d+$/.test(value)) {
      errorElement.classList.remove('hidden');
      return false;
    }
    errorElement.classList.add('hidden');
    return true;
  }

  /**
   * Validates the entire form by checking all required fields.
   * Currently validates INN and KPP fields.
   *
   * @method validateForm
   * @private
   * @returns {boolean} True if all validations pass, false otherwise
   */
  validateForm() {
    const innInput = document.getElementById('inn');
    const kppInput = document.getElementById('kpp');
    const innError = document.getElementById('inn-error');
    const kppError = document.getElementById('kpp-error');

    const isInnValid = this.validateInn(innInput, innError);
    const isKppValid = this.validateKpp(kppInput, kppError);

    return isInnValid && isKppValid;
  }

  /**
   * Shows the modal dialog and populates form fields if editing an existing counterparty.
   *
   * @method show
   * @public
   * @param {Counterparty} [counterparty=null] - The counterparty data to edit, or null for new entry
   */
  show(counterparty = null) {
    this.currentId = counterparty?.id;
    this.form.reset();

    if (counterparty) {
      this.form.name.value = counterparty.name;
      this.form.inn.value = counterparty.inn;
      this.form.address.value = counterparty.address;
      this.form.kpp.value = counterparty.kpp;
    }

    this.modal.classList.remove('hidden');
  }

  /**
   * Hides the modal dialog and resets the form.
   *
   * @method hide
   * @public
   */
  hide() {
    this.modal.classList.add('hidden');
    this.form.reset();
    this.currentId = null;
  }
} 