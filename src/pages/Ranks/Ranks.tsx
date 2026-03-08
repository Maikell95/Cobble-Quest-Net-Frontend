import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Zap, Gem, Shield, Sparkles } from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../config/constants';

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

  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-8 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[1.75rem]">Rangos</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">Elige tu rango y desbloquea ventajas exclusivas en el servidor</p>
          </motion.div>
        </div>
      </section>

      <div className="section-container pt-8 pb-16">
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

        <div className="grid grid-cols-5 gap-5 items-start max-[1280px]:grid-cols-3 max-[900px]:grid-cols-2 max-sm:grid-cols-1 max-sm:gap-4">
          {RANKS.map((rank, index) => {
            const price = duration === 'monthly' ? rank.monthlyPrice : rank.permanentPrice;
            return (
              <motion.div
                key={rank.id}
                className={`relative bg-[var(--bg-card)] border rounded-[20px] p-8 px-6 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${
                  rank.popular
                    ? 'border-[rgba(85,153,255,0.4)] shadow-[0_0_30px_rgba(85,153,255,0.06)]'
                    : 'border-[var(--border-theme)]'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {rank.popular && (
                  <div className="absolute -top-3 flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-br from-[#5599ff] to-[#3377ee] text-white text-[0.78rem] font-bold">
                    <Sparkles size={14} /> Más Popular
                  </div>
                )}

                <div
                  className="w-[60px] h-[60px] rounded-2xl flex items-center justify-center mb-4"
                  style={{ color: rank.color, background: `${rank.color}15` }}
                >
                  {rank.icon}
                </div>

                <h3 className="font-display text-[1.4rem] font-bold mb-2" style={{ color: rank.color }}>
                  {rank.name}
                </h3>
                <p className="text-[var(--text-muted)] text-[0.88rem] leading-relaxed mb-6">{rank.description}</p>

                <div className="flex items-baseline gap-0.5 mb-6">
                  <span className="text-[var(--text-secondary)] text-[1.2rem] font-semibold">{CURRENCY_SYMBOL}</span>
                  <span className="text-[var(--text-primary)] text-[2.5rem] font-extrabold leading-none">{price.toFixed(2)}</span>
                  <span className="text-[var(--text-muted)] text-[0.82rem] ml-1">/ {duration === 'monthly' ? 'mes' : 'permanente'}</span>
                </div>

                <div className="w-full flex flex-col gap-2.5 mb-6 text-left">
                  {rank.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[var(--text-secondary)] text-[0.88rem]">
                      <Check size={16} className="shrink-0" style={{ color: rank.color }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full py-3.5 rounded-xl font-bold text-[0.95rem] cursor-pointer transition-all duration-300 mt-auto hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
                  style={{
                    background: rank.popular
                      ? `linear-gradient(135deg, ${rank.color}, ${rank.color}cc)`
                      : 'rgba(255, 255, 255, 0.06)',
                    color: rank.popular ? '#000' : rank.color,
                    border: rank.popular ? 'none' : `1px solid ${rank.color}33`,
                  }}
                >
                  Comprar {rank.name}
                </button>
              </motion.div>
            );
          })}
        </div>

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
