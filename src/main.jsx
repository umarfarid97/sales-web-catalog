import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PreviewHomeApp from './PreviewHomeApp.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreviewHomeApp />
  </StrictMode>,
);
