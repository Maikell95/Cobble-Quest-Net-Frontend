import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getPokemonData } from '../../data/pokemonCache';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Swords,
  Shield,
  Heart,
  Zap,
  Star,
  FlaskConical,
  MapPin,
  Clock,
  Cloud,
  Landmark,
  Gem,
  Layers,
} from 'lucide-react';

// ===== Types =====
export interface PokemonStats {
  hp: number;
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
}

interface PokemonAbility {
  name: string;
  hidden: boolean;
}

interface LevelMove {
  level: number;
  name: string;
}

interface PokemonEvolution {
  to: string;
  method: string;
  level: number | null;
}

interface PokemonDrop {
  item: string;
  chance: number;
  qty: string;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  generation: number;
  stats: PokemonStats;
  abilities: PokemonAbility[];
  eggGroups: string[];
  catchRate: number;
  height: number;
  weight: number;
  evYield: Partial<PokemonStats>;
  maleRatio: number;
  baseExp: number;
  expGroup: string;
  eggCycles: number;
  evolutions: PokemonEvolution[];
  drops: PokemonDrop[];
  biomes: string[];
  structures: string[];
  timeRanges: string[];
  weather: string[];
  spawnPresets: string[];
  rarity: string[];
  nearbyBlocks: string[];
  moves: {
    level: LevelMove[];
    tm: string[];
    egg: string[];
    tutor: string[];
  };
}

// ===== Constants =====
const TYPES = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
];

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// ===== Spanish Translations =====
const TYPE_ES: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

const EGG_GROUP_ES: Record<string, string> = {
  amorphous: 'Amorfo',
  bug: 'Bicho',
  ditto: 'Ditto',
  dragon: 'Dragón',
  fairy: 'Hada',
  field: 'Campo',
  flying: 'Volador',
  grass: 'Planta',
  human_like: 'Humanoide',
  mineral: 'Mineral',
  monster: 'Monstruo',
  undiscovered: 'Desconocido',
  water_1: 'Agua 1',
  water_2: 'Agua 2',
  water_3: 'Agua 3',
};

const EXP_GROUP_ES: Record<string, string> = {
  erratic: 'Errático',
  fast: 'Rápido',
  fluctuating: 'Fluctuante',
  medium_fast: 'Medio rápido',
  medium_slow: 'Medio lento',
  slow: 'Lento',
};

