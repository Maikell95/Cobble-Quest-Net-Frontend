import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, Calendar, Trophy, Gift, Star, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SERVER_CONFIG } from '../../config/constants';
import { useServerStatus } from '../../hooks/useServerStatus';

const events = [
  {
    icon: <Trophy size={28} />,
    title: 'Torneo Semanal PvP',
    date: 'Todos los sábados - 8:00 PM',
    description:
      'Compite contra los mejores entrenadores del servidor en batallas 6v6. Premios exclusivos para los 3 primeros lugares incluyendo shinies y objetos raros.',
    tag: 'Competitivo',
    tagColor: '#DC2626',
  },
  {
    icon: <Gift size={28} />,
    title: 'Caza de Shinies',
    date: 'Cada 2 semanas - Viernes',
    description:
      'Evento especial con tasas de aparición de shiny aumentadas x5. El primero en capturar un shiny legendario gana recompensas únicas.',
    tag: 'Evento Especial',
    tagColor: '#F59E0B',
  },
  {
    icon: <Star size={28} />,
    title: 'Safari Zone',
    date: 'Primer domingo del mes',
    description:
      'Accede a una zona exclusiva con Pokémon raros que no aparecen en ningún otro lugar del mapa. Pokéballs limitadas, ¡elige sabiamente!',
    tag: 'Mensual',
    tagColor: '#10B981',
  },
  {
    icon: <Calendar size={28} />,
    title: 'Raid Legendario',
    date: 'Miércoles y domingos - 9:00 PM',
    description:
      'Únete a otros entrenadores para enfrentar Pokémon legendarios en batallas raid cooperativas. Trabaja en equipo para capturarlos.',
    tag: 'Cooperativo',
    tagColor: '#6366F1',
  },
];

const B = import.meta.env.BASE_URL;
const regions = [
  { name: 'Bosque Esmeralda', image: `${B}images/regions/gallery_1.webp` },
  { name: 'Montaña Volcánica', image: `${B}images/regions/gallery_2.webp` },
  { name: 'Costa Cristalina', image: `${B}images/regions/gallery_3.webp` },
  { name: 'Pradera Dorada', image: `${B}images/regions/gallery_4.webp` },
  { name: 'Caverna Profunda', image: `${B}images/regions/gallery_5.webp` },
  { name: 'Isla Tropical', image: `${B}images/regions/gallery_6.webp` },
  { name: 'Ciudad Nocturna', image: `${B}images/regions/gallery_7.webp` },
  { name: 'Valle Nevado', image: `${B}images/regions/gallery_8.webp` },
];

const VIDEO_MAX_TIME = 235; // 3 minutes 55 seconds

