import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HeroLab from './HeroLab';
import './heroLab.css';

createRoot(document.getElementById('hero-lab-root')!).render(
  <StrictMode><HeroLab /></StrictMode>,
);
