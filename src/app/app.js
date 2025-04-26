import html from "./app.html";
import header from "./components/Header.html";
import auth_modal from "./components/AuthModal.html";
import transaction_table from "./components/TransactionTable.html";
import './app.css'

const rootElement = document.getElementById('root');
rootElement.innerHTML = html;
const header_content_element = document.getElementById('header');
header_content_element.innerHTML = header;
const auth_modal_element = document.getElementById('auth-modal');
auth_modal_element.innerHTML = auth_modal;
const transaction_table_element = document.getElementById('transaction-table');
transaction_table_element.innerHTML = transaction_table;