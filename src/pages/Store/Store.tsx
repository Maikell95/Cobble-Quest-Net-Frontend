import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Loader2, ShoppingCart } from 'lucide-react';
import { usePlayer } from '../../context/usePlayer';
import { useCart } from '../../context/useCart';
import { CURRENCY_SYMBOL } from '../../config/constants';
import type { StoreItem } from '../../types';

const B = import.meta.env.BASE_URL;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
  const [packages, setPackages] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { requireWhitelistedPlayer, player } = usePlayer();
  const { addItem } = useCart();

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/store`);
      const data = await res.json();
      if (res.ok && data.success) {
        setPackages(data.data);
      } else {
        setError(data.message || 'No se pudieron cargar los artículos.');
      }
    } catch {
      setError(null); // Silently show empty state if backend unavailable
    } finally {
      setLoading(false);
    }
  }

  const filtered = packages.filter((pkg) => {
    const matchesCategory = activeCategory === 'all' ||
      pkg.category?.toLowerCase().includes(activeCategory);
    const matchesSearch = !searchQuery ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (pkg: StoreItem) => {
    if (!(await requireWhitelistedPlayer()) || !player) return;

    addItem({
      item: pkg,
      quantity: 1,
      type: 'item',
    });
  };

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

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <Loader2 size={40} className="animate-spin text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Cargando artículos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]">
            <img src={`${B}images/pokemon/gastly.webp`} alt="Gastly" className="w-24 h-24 mx-auto mb-4 opacity-30 grayscale" />
            <h3 className="text-[var(--text-secondary)] text-[1.2rem] font-semibold mb-2">Error</h3>
            <p className="text-[var(--text-muted)] text-[0.95rem]">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {filtered.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className="bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {pkg.image && (
                  <div className="h-48 bg-[var(--bg-surface)] flex items-center justify-center overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5">
                  {pkg.category && (
                    <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-primary/80 mb-1 block">
                      {pkg.category}
                    </span>
                  )}
                  <h3 className="text-[var(--text-primary)] text-[1.05rem] font-bold mb-2">{pkg.name}</h3>
                  {pkg.description && (
                    <p className="text-[var(--text-muted)] text-[0.85rem] mb-4 line-clamp-2">{pkg.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[var(--text-primary)] text-[1.2rem] font-extrabold">
                      {CURRENCY_SYMBOL}{pkg.price.toFixed(2)}
                    </span>
                    <button
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white border-none font-semibold text-[0.85rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)]"
                      onClick={() => handleAddToCart(pkg)}
                    >
                      <ShoppingCart size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <motion.div
            className="text-center py-20 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={`${B}images/pokemon/gastly.webp`} alt="Gastly" className="w-24 h-24 mx-auto mb-4 opacity-30 grayscale" />
            <h3 className="text-[var(--text-secondary)] text-[1.2rem] font-semibold mb-2">
              {packages.length === 0 ? 'Próximamente' : 'Sin resultados'}
            </h3>
            <p className="text-[var(--text-muted)] text-[0.95rem]">
              {packages.length === 0
                ? 'Los artículos de la tienda se publicarán aquí pronto.'
                : 'No se encontraron artículos con esos filtros.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
