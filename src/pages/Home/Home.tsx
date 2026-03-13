import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Copy, Check, ChevronRight, Download, CalendarDays } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SERVER_CONFIG } from '../../config/constants';
import { useServerStatus } from '../../hooks/useServerStatus';
import type { ServerEvent, EventTag } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const EVENT_TAG_COLORS: Record<EventTag, string> = {
  pvp: '#ef4444',
  capture: '#22c55e',
  exploration: '#3b82f6',
  tournament: '#f59e0b',
  seasonal: '#a855f7',
  special: '#ec4899',
};

const EVENT_TAG_LABELS: Record<EventTag, string> = {
  pvp: 'PvP',
  capture: 'Captura',
  exploration: 'Exploración',
  tournament: 'Torneo',
  seasonal: 'Temporada',
  special: 'Especial',
};

const B = import.meta.env.BASE_URL;
const regions = [
  { image: `${B}images/regions/gallery_1.webp` },
  { image: `${B}images/regions/gallery_2.webp` },
  { image: `${B}images/regions/gallery_3.webp` },
  { image: `${B}images/regions/gallery_4.webp` },
  { image: `${B}images/regions/gallery_5.webp` },
  { image: `${B}images/regions/gallery_6.webp` },
  { image: `${B}images/regions/gallery_7.webp` },
  { image: `${B}images/regions/gallery_8.webp` },
];

const VIDEO_MAX_TIME = 235; // 3 minutes 55 seconds

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const serverStats = useServerStatus();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [events, setEvents] = useState<ServerEvent[]>([]);

  // Video time management
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saved = sessionStorage.getItem('hero-video-time');
    if (saved) {
      const t = parseFloat(saved);
      if (t > 0 && t < VIDEO_MAX_TIME) video.currentTime = t;
    }

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

  // Fetch active events
  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((d) => setEvents(d.data ?? []))
      .catch(() => {});
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText(SERVER_CONFIG.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center p-8 max-md:p-5 max-md:pt-24 max-md:min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-[1.15] max-md:scale-100" autoPlay muted playsInline loop={false}>
            <source src={`${B}videos/trailer.mp4`} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-[1]" />
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
            <span className={`w-2 h-2 rounded-full ${
              serverStats.serverStatus === 'online'
                ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                : serverStats.serverStatus === 'offline'
                ? 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                : 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            }`} />
            {serverStats.serverStatus === 'online'
              ? `${serverStats.playersOnline} jugadores en línea`
              : serverStats.serverStatus === 'checking'
              ? 'Conectando al servidor...'
              : 'Servidor offline'}
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
            <a
              href={SERVER_CONFIG.modpack}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1bd96a] text-white no-underline font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(27,217,106,0.35)] max-md:w-full max-md:justify-center"
            >
              <Download size={18} /> Descargar Mods
            </a>
          </div>

          <p className="mt-6 text-[var(--text-muted)] text-[0.85rem] max-md:text-[0.8rem]">
            Compatible con Minecraft {SERVER_CONFIG.version} - Cobblemon
          </p>
        </motion.div>
      </section>

      {/* ===== EVENTS SECTION ===== */}
      <section className="py-24 bg-[var(--bg-elevated)] transition-colors duration-300 max-md:py-14">
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

          {events.length === 0 ? (
            <motion.div
              className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={`${B}images/pokemon/gastly.webp`} alt="Gastly" className="w-24 h-24 mx-auto mb-4 opacity-30 grayscale" />
              <h3 className="text-[var(--text-secondary)] text-[1.2rem] font-semibold mb-2">Próximamente</h3>
              <p className="text-[var(--text-muted)] text-[0.95rem]">Los eventos del servidor se publicarán aquí pronto.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-3 gap-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {events.slice(0, 6).map((event, i) => (
                <motion.div
                  key={event.id}
                  className="group bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl overflow-hidden transition-all hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {/* Event image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--bg-surface)]">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <CalendarDays size={40} className="text-[var(--text-muted)] opacity-30" />
                      </div>
                    )}
                    {/* Tags overlay */}
                    {event.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[0.68rem] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm"
                            style={{
                              background: `${EVENT_TAG_COLORS[tag]}30`,
                              color: EVENT_TAG_COLORS[tag],
                            }}
                          >
                            {EVENT_TAG_LABELS[tag]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Event info */}
                  <div className="p-5">
                    <h3 className="text-[var(--text-primary)] text-[1.05rem] font-bold mb-1.5 line-clamp-1">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-[var(--text-muted)] text-[0.85rem] leading-relaxed mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    {(event.startDate || event.endDate) && (
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[0.78rem]">
                        <CalendarDays size={13} />
                        <span>
                          {formatEventDate(event.startDate)}
                          {event.endDate && ` — ${formatEventDate(event.endDate)}`}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
                    <img src={region.image} alt="Región del servidor" loading="lazy" className="w-full h-full object-cover block" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 max-md:py-12 max-md:px-0">
        <div className="section-container">
          <motion.div
            className="text-center px-8 pb-16 pt-8 rounded-3xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.03] border border-primary/15 overflow-visible max-md:px-5 max-md:pb-10 max-md:rounded-[18px] max-md:mx-0"
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
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold no-underline transition-all duration-300 text-base bg-[#5865F2] text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(88,101,242,0.35)]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z"/></svg>
                Unirse al Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
