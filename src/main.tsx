import React from 'react';
import { createRoot } from 'react-dom/client';
import 'flowbite';
import './style.css';
import App from './app/App';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