const ITEM_ES: Record<string, string> = {
  ender_pearl: 'Perla de Ender',
  bone: 'Hueso',
  string: 'Hilo',
  gunpowder: 'Pólvora',
  slime_ball: 'Bola de slime',
  feather: 'Pluma',
  ink_sac: 'Saco de tinta',
  glow_ink_sac: 'Saco de tinta luminosa',
  honeycomb: 'Panal de miel',
  honey_bottle: 'Botella de miel',
  spider_eye: 'Ojo de araña',
  phantom_membrane: 'Membrana de fantasma',
  leather: 'Cuero',
  rabbit_hide: 'Piel de conejo',
  rabbit_foot: 'Pata de conejo',
  egg: 'Huevo',
  wool: 'Lana',
  white_wool: 'Lana blanca',
  milk_bucket: 'Cubo de leche',
  snowball: 'Bola de nieve',
  clay_ball: 'Bola de arcilla',
  magma_cream: 'Crema de magma',
  blaze_rod: 'Vara de blaze',
  ghast_tear: 'Lágrima de ghast',
  gold_nugget: 'Pepita de oro',
  iron_nugget: 'Pepita de hierro',
  prismarine_shard: 'Fragmento de prismarina',
  prismarine_crystals: 'Cristales de prismarina',
  nautilus_shell: 'Caparazón de nautilo',
  scute: 'Escama de tortuga',
  coal: 'Carbón',
  charcoal: 'Carbón vegetal',
  diamond: 'Diamante',
  emerald: 'Esmeralda',
  lapis_lazuli: 'Lapislázuli',
  redstone: 'Redstone',
  iron_ingot: 'Lingote de hierro',
  gold_ingot: 'Lingote de oro',
  copper_ingot: 'Lingote de cobre',
  amethyst_shard: 'Fragmento de amatista',
  sugar: 'Azúcar',
  sugar_cane: 'Caña de azúcar',
  bamboo: 'Bambú',
  cactus: 'Cactus',
  kelp: 'Alga',
  seagrass: 'Hierba marina',
  stick: 'Palo',
  apple: 'Manzana',
  sweet_berries: 'Bayas dulces',
  glow_berries: 'Bayas luminosas',
  melon_slice: 'Rodaja de sandía',
  pumpkin_seeds: 'Semillas de calabaza',
  wheat_seeds: 'Semillas de trigo',
  beetroot_seeds: 'Semillas de remolacha',
  cocoa_beans: 'Granos de cacao',
  mushroom: 'Seta',
  red_mushroom: 'Seta roja',
  brown_mushroom: 'Seta marrón',
  nether_wart: 'Verruga del Nether',
  glowstone_dust: 'Polvo de piedra luminosa',
  quartz: 'Cuarzo',
  nether_star: 'Estrella del Nether',
  chorus_fruit: 'Fruta coral',
  shulker_shell: 'Caparazón de shulker',
  echo_shard: 'Fragmento de eco',
  disc_fragment_5: 'Fragmento de disco',
  rotten_flesh: 'Carne podrida',
  arrow: 'Flecha',
  sand: 'Arena',
  gravel: 'Grava',
  clay: 'Arcilla',
  ice: 'Hielo',
  packed_ice: 'Hielo compacto',
  blue_ice: 'Hielo azul',
  pointed_dripstone: 'Estalactita',
  moss_block: 'Bloque de musgo',
  vine: 'Enredadera',
  lily_pad: 'Nenúfar',
  experience_candy_xs: 'Caramelo Exp. XS',
  experience_candy_s: 'Caramelo Exp. S',
  experience_candy_m: 'Caramelo Exp. M',
  experience_candy_l: 'Caramelo Exp. L',
  experience_candy_xl: 'Caramelo Exp. XL',
  rare_candy: 'Caramelo Raro',
  oran_berry: 'Baya Aranja',
  sitrus_berry: 'Baya Zidra',
  rawst_berry: 'Baya Safre',
  cheri_berry: 'Baya Cereza',
  pecha_berry: 'Baya Meloc',
  aspear_berry: 'Baya Perasi',
  leppa_berry: 'Baya Zanama',
  lum_berry: 'Baya Lumba',
  thunder_stone: 'Piedra Trueno',
  fire_stone: 'Piedra Fuego',
  water_stone: 'Piedra Agua',
  leaf_stone: 'Piedra Hoja',
  moon_stone: 'Piedra Lunar',
  sun_stone: 'Piedra Solar',
  dusk_stone: 'Piedra Noche',
  dawn_stone: 'Piedra Alba',
  shiny_stone: 'Piedra Día',
  ice_stone: 'Piedra Hielo',
  oval_stone: 'Piedra Oval',
  everstone: 'Piedra Eterna',
  kings_rock: 'Roca del Rey',
  metal_coat: 'Revestimiento Met.',
  dragon_scale: 'Escama Dragón',
  up_grade: 'Mejora',
  dubious_disc: 'Disco Dudoso',
  protector: 'Protector',
  electirizer: 'Electrizador',
  magmarizer: 'Magmalizador',
  razor_claw: 'Garra Afilada',
  razor_fang: 'Colmillo Afilado',
  prism_scale: 'Escama Bella',
  reaper_cloth: 'Tela Terrible',
  deep_sea_scale: 'Esc. Marina',
  deep_sea_tooth: 'Diente Marino',
};

const IMG_BASE = 'https://cobbledex.b-cdn.net/3dmons/previews/small';
const ITEMS_PER_PAGE = 60;

function getPokemonImage(id: number) {
  return `${IMG_BASE}/${id}.webp`;
}

