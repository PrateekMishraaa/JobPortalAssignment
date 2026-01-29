import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from 'react';
import { JobsProvider } from './context/JobsContext.jsx'; // import your context provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JobsProvider>
      <App />
    </JobsProvider>
  </StrictMode>,
);
