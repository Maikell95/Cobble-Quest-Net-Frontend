import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { RARITY_COLORS, CURRENCY_SYMBOL } from '../../config/constants';

// Placeholder data — will be replaced with real data later
const CATEGORIES = [
  { id: 'all', label: 'Todo', image: '' },
  { id: 'keys', label: 'Llaves', image: '/images/store/gilded-chest.png' },
  { id: 'breeding', label: 'Crianza', image: '/images/store/pasture-block.png' },
  { id: 'battlepass', label: 'Pase de Batalla', image: '/images/store/kings-rock.png' },
  { id: 'extras', label: 'Extras', image: '/images/store/relic-coin.png' },
];

const PLACEHOLDER_ITEMS = [
  {
    id: 1,
    name: 'Llave Legendaria',
    category: 'keys',
    price: 4.99,
    rarity: 'legendary',
    image: '',
    description: 'Abre un cofre legendario con Pokémon y objetos exclusivos.',
  },
  {
    id: 2,
    name: 'Llave Mítica',
    category: 'keys',
    price: 7.99,
    rarity: 'epic',
    image: '',
    description: 'Accede a recompensas míticas con Pokémon ultra raros y objetos premium.',
  },
  {
    id: 3,
    name: 'Llave Shiny',
    category: 'keys',
    price: 5.99,
    rarity: 'rare',
    image: '',
    description: 'Desbloquea un cofre con probabilidad garantizada de Pokémon shiny.',
  },
  {
    id: 4,
    name: 'Ditto 6IV',
    category: 'breeding',
    price: 9.99,
    rarity: 'epic',
    image: '',
    description: 'Ditto con 6 IVs perfectos. Ideal para crianza competitiva.',
  },
  {
    id: 5,
    name: 'Destiny Knot',
    category: 'breeding',
    price: 3.99,
    rarity: 'uncommon',
    image: '',
    description: 'Pasa 5 IVs del padre al huevo. Esencial para crianza.',
  },
  {
    id: 6,
    name: 'Everstone',
    category: 'breeding',
    price: 2.99,
    rarity: 'uncommon',
    image: '',
    description: 'Hereda la naturaleza del Pokémon que la lleva al criar.',
  },
  {
    id: 7,
    name: 'Pase de Batalla - Temporada 1',
    category: 'battlepass',
    price: 9.99,
    rarity: 'rare',
    image: '',
    description: 'Desbloquea 50 niveles de recompensas exclusivas durante toda la temporada.',
  },
  {
    id: 8,
    name: 'Pase de Batalla Premium',
    category: 'battlepass',
    price: 19.99,
    rarity: 'legendary',
    image: '',
    discount: 20,
    description: 'Incluye el Pase de Batalla + 20 niveles desbloqueados y cosméticos extra.',
  },
  {
    id: 9,
    name: 'Rare Candy x20',
    category: 'extras',
    price: 6.99,
    rarity: 'uncommon',
    image: '',
    description: 'Pack de 20 Rare Candies para subir de nivel a tus Pokémon.',
  },
  {
    id: 10,
    name: 'Aura Shiny',
    category: 'extras',
    price: 7.99,
    rarity: 'epic',
    image: '',
    description: 'Efecto visual de aura brillante para tu personaje.',
  },
];

export default function Store() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = PLACEHOLDER_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[1.75rem]">Tienda</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">Consigue Pokémon, items y más para mejorar tu experiencia</p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pb-16">
        {/* Search & Filter Bar */}
        <div className="flex gap-4 mb-6 mt-8 max-sm:flex-col">
          <div className="flex-1 flex items-center gap-3 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl px-4 py-3 text-[var(--text-secondary)] transition-colors focus-within:border-primary/40">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-[0.95rem] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-secondary)] text-[0.95rem] cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
            <Filter size={18} />
            Filtrar
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`flex items-center gap-3 px-7 py-3.5 rounded-xl border text-[0.95rem] font-semibold cursor-pointer whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-[var(--bg-surface)] border-[var(--border-theme)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.image && (
                <img src={cat.image} alt={cat.label} className="w-6 h-6 object-contain" />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 max-sm:grid-cols-1">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {item.discount && (
                <div className="absolute top-3 right-3 z-[2] bg-primary text-white font-bold text-[0.8rem] px-2.5 py-1 rounded-md">
                  -{item.discount}%
                </div>
              )}

              <div className="h-[180px] bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] flex items-center justify-center">
                <div className="text-[var(--text-muted)] opacity-40">
                  <Sparkles size={32} />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-wide mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: RARITY_COLORS[item.rarity] }} />
                  <span style={{ color: RARITY_COLORS[item.rarity] }}>
                    {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                  </span>
                </div>

                <h3 className="text-[var(--text-primary)] text-[1.1rem] font-semibold mb-1">{item.name}</h3>
                <p className="text-[var(--text-muted)] text-[0.85rem] leading-relaxed mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.discount && (
                      <span className="text-[var(--text-muted)] text-[0.85rem] line-through">
                        {CURRENCY_SYMBOL}
                        {item.price.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[var(--text-primary)] text-[1.15rem] font-bold">
                      {CURRENCY_SYMBOL}
                      {item.discount
                        ? (item.price * (1 - item.discount / 100)).toFixed(2)
                        : item.price.toFixed(2)}
                    </span>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-gradient-to-br from-primary to-primary-dark text-white border-none text-[0.85rem] font-semibold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,38,38,0.35)]">
                    <ShoppingCart size={16} />
                    Añadir
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 px-4 text-[var(--text-muted)]">
            <Star size={48} className="mb-4 opacity-30" />
            <h3 className="text-[var(--text-secondary)] text-[1.2rem] mb-2">Sin resultados</h3>
            <p>No se encontraron artículos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
