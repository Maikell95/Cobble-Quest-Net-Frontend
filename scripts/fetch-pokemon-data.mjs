/**
 * Fetches Pokémon species data from the official Cobblemon GitLab repository
 * by downloading the repo archive, then generates a compact JSON for the Wiki.
 *
 * Source: https://gitlab.com/cable-mc/cobblemon/-/tree/main/common/src/main/resources/data/cobblemon/species
 * Images: https://cobbledex.b-cdn.net/3dmons/previews/small/{pokedexNumber}.webp
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SPECIES_PATH = 'common/src/main/resources/data/cobblemon/species';
const SPAWN_PATH = 'common/src/main/resources/data/cobblemon/spawn_pool_world';
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'data', 'pokemon.json');
const TEMP_DIR = path.join(__dirname, '..', '.tmp-cobblemon');
// GitLab archives with path filter
const SPECIES_ARCHIVE_URL = `https://gitlab.com/cable-mc/cobblemon/-/archive/main/cobblemon-main.tar.gz?path=${SPECIES_PATH}`;
const SPAWN_ARCHIVE_URL = `https://gitlab.com/cable-mc/cobblemon/-/archive/main/cobblemon-main.tar.gz?path=${SPAWN_PATH}`;

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const doRequest = (reqUrl) => {
      const mod = reqUrl.startsWith('https') ? https : http;
      mod
        .get(reqUrl, { headers: { 'User-Agent': 'CobbleQuest-Wiki/1.0' } }, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return doRequest(res.headers.location);
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          res.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', reject);
    };
    doRequest(url);
  });
}

function extractPokemonData(data, generation) {
  const pokemon = {
    id: data.nationalPokedexNumber,
    name: data.name,
    types: [data.primaryType],
    generation,
    stats: data.baseStats || {},
    abilities: (data.abilities || []).map((a) => {
      const isHidden = a.startsWith('h:');
      return { name: a.replace('h:', ''), hidden: isHidden };
    }),
    eggGroups: data.eggGroups || [],
    catchRate: data.catchRate,
    height: data.height, // in decimetres
    weight: data.weight, // in hectograms
    evYield: data.evYield || {},
    maleRatio: data.maleRatio,
    baseExp: data.baseExperienceYield,
    expGroup: data.experienceGroup,
    eggCycles: data.eggCycles,
    evolutions: (data.evolutions || []).map((e) => ({
      to: e.result,
      method: e.variant,
      level: e.requirements?.find((r) => r.variant === 'level')?.minLevel || null,
    })),
    drops: (data.drops?.entries || []).map((d) => ({
      item: d.item?.replace('minecraft:', '').replace('cobblemon:', '') || '',
      chance: d.percentage || 100,
      qty: d.quantityRange || '1',
    })),
    moves: {
      level: [],
      tm: [],
      egg: [],
      tutor: [],
    },
  };

  if (data.secondaryType) {
    pokemon.types.push(data.secondaryType);
  }

  // Parse moves
  (data.moves || []).forEach((m) => {
    if (m.startsWith('tm:')) {
      pokemon.moves.tm.push(m.replace('tm:', ''));
    } else if (m.startsWith('egg:')) {
      pokemon.moves.egg.push(m.replace('egg:', ''));
    } else if (m.startsWith('tutor:')) {
      pokemon.moves.tutor.push(m.replace('tutor:', ''));
    } else if (/^\d+:/.test(m)) {
      const [lvl, name] = m.split(':');
      pokemon.moves.level.push({ level: parseInt(lvl), name });
    }
  });

  // Sort level moves
  pokemon.moves.level.sort((a, b) => a.level - b.level);

  return pokemon;
}

function getGenerationNumber(folder) {
  const match = folder.match(/generation(\d+)(.*)/);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const suffix = match[2];
  if (suffix === 'b') return num; // 7b is still gen 7
  if (suffix === 'a') return num; // 8a is still gen 8
  return num;
}

/**
 * Parse spawn pool files and build a map of pokemon name -> spawn info
 * Collects: biomes, structures, timeRange, weather, presets, rarity, neededNearbyBlocks
 */
