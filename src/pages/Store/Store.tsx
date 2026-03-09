import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const B = import.meta.env.BASE_URL;
const CATEGORIES = [
  { id: 'all', label: 'Todo', image: '' },
  { id: 'keys', label: 'Llaves', image: `${B}images/store/gilded-chest.png` },
  { id: 'breeding', label: 'Crianza', image: `${B}images/store/pasture-block.png` },
  { id: 'battlepass', label: 'Pase de Batalla', image: `${B}images/store/kings-rock.png` },
  { id: 'extras', label: 'Extras', image: `${B}images/store/relic-coin.png` },
];

export default function Store() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none max-md:gap-2 max-md:-mx-4 max-md:px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`flex items-center gap-3 px-7 py-3.5 rounded-xl border text-[0.95rem] font-semibold cursor-pointer whitespace-nowrap transition-all max-md:px-5 max-md:py-3 max-md:text-[0.88rem] max-md:gap-2 max-md:rounded-lg ${
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

        {/* Coming Soon */}
        <motion.div
          className="text-center py-20 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={`${B}images/pokemon/gastly.webp`} alt="Gastly" className="w-24 h-24 mx-auto mb-4 opacity-30 grayscale" />
          <h3 className="text-[var(--text-secondary)] text-[1.2rem] font-semibold mb-2">Próximamente</h3>
          <p className="text-[var(--text-muted)] text-[0.95rem]">Los artículos de la tienda se publicarán aquí pronto.</p>
        </motion.div>
      </div>
    </div>
  );
}