export default function Home() {
  const [copied, setCopied] = useState(false);
  const serverStats = useServerStatus();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restore video position from session and save on unmount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saved = sessionStorage.getItem('hero-video-time');
    if (saved) {
      const t = parseFloat(saved);
      if (t > 0 && t < VIDEO_MAX_TIME) video.currentTime = t;
    }
    video.play().catch(() => {});

    const handleTimeUpdate = () => {
      if (video.currentTime >= VIDEO_MAX_TIME) {
        video.currentTime = 0;
        video.play();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      sessionStorage.setItem('hero-video-time', String(video.currentTime));
    };
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_CONFIG.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center p-8 max-md:p-5 max-md:pt-20 max-md:min-h-screen overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video ref={videoRef} className="absolute top-1/2 left-1/2 min-w-[120%] min-h-[120%] w-auto h-auto -translate-x-1/2 -translate-y-1/2 scale-[0.85] object-cover max-md:min-w-[180%] max-md:min-h-[180%] max-md:scale-[0.65]" autoPlay muted playsInline loop={false}>
            <source src={`${B}videos/trailer.mp4`} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-[1] [data-theme='light']_&:bg-white/30" />
          <div className="absolute inset-0 z-[2] animate-drift"
            style={{
              backgroundImage: `radial-gradient(1px 1px at 10% 20%, var(--text-muted) 50%, transparent 50%),
                radial-gradient(1px 1px at 30% 60%, var(--text-muted) 50%, transparent 50%),
                radial-gradient(1px 1px at 50% 40%, var(--text-muted) 50%, transparent 50%),
                radial-gradient(1px 1px at 70% 80%, var(--text-muted) 50%, transparent 50%),
                radial-gradient(1px 1px at 90% 30%, var(--text-muted) 50%, transparent 50%),
                radial-gradient(2px 2px at 20% 70%, rgba(220,38,38,0.3) 50%, transparent 50%),
                radial-gradient(2px 2px at 60% 20%, rgba(220,38,38,0.2) 50%, transparent 50%),
                radial-gradient(2px 2px at 80% 50%, rgba(239,68,68,0.2) 50%, transparent 50%)`
            }}
          />
          <div className="absolute inset-0 z-[2]"
            style={{
              background: `radial-gradient(ellipse at 50% 30%, rgba(220,38,38,0.12) 0%, transparent 60%),
                radial-gradient(ellipse at 80% 80%, rgba(220,38,38,0.06) 0%, transparent 50%),
                linear-gradient(180deg, transparent 0%, var(--bg-base) 100%)`
            }}
          />
        </div>

        <motion.div
          className="relative z-[3] text-center max-w-[720px] max-md:max-w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[0.85rem] text-[var(--text-secondary)] mb-6 max-md:text-[0.8rem] max-md:px-3.5 max-md:py-[0.35rem]">
            <span className={`w-2 h-2 rounded-full ${serverStats.serverStatus === 'online' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]' : ''}`} />
            {serverStats.serverStatus === 'online'
              ? `${serverStats.playersOnline} jugadores en línea`
              : 'Servidor en mantenimiento'}
          </div>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-[1.15] text-[var(--text-primary)] mb-5 max-md:text-[clamp(2rem,8vw,2.8rem)]">
            Tu aventura Pokémon
            <br />
            <span className="bg-gradient-to-br from-primary via-primary-light to-primary-dark bg-clip-text text-transparent">comienza aquí</span>
          </h1>

          <p className="text-[var(--text-secondary)] text-[1.1rem] leading-relaxed mb-8 max-w-[560px] mx-auto max-md:text-base max-md:px-2">{SERVER_CONFIG.description}</p>

          <div className="flex items-center justify-center gap-4 flex-wrap max-md:flex-col max-md:w-full">
            <button className="flex items-center gap-3 px-6 py-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] cursor-pointer transition-all duration-300 text-base hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-sm)] max-md:w-full max-md:justify-center" onClick={copyIP}>
              <code className="font-mono font-semibold text-primary">{SERVER_CONFIG.ip}</code>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <Link to="/store" className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white no-underline font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)] max-md:w-full max-md:justify-center">
              Visitar Tienda <ChevronRight size={18} />
            </Link>
          </div>

          <p className="mt-6 text-[var(--text-muted)] text-[0.85rem] max-md:text-[0.8rem]">
            Compatible con Minecraft {SERVER_CONFIG.version} - Cobblemon
          </p>
        </motion.div>
      </section>

      {/* ===== EVENTS SECTION ===== */}
      <section className="py-24 bg-[var(--bg-elevated)] transition-colors duration-300 max-md:py-16">
        <div className="section-container">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-[2.2rem] font-bold text-[var(--text-primary)] mb-3 max-md:text-[1.75rem]">
              <span className="text-gradient">Eventos</span> del Servidor
            </h2>
            <p className="text-[var(--text-muted)] text-[1.05rem] max-md:text-[0.95rem] max-md:px-2">Participa en eventos únicos con recompensas exclusivas cada semana</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className="bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-[18px] p-8 transition-all duration-300 flex flex-col hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(220,38,38,0.08)] max-md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-[52px] h-[52px] rounded-[14px] bg-primary/10 text-primary flex items-center justify-center">{event.icon}</div>
                  <span className="px-3 py-1 rounded-full text-[0.75rem] font-bold tracking-wide" style={{ background: `${event.tagColor}20`, color: event.tagColor }}>
                    {event.tag}
                  </span>
                </div>
                <h3 className="text-[var(--text-primary)] font-display text-[1.2rem] font-bold mb-1.5">{event.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-primary text-[0.82rem] font-semibold mb-3">
                  <Calendar size={14} />
                  {event.date}
                </span>
                <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REGIONS SECTION ===== */}
      <section className="py-24 pb-16 overflow-hidden max-md:py-16 max-md:pb-12">
        <div className="section-container">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-[2.2rem] font-bold text-[var(--text-primary)] mb-3 max-md:text-[1.75rem]">
              Explora las <span className="text-gradient">Regiones</span>
            </h2>
            <p className="text-[var(--text-muted)] text-[1.05rem] max-md:text-[0.95rem] max-md:px-2">Un mundo abierto lleno de biomas únicos con Pokémon exclusivos en cada zona</p>
          </motion.div>
        </div>

        <div className="relative mt-4 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-20 before:z-[2] before:pointer-events-none before:bg-gradient-to-r before:from-[var(--bg-base)] before:to-transparent after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-0 after:w-20 after:z-[2] after:pointer-events-none after:bg-gradient-to-l after:from-[var(--bg-base)] after:to-transparent max-md:before:w-10 max-md:after:w-10">
          <div className="overflow-hidden w-full group">
            <div className="flex gap-5 animate-scroll-regions w-max group-hover:[animation-play-state:paused]">
              {[...regions, ...regions].map((region, index) => (
                <div key={index} className="shrink-0 w-[340px] max-lg:w-[300px] max-md:w-[260px]">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-[var(--border-theme)] transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(220,38,38,0.1)] hover:scale-[1.02]">
                    <img src={region.image} alt={region.name} loading="lazy" className="w-full h-full object-cover block" />
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/75 to-transparent flex items-center gap-2 text-white text-[0.9rem] font-semibold">
                      <MapPin size={16} className="text-primary-light shrink-0" />
                      <span>{region.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 max-md:py-12">
        <div className="section-container">
          <motion.div
            className="text-center px-8 pb-16 pt-8 rounded-3xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/15 overflow-visible max-md:px-5 max-md:pb-10 max-md:rounded-[18px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={`${B}images/party_group.webp`}
              alt="Pokémon Party Group"
              className="w-[280px] max-w-[80%] h-auto mx-auto block relative z-[1] -translate-y-[40%] -mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
            />
            <h2 className="font-display text-[2rem] font-bold text-[var(--text-primary)] mb-3 max-md:text-[1.4rem]">¿Listo para comenzar tu aventura?</h2>
            <p className="text-[var(--text-secondary)] text-[1.05rem] mb-8 max-md:text-[0.95rem]">Únete a nuestro servidor y empieza a capturar, batallar y explorar hoy mismo.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/store" className="px-8 py-3 rounded-xl font-semibold no-underline transition-all duration-300 text-base bg-gradient-to-br from-primary to-primary-dark text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.35)]">
                Explorar Tienda
              </Link>
              <a
                href={SERVER_CONFIG.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-xl font-semibold no-underline transition-all duration-300 text-base bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              >
                Unirse al Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