function parseSpawnData(spawnDir) {
  const spawnMap = new Map(); // pokemonName -> { biomes, structures, timeRanges, weather, presets, buckets, nearbyBlocks }

  if (!fs.existsSync(spawnDir)) {
    console.log('   ⚠️ Spawn dir not found, skipping spawn data');
    return spawnMap;
  }

  const files = fs.readdirSync(spawnDir).filter((f) => f.endsWith('.json'));
  console.log(`   Found ${files.length} spawn pool files`);

  function ensureEntry(name) {
    if (!spawnMap.has(name)) {
      spawnMap.set(name, {
        biomes: new Set(),
        structures: new Set(),
        timeRanges: new Set(),
        weather: new Set(),
        presets: new Set(),
        buckets: new Set(),
        nearbyBlocks: new Set(),
        canSeeSky: null, // null=unknown, true=surface, false=underground, 'both' if mixed
      });
    }
    return spawnMap.get(name);
  }

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(spawnDir, file), 'utf-8');
      const data = JSON.parse(raw);
      if (data.enabled === false) continue;

      for (const spawn of data.spawns || []) {
        const pokeName = (spawn.pokemon || '').split(' ')[0].toLowerCase();
        if (!pokeName) continue;

        const entry = ensureEntry(pokeName);
        const cond = spawn.condition || {};

        // Biomes
        for (const b of cond.biomes || []) {
          entry.biomes.add(cleanBiomeName(b));
        }

        // Structures
        for (const s of cond.structures || []) {
          entry.structures.add(cleanStructureName(s));
        }

        // Time range
        if (cond.timeRange) {
          entry.timeRanges.add(cond.timeRange);
        }

        // Weather
        if (cond.isRaining === true) entry.weather.add('rain');
        if (cond.isRaining === false) entry.weather.add('clear');
        if (cond.isThundering === true) entry.weather.add('thunder');

        // Presets (spawn context)
        if (spawn.presets) {
          const presetList = Array.isArray(spawn.presets) ? spawn.presets : [spawn.presets];
          for (const p of presetList) {
            if (p !== 'natural') entry.presets.add(p); // skip 'natural' as it's default/noise
          }
        }

        // Bucket (rarity)
        if (spawn.bucket) {
          entry.buckets.add(spawn.bucket);
        }

        // Nearby blocks
        for (const nb of cond.neededNearbyBlocks || []) {
          entry.nearbyBlocks.add(cleanBiomeName(nb));
        }

        // canSeeSky
        if (cond.canSeeSky !== undefined) {
          if (entry.canSeeSky === null) entry.canSeeSky = cond.canSeeSky;
          else if (entry.canSeeSky !== cond.canSeeSky) entry.canSeeSky = 'both';
        }
      }
    } catch (_) {
      /* skip invalid files */
    }
  }

  return spawnMap;
}

