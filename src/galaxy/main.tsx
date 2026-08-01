import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BoxGalaxyPage from './BoxGalaxyPage';
import './galaxy.css';

createRoot(document.getElementById('galaxy-root')!).render(
  <StrictMode>
    <BoxGalaxyPage />
  </StrictMode>,
);
