
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove StrictMode here since we've moved it to App.tsx
const root = createRoot(document.getElementById("root")!);
root.render(<App />);
