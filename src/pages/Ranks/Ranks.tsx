import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Crown, Star, Zap, Gem, Shield, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../config/constants';
import { usePlayer } from '../../context/usePlayer';
import './Ranks.css';

type Duration = 'monthly' | 'permanent';

interface Feature {
  text: string;
  wide?: boolean;
}

const RANKS = [
  {
    id: 1,
    name: 'Super',
    monthlyPrice: 4.99,
    permanentPrice: 14.99,
    color: '#55ff55',
    icon: <Star size={28} />,
    description: 'El primer paso en tu aventura. Ventajas básicas para empezar.',
    features: [
      { text: '3 Llaves Pokemon Random' },
      { text: '125 000 Dólares en el juego semanales' },
      { text: '8 caramelos raros semanales' },
      { text: 'Ahora puedes tener 2 /home set' },
      { text: '2% de descuento en casi todas las tiendas' },
      { text: 'Acceso a la tienda de raids Premium' },
      { text: 'Acceso a comandos como /pokeshout y /egginfo', wide: true },
      { text: 'Acceso al /kit super semanal' },
    ] as Feature[],
  },
  {
    id: 2,
    name: 'Ultra',
    monthlyPrice: 9.99,
    permanentPrice: 29.99,
    color: '#aa55ff',
    icon: <Zap size={28} />,
    description: 'Demuestra tu dominio con privilegios de élite en el servidor.',
    features: [
      { text: '6 Llaves Pokemon Random' },
      { text: '200 000 Dólares en el juego semanales' },
      { text: '16 caramelos raros semanales' },
      { text: 'Ahora puedes tener 3 /home set' },
      { text: '4% de descuento en casi todas las tiendas' },
      { text: 'Acceso a la tienda de raids Premium' },
      { text: 'Acceso a comandos como /pokeshout, /egginfo, /pc y /enderchest', wide: true },
      { text: 'Acceso al /kit ultra semanal' },
    ] as Feature[],
  },
  {
    id: 3,
    name: 'Honor',
    monthlyPrice: 19.99,
    permanentPrice: 44.99,
    color: '#5599ff',
    icon: <Shield size={28} />,
    description: 'Para entrenadores dedicados que buscan más poder y estilo.',
    features: [
      { text: '9 Llaves Pokemon Random' },
      { text: '375 000 Dólares en el juego semanales' },
      { text: '32 caramelos raros semanales' },
      { text: 'Ahora puedes tener 3 /home set' },
      { text: '6% de descuento en casi todas las tiendas' },
      { text: 'Acceso a la tienda de raids Premium' },
      { text: 'Acceso a comandos como /pokeshout, /egginfo, /pc, /anvil y /enderchest', wide: true },
      { text: 'Acceso al /kit honor semanal' },
    ] as Feature[],
    popular: true,
  },
  {
    id: 4,
    name: 'Luxury',
    monthlyPrice: 29.99,
    permanentPrice: 59.99,
    color: '#F472B6',
    icon: <Gem size={28} />,
    description: 'Lujo total con acceso a contenido premium y eventos VIP.',
    features: [
      { text: '12 Llaves Pokemon Random' },
      { text: '500 000 Dólares en el juego semanales' },
      { text: '64 caramelos raros semanales' },
      { text: 'Ahora puedes tener 4 /home set' },
      { text: '8% de descuento en casi todas las tiendas' },
      { text: 'Acceso a la tienda de raids Premium' },
      { text: 'Todos los comandos de Honor más /pokeshoutallme, /feed, /fly, /forcehatch y /opendaycare', wide: true },
      { text: 'Acceso al /kit luxury semanal' },
    ] as Feature[],
  },
  {
    id: 5,
    name: 'Master',
    monthlyPrice: 34.99,
    permanentPrice: 74.99,
    color: '#FFD93D',
    icon: <Crown size={28} />,
    description: 'El rango supremo. Todos los privilegios y máximo prestigio.',
    features: [
      { text: '15 Llaves Pokemon Random' },
      { text: '980 000 Dólares en el juego semanales' },
      { text: '100 caramelos raros semanales' },
      { text: 'Ahora puedes tener 5 /home set' },
      { text: '10% de descuento en casi todas las tiendas' },
      { text: 'Acceso a la tienda de raids Premium' },
      { text: 'Todoslos comandos de Luxury más /heal, /grindstone, /stonecutter, /cartography, /craft, /healpokemon y /repair', wide: true },
      { text: 'Acceso al /kit master semanal' },
    ] as Feature[],
  },
];

export default function Ranks() {
  const [duration, setDuration] = useState<Duration>('permanent');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { requirePlayer } = usePlayer();

  const activeRank = RANKS[activeIndex];
  const price = duration === 'monthly' ? activeRank.monthlyPrice : activeRank.permanentPrice;

  const navigate = (dir: -1 | 1) => {
    setDirection(dir);
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

          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              className="carousel-ring"
              custom={direction}
              initial={(d: number) => ({ x: d * 100, opacity: 0 })}
              animate={{ x: 0, opacity: 1 }}
              exit={(d: number) => ({ x: d * -100, opacity: 0 })}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {[-1, 0, 1].map((offset) => {
                const rankIndex = (activeIndex + offset + RANKS.length) % RANKS.length;
                const rank = RANKS[rankIndex];
                const isActive = offset === 0;
                return (
                  <motion.button
                    key={`slot-${offset}`}
                    className={`carousel-node ${isActive ? 'active' : ''}`}
                    style={{ '--node-color': rank.color } as React.CSSProperties}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.55,
                      scale: isActive ? 1.12 : 0.88,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={() => {
                      if (offset !== 0) {
                        setDirection(offset as -1 | 1);
                        setActiveIndex(rankIndex);
                      }
                    }}
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
            </motion.div>
          </AnimatePresence>

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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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
                  key={feature.text}
                  className={`rank-detail-feature${feature.wide ? ' rank-feature-wide' : ''}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut', delay: i * 0.025 }}
                >
                  <Check size={16} style={{ color: activeRank.color }} className="shrink-0" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <button
              className="rank-detail-buy"
              style={{
                background: `linear-gradient(135deg, ${activeRank.color}, ${activeRank.color}cc)`,
                color: '#000',
              }}
              onClick={() => requirePlayer()}
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
