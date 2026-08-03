import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import DancingCubesPage from './DancingCubesPage';
import './dancingCubes.css';

createRoot(document.getElementById('dancing-cubes-root')!).render(
  <StrictMode>
    <DancingCubesPage />
  </StrictMode>,
);
