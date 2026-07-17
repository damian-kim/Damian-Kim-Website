import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import FinalistsApp from './FinalistsApp';
import './finalists.css';

createRoot(document.getElementById('finalists-root')!).render(
  <StrictMode>
    <FinalistsApp />
  </StrictMode>,
);
