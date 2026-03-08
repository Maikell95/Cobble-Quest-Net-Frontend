import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { prefetchPokemon } from './data/pokemonCache';

// Start downloading pokemon.json immediately, before any component mounts
prefetchPokemon();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
