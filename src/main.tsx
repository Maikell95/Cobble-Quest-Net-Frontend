import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { prefetchPokemon } from './data/pokemonCache';

// Defer pokemon prefetch so it doesn't compete with critical page resources
requestIdleCallback?.(() => prefetchPokemon()) ?? setTimeout(prefetchPokemon, 1000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
