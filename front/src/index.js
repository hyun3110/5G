import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18+ 전용
import App from './App';
import './index.css';

// React 18+에서 createRoot 사용
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
