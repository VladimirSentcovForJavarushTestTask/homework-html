import html from "./app.html";
import headerHtml from "./components/header/header.html";
import counterpartyTableHtml from "./components/counterparty/table/table.html";
import counterpartyModalHtml from "./components/counterparty/modal/modal.html";
import {CounterpartyTable} from "./components/counterparty/table/table.js";
import {CounterpartyModal} from "./components/counterparty/modal/modal.js";
import './app.css'

/**
 * Main application entry point that initializes and connects all components.
 * This module is responsible for:
 * 1. Setting up the DOM structure
 * 2. Initializing the header component
 * 3. Initializing the counterparty table
 * 4. Initializing the counterparty modal
 * 5. Connecting the table and modal components
 */

// Initialize components
const rootElement = document.getElementById('root');
rootElement.innerHTML = html;

// Set up header
const headerElement = document.getElementById('header');
headerElement.innerHTML = headerHtml;

// Set up table
const tableContainer = document.getElementById('counterparty-table');
tableContainer.innerHTML = counterpartyTableHtml;

// Set up modal
const modalContainer = document.getElementById('modal-counterparty');
modalContainer.innerHTML = counterpartyModalHtml;

/**
 * Initialize the counterparty table component.
 * The table displays a list of counterparties and handles their display and deletion.
 * @type {CounterpartyTable}
 */
const table = new CounterpartyTable((item) => modal.show(item));

/**
 * Initialize the counterparty modal component.
 * The modal handles creating and editing counterparty records.
 * @type {CounterpartyModal}
 */
const modal = new CounterpartyModal((data) => table.onSave(data));

// Initial render of the table
table.render();