function translateType(type: string) {
  return TYPE_ES[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

function formatBiome(biome: string) {
  return biome.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function translateEggGroup(group: string) {
  return EGG_GROUP_ES[group] || group.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function translateExpGroup(group: string) {
  return EXP_GROUP_ES[group] || group.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function translateItem(item: string) {
  return ITEM_ES[item] || item.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatCapitalize(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoveName(move: string) {
  return move
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (s) => s.toUpperCase())
    .replace(/([a-z])(\d)/g, '$1 $2');
}

function formatStatName(stat: string) {
  const map: Record<string, string> = {
    hp: 'HP',
    attack: 'Ataque',
    defence: 'Defensa',
    special_attack: 'At. Esp.',
    special_defence: 'Def. Esp.',
    speed: 'Velocidad',
  };
  return map[stat] || stat;
}

function getStatTotal(stats: PokemonStats) {
  return (
    (stats.hp || 0) +
    (stats.attack || 0) +
    (stats.defence || 0) +
    (stats.special_attack || 0) +
    (stats.special_defence || 0) +
    (stats.speed || 0)
  );
}

// ===== PokemonCard =====
function PokemonCard({ pokemon, onClick }: { pokemon: Pokemon; onClick: () => void }) {
  const mainType = pokemon.types[0];
  return (
    <motion.div
      className="poke-card"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ '--type-color': TYPE_COLORS[mainType] || '#888' } as React.CSSProperties}
    >
      <div className="poke-card-img-wrap">
        <img
          src={getPokemonImage(pokemon.id)}
          alt={pokemon.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="poke-card-info">
        <span className="poke-card-number">#{String(pokemon.id).padStart(4, '0')}</span>
        <h3 className="poke-card-name">{pokemon.name}</h3>
        <div className="poke-card-types">
          {pokemon.types.map((t) => (
            <span key={t} className="poke-type-badge" style={{ background: TYPE_COLORS[t] }}>
              {translateType(t)}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ===== StatBar =====
function StatBar({ label, value, max = 255 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    value >= 150
      ? '#22c55e'
      : value >= 100
        ? '#84cc16'
        : value >= 70
          ? '#eab308'
          : value >= 40
            ? '#f97316'
            : '#ef4444';
  return (
    <div className="stat-bar-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-bar-bg">
        <motion.div
          className="stat-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

// ===== PokemonModal =====
function PokemonModal({
  pokemon,
  allPokemon,
  onClose,
  onNavigate,
}: {
  pokemon: Pokemon;
  allPokemon: Pokemon[];
  onClose: () => void;
  onNavigate: (p: Pokemon) => void;
}) {
  const [activeTab, setActiveTab] = useState<'stats' | 'moves' | 'details'>('stats');
  const mainType = pokemon.types[0];

  // Find evolution chain relatives
  const evoNames = pokemon.evolutions.map((e) => e.to.split(' ')[0].toLowerCase());
  const evoTargets = evoNames
    .map((name) => allPokemon.find((p) => p.name.toLowerCase() === name))
    .filter(Boolean) as Pokemon[];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      className="poke-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="poke-modal"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--type-color': TYPE_COLORS[mainType] || '#888' } as React.CSSProperties}
      >
        <button className="poke-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Header */}
        <div className="poke-modal-header">
          <div className="poke-modal-img-wrap">
            <img src={getPokemonImage(pokemon.id)} alt={pokemon.name} />
          </div>
          <div className="poke-modal-title">
            <span className="poke-modal-number">#{String(pokemon.id).padStart(4, '0')}</span>
            <h2>{pokemon.name}</h2>
            <div className="poke-card-types">
              {pokemon.types.map((t) => (
                <span key={t} className="poke-type-badge" style={{ background: TYPE_COLORS[t] }}>
                  {translateType(t)}
                </span>
              ))}
            </div>
            <span className="poke-modal-gen">Generación {pokemon.generation}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="poke-modal-tabs">
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            <Swords size={14} /> Estadísticas
          </button>
          <button
            className={activeTab === 'moves' ? 'active' : ''}
            onClick={() => setActiveTab('moves')}
          >
            <Zap size={14} /> Movimientos
          </button>
          <button
            className={activeTab === 'details' ? 'active' : ''}
            onClick={() => setActiveTab('details')}
          >
            <Star size={14} /> Detalles
          </button>
        </div>

        {/* Tab Content */}
        <div className="poke-modal-content">
          {activeTab === 'stats' && (
            <div className="poke-tab-stats">
              <div className="stats-bars">
                {Object.entries(pokemon.stats).map(([key, val]) => (
                  <StatBar key={key} label={formatStatName(key)} value={val as number} />
                ))}
                <div className="stat-bar-row stat-total">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{getStatTotal(pokemon.stats)}</span>
                  <div className="stat-bar-bg">
                    <motion.div
                      className="stat-bar-fill"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((getStatTotal(pokemon.stats) / 720) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ background: 'linear-gradient(90deg, #DC2626, #F59E0B)' }}
                    />
                  </div>
                </div>
              </div>

              {/* EV Yield */}
              {Object.values(pokemon.evYield).some((v) => v && v > 0) && (
                <div className="poke-info-block">
                  <h4>
                    <FlaskConical size={14} /> Puntos de Esfuerzo
                  </h4>
                  <div className="ev-yield-tags">
                    {Object.entries(pokemon.evYield)
                      .filter(([, v]) => v && v > 0)
                      .map(([k, v]) => (
                        <span key={k} className="ev-tag">
                          +{v} {formatStatName(k)}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Evolutions */}
              {evoTargets.length > 0 && (
                <div className="poke-info-block">
                  <h4>Evoluciones</h4>
                  <div className="evo-chain">
                    {pokemon.evolutions.map((evo, i) => {
                      const target = evoTargets[i];
                      if (!target) return null;
                      return (
                        <div key={i} className="evo-item" onClick={() => onNavigate(target)}>
                          <img src={getPokemonImage(target.id)} alt={target.name} />
                          <span>{target.name}</span>
                          {evo.level && <span className="evo-level">Nv. {evo.level}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="poke-tab-moves">
              {pokemon.moves.level.length > 0 && (
                <div className="moves-section">
                  <h4>Por Nivel</h4>
                  <div className="moves-grid">
                    {pokemon.moves.level.map((m, i) => (
                      <div key={i} className="move-item">
                        <span className="move-level">Nv.{m.level}</span>
                        <span className="move-name">{formatMoveName(m.name)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pokemon.moves.tm.length > 0 && (
                <div className="moves-section">
                  <h4>TM / HM</h4>
                  <div className="moves-tags">
                    {pokemon.moves.tm.map((m, i) => (
                      <span key={i} className="move-tag">
                        {formatMoveName(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pokemon.moves.egg.length > 0 && (
                <div className="moves-section">
                  <h4>Movimientos Huevo</h4>
                  <div className="moves-tags">
                    {pokemon.moves.egg.map((m, i) => (
                      <span key={i} className="move-tag egg">
                        {formatMoveName(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {pokemon.moves.tutor.length > 0 && (
                <div className="moves-section">
                  <h4>Tutor</h4>
                  <div className="moves-tags">
                    {pokemon.moves.tutor.map((m, i) => (
                      <span key={i} className="move-tag tutor">
                        {formatMoveName(m)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="poke-tab-details">
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Altura</span>
                  <span className="detail-value">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Peso</span>
                  <span className="detail-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ratio Captura</span>
                  <span className="detail-value">{pokemon.catchRate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Exp. Base</span>
                  <span className="detail-value">{pokemon.baseExp}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Grupo Exp.</span>
                  <span className="detail-value">{translateExpGroup(pokemon.expGroup || '')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ciclos Huevo</span>
                  <span className="detail-value">{pokemon.eggCycles}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ratio ♂</span>
                  <span className="detail-value">
                    {pokemon.maleRatio === -1
                      ? 'Sin género'
                      : `${(pokemon.maleRatio * 100).toFixed(0)}%`}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Generación</span>
                  <span className="detail-value">{pokemon.generation}</span>
                </div>
              </div>

              {pokemon.abilities.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <Shield size={14} /> Habilidades
                  </h4>
                  <div className="abilities-list">
                    {pokemon.abilities.map((a, i) => (
                      <span key={i} className={`ability-tag ${a.hidden ? 'hidden-ability' : ''}`}>
                        {formatMoveName(a.name)}
                        {a.hidden && <small> (oculta)</small>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.eggGroups.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <Heart size={14} /> Grupos Huevo
                  </h4>
                  <div className="egg-group-tags">
                    {pokemon.eggGroups.map((g, i) => (
                      <span key={i} className="egg-group-tag">
                        {translateEggGroup(g)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.biomes.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <MapPin size={14} /> Biomas
                  </h4>
                  <div className="biome-tags">
                    {pokemon.biomes.map((b, i) => (
                      <span key={i} className="biome-tag">
                        {formatBiome(b)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.structures.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <Landmark size={14} /> Estructuras
                  </h4>
                  <div className="spawn-detail-tags">
                    {pokemon.structures.map((s, i) => (
                      <span key={i} className="structure-tag">
                        {formatCapitalize(s)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(pokemon.timeRanges.length > 0 || pokemon.weather.length > 0) && (
                <div className="poke-info-block">
                  <h4>
                    <Clock size={14} /> Condiciones de Aparición
                  </h4>
                  <div className="spawn-conditions-row">
                    {pokemon.timeRanges.length > 0 && (
                      <div className="spawn-cond-group">
                        <span className="spawn-cond-label">
                          <Clock size={12} /> Horario
                        </span>
                        <div className="spawn-detail-tags">
                          {pokemon.timeRanges.map((t, i) => (
                            <span key={i} className="time-tag">
                              {formatCapitalize(t)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {pokemon.weather.length > 0 && (
                      <div className="spawn-cond-group">
                        <span className="spawn-cond-label">
                          <Cloud size={12} /> Clima
                        </span>
                        <div className="spawn-detail-tags">
                          {pokemon.weather.map((w, i) => (
                            <span key={i} className="weather-tag">
                              {formatCapitalize(w)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {pokemon.spawnPresets.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <Layers size={14} /> Contexto de Aparición
                  </h4>
                  <div className="spawn-detail-tags">
                    {pokemon.spawnPresets.map((p, i) => (
                      <span key={i} className="preset-tag">
                        {formatCapitalize(p)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.rarity.length > 0 && (
                <div className="poke-info-block">
                  <h4>
                    <Gem size={14} /> Rareza
                  </h4>
                  <div className="spawn-detail-tags">
                    {pokemon.rarity.map((r, i) => (
                      <span key={i} className={`rarity-tag rarity-${r}`}>
                        {formatCapitalize(r)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.nearbyBlocks.length > 0 && (
                <div className="poke-info-block">
                  <h4>Bloques Cercanos Necesarios</h4>
                  <div className="spawn-detail-tags">
                    {pokemon.nearbyBlocks.map((nb, i) => (
                      <span key={i} className="block-tag">
                        {nb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {pokemon.drops.length > 0 && (
                <div className="poke-info-block">
                  <h4>Objetos que suelta</h4>
                  <div className="drops-list">
                    {pokemon.drops.map((d, i) => (
                      <div key={i} className="drop-item">
                        <span className="drop-name">{translateItem(d.item)}</span>
                        <span className="drop-info">
                          {d.qty !== '1' && `×${d.qty}`} {d.chance < 100 && `${d.chance}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ===== Wiki Page =====
export default function Wiki() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load data (prefetched at app startup)
  useEffect(() => {
    getPokemonData()
      .then((data) => {
        setAllPokemon(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load pokemon data:', err);
        setLoading(false);
      });
  }, []);

  // Filter pokemon
  const filtered = useMemo(() => {
    let result = allPokemon;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || String(p.id).includes(q));
    }
    if (selectedType) {
      result = result.filter((p) => p.types.includes(selectedType));
    }
    if (selectedGen !== null) {
      result = result.filter((p) => p.generation === selectedGen);
    }
    return result;
  }, [allPokemon, search, selectedType, selectedGen]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, selectedType, selectedGen]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const clearFilters = () => {
    setSearch('');
    setSelectedType(null);
    setSelectedGen(null);
  };

  const hasFilters = search || selectedType || selectedGen !== null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-8 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[2rem]">Cobbledex</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">Base de datos completa con {allPokemon.length} Pokémon del servidor Cobblemon</p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 pt-8 flex-wrap section-container max-[480px]:flex-col" ref={gridRef}>
        <div className="flex-1 min-w-[220px] flex items-center gap-2.5 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl transition-colors focus-within:border-primary max-[480px]:w-full max-[480px]:min-w-0">
          <Search size={18} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder="Buscar por nombre o número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-none bg-transparent outline-none text-[var(--text-primary)] text-[0.95rem] font-[inherit] placeholder:text-[var(--text-muted)]"
          />
          {search && (
            <button className="flex items-center justify-center border-none bg-transparent text-[var(--text-muted)] cursor-pointer p-0.5 rounded transition-colors hover:text-primary" onClick={() => setSearch('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card)] border rounded-xl text-[0.9rem] font-medium cursor-pointer transition-all whitespace-nowrap max-[480px]:w-full max-[480px]:justify-center ${
            showFilters ? 'border-primary text-primary' : 'border-[var(--border-theme)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          Filtros
          {hasFilters && (
            <span className="bg-primary text-white text-[0.7rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {[selectedType, selectedGen].filter(Boolean).length + (search ? 1 : 0)}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="section-container mt-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="filter-panel">
              {/* Type Section */}
              <div className="filter-section-block">
                <div className="filter-section-header">
                  <h4>Tipo</h4>
                  {selectedType && (
                    <span className="filter-active-badge">{translateType(selectedType)}</span>
                  )}
                </div>
                <div className="type-filter-grid">
                  {TYPES.map((type) => (
                    <button
                      key={type}
                      className={`type-filter-btn ${selectedType === type ? 'active' : ''}`}
                      style={
                        {
                          '--type-bg': TYPE_COLORS[type],
                          '--type-bg-alpha': TYPE_COLORS[type] + '18',
                        } as React.CSSProperties
                      }
                      onClick={() => setSelectedType(selectedType === type ? null : type)}
                    >
                      {translateType(type)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="filter-divider" />

              {/* Generation Section */}
              <div className="filter-section-block">
                <div className="filter-section-header">
                  <h4>Generación</h4>
                  {selectedGen && (
                    <span className="filter-active-badge">Gen {selectedGen}</span>
                  )}
                </div>
                <div className="gen-filter-row">
                  {GENERATIONS.map((gen) => (
                    <button
                      key={gen}
                      className={`gen-filter-btn ${selectedGen === gen ? 'active' : ''}`}
                      onClick={() => setSelectedGen(selectedGen === gen ? null : gen)}
                    >
                      <span className="gen-number">{gen}</span>
                      <span className="gen-label">Gen</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilters && (
                <>
                  <div className="filter-divider" />
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <X size={15} /> Limpiar todos los filtros
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results info */}
      <div className="flex justify-between items-center pt-4 text-[0.85rem] text-[var(--text-muted)] section-container">
        <span>{filtered.length} Pokémon encontrados</span>
        {totalPages > 1 && (
          <span>
            Página {page} de {totalPages}
          </span>
        )}
      </div>

      {/* Pokemon Grid */}
      <div className="section-container pt-6 pb-16">
        {loading ? (
          <div className="text-center py-16 px-8 text-[var(--text-muted)]">
            <div className="wiki-spinner" />
            <p>Cargando Pokédex...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="wiki-empty">
            <Search size={48} />
            <h3>Sin resultados</h3>
            <p>No se encontraron Pokémon con esos filtros</p>
            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="poke-grid">
            {paginated.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={() => setSelectedPokemon(p)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="wiki-pagination">
            <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
              <ChevronLeft size={16} /> Anterior
            </button>

            <div className="pagination-pages">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={page === pageNum ? 'active' : ''}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            allPokemon={allPokemon}
            onClose={() => setSelectedPokemon(null)}
            onNavigate={(p) => setSelectedPokemon(p)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
