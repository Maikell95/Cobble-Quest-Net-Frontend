/**
 * Fetches all move names in Spanish from PokeAPI v2
 * and creates a mapping file: { localSlug: spanishName }
 *
 * Local slugs are lowercase no-separator (e.g. "vinewhip")
 * PokeAPI slugs use hyphens (e.g. "vine-whip")
 *
 * Usage: node scripts/fetch-moves-es.mjs
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/data/moves-es.json');

const API = 'https://pokeapi.co/api/v2';
const BATCH = 20; // concurrent requests
const DELAY = 300; // ms between batches to respect rate limits

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  // 1. Get full move list
  console.log('Fetching move list...');
  const list = await fetchJSON(`${API}/move?limit=1000`);
  console.log(`Found ${list.results.length} moves`);

  const mapping = {};
  const results = list.results;

  // 2. Fetch each move in batches
  for (let i = 0; i < results.length; i += BATCH) {
    const batch = results.slice(i, i + BATCH);
    const promises = batch.map(async (entry) => {
      const data = await fetchJSON(entry.url);
      const esName = data.names.find(n => n.language.name === 'es');
      // local slug: remove hyphens from API name
      const localSlug = entry.name.replace(/-/g, '');
      return {
        localSlug,
        apiName: entry.name,
        spanish: esName ? esName.name : null,
      };
    });

    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      if (r.spanish) {
        mapping[r.localSlug] = r.spanish;
      }
    }

    const done = Math.min(i + BATCH, results.length);
    process.stdout.write(`\r  ${done}/${results.length} moves fetched`);

    if (i + BATCH < results.length) await sleep(DELAY);
  }

  console.log('\n');

  // 3. Write output
  writeFileSync(OUTPUT, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`Wrote ${Object.keys(mapping).length} translations → ${OUTPUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
