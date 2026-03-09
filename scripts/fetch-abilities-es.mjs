/**
 * Fetches all ability names in Spanish from PokeAPI v2
 * and creates a mapping file: { localSlug: spanishName }
 *
 * Usage: node scripts/fetch-abilities-es.mjs
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/data/abilities-es.json');

const API = 'https://pokeapi.co/api/v2';
const BATCH = 20;
const DELAY = 300;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Fetching ability list...');
  const list = await fetchJSON(`${API}/ability?limit=400`);
  console.log(`Found ${list.results.length} abilities`);

  const mapping = {};

  for (let i = 0; i < list.results.length; i += BATCH) {
    const batch = list.results.slice(i, i + BATCH);
    const promises = batch.map(async (entry) => {
      const data = await fetchJSON(entry.url);
      const esName = data.names.find(n => n.language.name === 'es');
      const localSlug = entry.name.replace(/-/g, '');
      return { localSlug, spanish: esName ? esName.name : null };
    });

    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      if (r.spanish) {
        mapping[r.localSlug] = r.spanish;
      }
    }

    const done = Math.min(i + BATCH, list.results.length);
    process.stdout.write(`\r  ${done}/${list.results.length} abilities fetched`);

    if (i + BATCH < list.results.length) await sleep(DELAY);
  }

  console.log('\n');
  writeFileSync(OUTPUT, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`Wrote ${Object.keys(mapping).length} translations → ${OUTPUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