function cleanBiomeName(biome) {
  return biome
    .replace(/^#?cobblemon:is_/, '')
    .replace(/^#?cobblemon:/, '')
    .replace(/^#?minecraft:is_/, '')
    .replace(/^#?minecraft:/, '')
    .replace(/^#?c:is_/, '')
    .replace(/^#?c:/, '')
    .replace(/_/g, ' ');
}

function cleanStructureName(structure) {
  return structure
    .replace(/^#?cobblemon:/, '')
    .replace(/^#?minecraft:/, '')
    .replace(/^#?the_bumblezone:/, 'bumblezone:')
    .replace(/^#?aether:/, 'aether:')
    .replace(/_/g, ' ');
}

async function main() {
  console.log('🔍 Fetching Pokémon species data from Cobblemon GitLab...\n');

  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  // Step 1a: Download species archive
  const speciesArchive = path.join(TEMP_DIR, 'cobblemon-species.tar.gz');
  if (!fs.existsSync(speciesArchive)) {
    console.log('⬇️  Downloading species data archive...');
    await downloadFile(SPECIES_ARCHIVE_URL, speciesArchive);
    console.log(`   ✅ Downloaded: ${(fs.statSync(speciesArchive).size / 1048576).toFixed(1)} MB`);
  } else {
    console.log('📦 Using cached species archive...');
  }

  // Step 1b: Download spawn pool archive
  const spawnArchive = path.join(TEMP_DIR, 'cobblemon-spawn.tar.gz');
  if (!fs.existsSync(spawnArchive)) {
    console.log('⬇️  Downloading spawn pool archive...');
    await downloadFile(SPAWN_ARCHIVE_URL, spawnArchive);
    console.log(`   ✅ Downloaded: ${(fs.statSync(spawnArchive).size / 1048576).toFixed(1)} MB`);
  } else {
    console.log('📦 Using cached spawn archive...');
  }

  // Step 2: Extract both archives
  console.log('\n📂 Extracting data...');
  const extractDir = path.join(TEMP_DIR, 'extracted');
  if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true });
  fs.mkdirSync(extractDir, { recursive: true });

  const speciesExtract = path.join(extractDir, 'species');
  const spawnExtract = path.join(extractDir, 'spawn');
  fs.mkdirSync(speciesExtract, { recursive: true });
  fs.mkdirSync(spawnExtract, { recursive: true });

  execSync(`tar -xzf "${speciesArchive}" -C "${speciesExtract}"`, { stdio: 'inherit' });
  execSync(`tar -xzf "${spawnArchive}" -C "${spawnExtract}"`, { stdio: 'inherit' });

  // Find species directory
  const speciesRootEntries = fs.readdirSync(speciesExtract);
  const speciesRoot = speciesRootEntries.find((e) => e.startsWith('cobblemon'));
  if (!speciesRoot) throw new Error('Could not find cobblemon root in species archive');
  const speciesDir = path.join(speciesExtract, speciesRoot, SPECIES_PATH);
  if (!fs.existsSync(speciesDir)) throw new Error(`Species dir not found: ${speciesDir}`);

  // Find spawn directory
  const spawnRootEntries = fs.readdirSync(spawnExtract);
  const spawnRoot = spawnRootEntries.find((e) => e.startsWith('cobblemon'));
  let spawnDir = null;
  if (spawnRoot) {
    const candidate = path.join(spawnExtract, spawnRoot, SPAWN_PATH);
    if (fs.existsSync(candidate)) spawnDir = candidate;
  }

  // Step 3: Parse spawn data
  console.log('\n🌍 Parsing spawn data...');
  const spawnMap = spawnDir ? parseSpawnData(spawnDir) : new Map();
  console.log(`   Spawn data for ${spawnMap.size} Pokémon`);

  // Step 4: Read all generation folders
  const allPokemon = [];
  const genFolders = fs
    .readdirSync(speciesDir)
    .filter(
      (d) => fs.statSync(path.join(speciesDir, d)).isDirectory() && d.startsWith('generation'),
    )
    .sort();

  console.log(`\n📊 Found ${genFolders.length} generation folders: ${genFolders.join(', ')}`);

  for (const gen of genFolders) {
    const genPath = path.join(speciesDir, gen);
    const files = fs.readdirSync(genPath).filter((f) => f.endsWith('.json'));
    const genNum = getGenerationNumber(gen);

    console.log(`\n🔹 ${gen}: ${files.length} species`);

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(genPath, file), 'utf-8');
        const data = JSON.parse(raw);
        if (data.implemented !== false) {
          const poke = extractPokemonData(data, genNum);
          // Attach spawn data
          const nameLower = poke.name.toLowerCase();
          const spawn = spawnMap.get(nameLower);
          if (spawn) {
            poke.biomes = [...spawn.biomes];
            poke.structures = [...spawn.structures];
            poke.timeRanges = [...spawn.timeRanges];
            poke.weather = [...spawn.weather];
            poke.spawnPresets = [...spawn.presets];
            poke.rarity = [...spawn.buckets];
            poke.nearbyBlocks = [...spawn.nearbyBlocks];
          } else {
            poke.biomes = [];
            poke.structures = [];
            poke.timeRanges = [];
            poke.weather = [];
            poke.spawnPresets = [];
            poke.rarity = [];
            poke.nearbyBlocks = [];
          }
          allPokemon.push(poke);
        }
      } catch (err) {
        console.error(`   ⚠️ Failed: ${file} - ${err.message}`);
      }
    }
  }

  // Sort by Pokédex number
  allPokemon.sort((a, b) => a.id - b.id);

  // Ensure output directory exists
  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Write compact JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPokemon));

  // Cleanup
  console.log('\n🧹 Cleaning up temp files...');
  fs.rmSync(TEMP_DIR, { recursive: true });

  // Stats
  const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`\n✅ Done! Generated ${OUTPUT_FILE}`);
  console.log(`   ${allPokemon.length} Pokémon | ${fileSizeKB} KB`);
  console.log(
    `   Generations: ${[...new Set(allPokemon.map((p) => p.generation))].sort((a, b) => a - b).join(', ')}`,
  );
  console.log(
    `   Pokédex range: #${allPokemon[0]?.id} - #${allPokemon[allPokemon.length - 1]?.id}`,
  );
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
