import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Star, Zap, Gem, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../config/constants';
import './Ranks.css';

type Duration = 'monthly' | 'permanent';

const RANKS = [
  {
    id: 1,
    name: 'Super',
    monthlyPrice: 2.99,
    permanentPrice: 9.99,
    color: '#55ff55',
    icon: <Star size={28} />,
    description: 'El primer paso en tu aventura. Ventajas básicas para empezar.',
    features: [
      'Acceso a /fly en spawn',
      '2 homes adicionales',
      'Kit Super semanal',
      'Tag [Super] en chat',
      'Acceso a cosméticos básicos',
    ],
  },
  {
    id: 2,
    name: 'Honor',
    monthlyPrice: 5.99,
    permanentPrice: 19.99,
    color: '#5599ff',
    icon: <Shield size={28} />,
    description: 'Para entrenadores dedicados que buscan más poder y estilo.',
    features: [
      'Todo de Super +',
      'Acceso a /fly en todo el mundo',
      '5 homes adicionales',
      'Kit Honor semanal (mejor loot)',
      'Tag [Honor] en chat con color',
      'Partículas personalizadas',
      'Acceso a Pokémon shiny spawn',
    ],
  },
  {
    id: 3,
    name: 'Ultra',
    monthlyPrice: 9.99,
    permanentPrice: 34.99,
    color: '#aa55ff',
    icon: <Zap size={28} />,
    description: 'Demuestra tu dominio con privilegios de élite en el servidor.',
    features: [
      'Todo de Honor +',
      '10 homes adicionales',
      'Kit Ultra semanal (premium)',
      'Acceso a /heal',
      'Tag [Ultra] animado',
      'Montura exclusiva',
      'Prioridad en cola de servidor',
      'Chat con colores RGB',
    ],
    popular: true,
  },
  {
    id: 4,
    name: 'Luxury',
    monthlyPrice: 14.99,
    permanentPrice: 49.99,
    color: '#F472B6',
    icon: <Gem size={28} />,
    description: 'Lujo total con acceso a contenido premium y eventos VIP.',
    features: [
      'Todo de Ultra +',
      'Homes ilimitados',
      'Kit Luxury semanal (legendario)',
      'Acceso a /pokeheal',
      'Tag [Luxury] animado dorado',
      'Aura exclusiva',
      'Acceso anticipado a eventos',
      'Soporte VIP prioritario',
    ],
  },
  {
    id: 5,
    name: 'Master',
    monthlyPrice: 19.99,
    permanentPrice: 69.99,
    color: '#FFD93D',
    icon: <Crown size={28} />,
    description: 'El rango supremo. Todos los privilegios y máximo prestigio.',
    features: [
      'Todo de Luxury +',
      '1 Pokémon legendario al mes',
      'Kit Master semanal (mítico)',
      'Acceso a zonas exclusivas',
      'Tag [Master] animado arcoíris',
      'Mascota cosmética exclusiva',
      'Doble exp. en eventos',
      'Rol exclusivo en Discord',
    ],
  },
];

export default function Ranks() {
  const [duration, setDuration] = useState<Duration>('permanent');
  const [activeIndex, setActiveIndex] = useState(2); // Ultra (popular) as default

  const activeRank = RANKS[activeIndex];
  const price = duration === 'monthly' ? activeRank.monthlyPrice : activeRank.permanentPrice;

  const navigate = (dir: -1 | 1) => {
    setActiveIndex((prev) => (prev + dir + RANKS.length) % RANKS.length);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-4 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[1.75rem]">Rangos</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">Elige tu rango y desbloquea ventajas exclusivas</p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pt-4 pb-16">
        {/* Duration Toggle */}
        <div className="flex justify-center gap-2 mb-8 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-[14px] p-[0.35rem] w-fit mx-auto max-sm:w-full">
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[10px] border-none text-[0.9rem] font-medium cursor-pointer transition-all ${
              duration === 'monthly'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            } max-sm:flex-1 max-sm:justify-center max-sm:px-4`}
            onClick={() => setDuration('monthly')}
          >
            Mensual
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[10px] border-none text-[0.9rem] font-medium cursor-pointer transition-all ${
              duration === 'permanent'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            } max-sm:flex-1 max-sm:justify-center max-sm:px-4`}
            onClick={() => setDuration('permanent')}
          >
            Permanente
            <span className="text-[0.68rem] font-bold px-2 py-0.5 rounded-md bg-[rgba(34,197,94,0.12)] text-[#22c55e]">Ahorra más</span>
          </button>
        </div>

        {/* Circular Rank Selector */}
        <div className="rank-carousel">
          <button className="carousel-arrow carousel-arrow-left" onClick={() => navigate(-1)} aria-label="Anterior">
            <ChevronLeft size={24} />
          </button>

          <div className="carousel-ring">
            {RANKS.map((rank, index) => {
              const offset = ((index - activeIndex + RANKS.length + 2) % RANKS.length) - 2;
              const isActive = index === activeIndex;
              const absOff = Math.abs(offset);
              return (
                <motion.button
                  key={rank.id}
                  className={`carousel-node ${isActive ? 'active' : ''}`}
                  style={{ '--node-color': rank.color } as React.CSSProperties}
                  animate={{
                    opacity: isActive ? 1 : 1 - absOff * 0.25,
                    scale: isActive ? 1.15 : 1 - absOff * 0.1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={() => setActiveIndex(index)}
                  aria-label={rank.name}
                >
                  <div className="carousel-node-icon">{rank.icon}</div>
                  <span className="carousel-node-name">{rank.name}</span>
                  {rank.popular && !isActive && (
                    <span className="carousel-popular-dot"><Sparkles size={10} /></span>
                  )}
                </motion.button>
              );
            })}
          </div>

          <button className="carousel-arrow carousel-arrow-right" onClick={() => navigate(1)} aria-label="Siguiente">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Active Rank Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRank.id}
            className="rank-detail"
            style={{ '--rank-color': activeRank.color } as React.CSSProperties}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {activeRank.popular && (
              <div className="rank-detail-popular">
                <Sparkles size={14} /> Más Popular
              </div>
            )}

            <div className="rank-detail-header">
              <div className="rank-detail-icon" style={{ color: activeRank.color, background: `${activeRank.color}15` }}>
                {activeRank.icon}
              </div>
              <div>
                <h2 className="font-display" style={{ color: activeRank.color }}>{activeRank.name}</h2>
                <p>{activeRank.description}</p>
              </div>
              <div className="rank-detail-price">
                <span className="price-currency">{CURRENCY_SYMBOL}</span>
                <span className="price-amount">{price.toFixed(2)}</span>
                <span className="price-period">/ {duration === 'monthly' ? 'mes' : 'perm.'}</span>
              </div>
            </div>

            <div className="rank-detail-features">
              {activeRank.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  className="rank-detail-feature"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25, delay: i * 0.03 }}
                >
                  <Check size={16} style={{ color: activeRank.color }} className="shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            <button
              className="rank-detail-buy"
              style={{
                background: `linear-gradient(135deg, ${activeRank.color}, ${activeRank.color}cc)`,
                color: '#000',
              }}
            >
              Comprar {activeRank.name}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Info */}
        <motion.div
          className="text-center mt-12 p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-[var(--text-muted)] text-[0.88rem]">Los rangos se activan instantáneamente tras la compra. Los permanentes no expiran.</p>
          <p className="text-[var(--text-muted)] text-[0.88rem] mt-1">Las compras se procesan de forma segura. Consulta nuestra política de reembolsos.</p>
        </motion.div>
      </div>
    </div>
  );
}
