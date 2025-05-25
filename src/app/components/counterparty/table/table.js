import './table.css';
import {escapeHtml} from "../../../utils/utils";

/**
 * @typedef {Object} Counterparty
 * @property {string} id - Unique identifier for the counterparty
 * @property {string} name - Name of the counterparty (company or individual)
 * @property {string} inn - Tax identification number
 * @property {string} address - Physical address
 * @property {string} kpp - Tax registration reason code
 */

/**
 * CounterpartyTable class manages the display and interaction with a table of counterparties.
 * It handles rendering, editing, deleting, and saving counterparty data.
 * 
 * @class CounterpartyTable
 */
export class CounterpartyTable {
  /**
   * @type {Counterparty[]} Array of counterparty objects
   * @private
   */
  counterparty = [
    {
      id: crypto.randomUUID(),
      name: "ООО Компания 42",
      inn: "12345678901",
      address: "г. Москва, ул. Примерная, д. 1",
      kpp: "123456789"
    },
    {
      id: crypto.randomUUID(),
      name: "ИП Иванов И.И.",
      inn: "98765432101",
      address: "г. Санкт-Петербург, пр. Невский, д. 2",
      kpp: "987654321"
    }
  ];

  /**
   * @type {HTMLTableSectionElement} Reference to the table body element
   * @private
   */
  tbody = document.getElementById('counterparty-table-body');

  /**
   * Creates an instance of CounterpartyTable.
   * 
   * @param {function(Counterparty): void} onEdit - Callback function called when a counterparty is edited
   * @throws {Error} If the table body element is not found
   */
  constructor(onEdit) {
    if (!this.tbody) {
      throw new Error('Table body element not found');
    }
    this.onEdit = onEdit;
  }

  /**
   * Renders the table with all counterparty data.
   * Creates table rows with edit and delete functionality.
   * 
   * @method render
   * @public
   */
  render = () => {
    this.tbody.innerHTML = '';

    this.counterparty.forEach(counterparty => {
      const row = document.createElement('tr');
      row.className = 'bg-white border-b hover:bg-gray-50 cursor-pointer';
      row.innerHTML = `
                <td class="px-6 py-4">${escapeHtml(counterparty.name)}</td>
                <td class="px-6 py-4">${escapeHtml(counterparty.inn)}</td>
                <td class="px-6 py-4">${escapeHtml(counterparty.address)}</td>
                <td class="px-6 py-4">${escapeHtml(counterparty.kpp)}</td>
                <td class="px-6 py-4">
                    <button class="text-red-600 hover:text-red-900 delete-btn" 
                    data-id="${escapeHtml(counterparty.id)}">
                        Удалить
                    </button>
                </td>
            `;

      // Add double click handler for editing
      row.addEventListener('dblclick', () => {
        this.onEdit(counterparty);
      });

      // Add click handler for delete button
      const deleteBtn = row.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onDelete(escapeHtml(counterparty.id));
      });

      this.tbody.appendChild(row);
    });
  }

  /**
   * Deletes a counterparty by its ID and re-renders the table.
   * 
   * @method onDelete
   * @public
   * @param {string} id - The ID of the counterparty to delete
   */
  onDelete = (id) => {
    const idx = this.findIndex(id);
    if (idx === -1) {
      return;
    }
    this.counterparty.splice(idx, 1);
    this.render();
  }

  /**
   * Saves or updates a counterparty in the table.
   * If the counterparty has an ID, it updates the existing entry.
   * If no ID is provided, it creates a new entry with a generated UUID.
   * 
   * @method onSave
   * @public
   * @param {Counterparty} data - The counterparty data to save
   */
  onSave = (data) => {
    if (data.id) {
      // Update existing
      const index = this.findIndex(data.id);
      if (index !== -1) {
        this.counterparty[index] = data;
      } else {
        return;
      }
    } else {
      // Add new
      data.id = crypto.randomUUID(); // Generate unique ID
      this.counterparty.push(data);
    }
    this.render();
  }

  /**
   * Finds the index of a counterparty in the array by its ID.
   * 
   * @method findIndex
   * @private
   * @param {string} id - The ID to search for
   * @returns {number} The index of the counterparty, or -1 if not found
   */
  findIndex = (id) => {
    return this.counterparty.findIndex(c => c.id === id);
  }
} 