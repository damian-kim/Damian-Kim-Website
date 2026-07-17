import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ConceptLab from './ConceptLab';
import './concepts.css';

createRoot(document.getElementById('concept-root')!).render(
  <StrictMode>
    <ConceptLab />
  </StrictMode>,
);
