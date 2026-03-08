// Prefetch pokemon.json as soon as this module is imported.
// The promise is created once and reused by all consumers.

import type { Pokemon } from '../pages/Wiki/Wiki';

const url = `${import.meta.env.BASE_URL}data/pokemon.json`;

let cache: Promise<Pokemon[]> | null = null;

export function prefetchPokemon(): void {
  if (!cache) {
    cache = fetch(url)
      .then((r) => r.json())
      .then((data: Pokemon[]) => data);
  }
}

export function getPokemonData(): Promise<Pokemon[]> {
  if (!cache) prefetchPokemon();
  return cache!;
}
