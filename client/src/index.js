import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 18+ syntax
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL ERROR: Could not find 'root' element in index.html");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
