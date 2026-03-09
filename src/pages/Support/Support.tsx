import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { SERVER_CONFIG } from '../../config/constants';

export default function Support() {
  return (
    <div className="min-h-screen">
      <section className="pt-16 pb-8 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[1.75rem]">Soporte</h1>
            <p className="text-[var(--text-muted)] text-[1.05rem]">¿Necesitas ayuda? Estamos aquí para ti</p>
          </motion.div>
        </div>
      </section>

      <div className="section-container py-8 pb-16">
        <div className="grid grid-cols-3 gap-5 mb-12 max-md:grid-cols-1">
          <motion.a
            href={SERVER_CONFIG.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center text-center no-underline px-8 py-10 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-[20px] transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-[#5865F2] mb-4"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z"/></svg>
            <h3 className="text-[var(--text-primary)] text-[1.2rem] font-semibold mb-2">Discord</h3>
            <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed mb-4">Únete a nuestro Discord para soporte en tiempo real, reportes y más.</p>
            <span className="flex items-center gap-1.5 text-[#ef4444] text-[0.9rem] font-medium">
              Abrir Discord <ExternalLink size={14} />
            </span>
          </motion.a>
        </div>

        <div>
          <h2 className="font-display text-[1.5rem] font-bold text-[var(--text-primary)] mb-6">Preguntas Frecuentes</h2>

          <div className="flex flex-col gap-3">
            <div className="p-5 px-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl">
              <h4 className="text-[var(--text-primary)] text-base font-semibold mb-2">¿Cómo me uno al servidor?</h4>
              <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed">
                Abre Minecraft {SERVER_CONFIG.version}, ve a Multiplayer, agrega un servidor con la
                IP <code className="bg-primary/[0.12] text-[#ef4444] px-2 py-0.5 rounded font-mono text-[0.85rem]">{SERVER_CONFIG.ip}</code> y asegúrate de tener Cobblemon instalado.
              </p>
            </div>
            <div className="p-5 px-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl">
              <h4 className="text-[var(--text-primary)] text-base font-semibold mb-2">¿Cuánto tardan en activarse las compras?</h4>
              <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed">Las compras se activan instantáneamente después de que el pago sea confirmado.</p>
            </div>
            <div className="p-5 px-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl">
              <h4 className="text-[var(--text-primary)] text-base font-semibold mb-2">¿Puedo pedir un reembolso?</h4>
              <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed">
                Sí, aceptamos reembolsos dentro de las primeras 48 horas. Consulta nuestra política
                de reembolsos.
              </p>
            </div>
            <div className="p-5 px-6 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl">
              <h4 className="text-[var(--text-primary)] text-base font-semibold mb-2">¿Qué mods necesito?</h4>
              <p className="text-[var(--text-muted)] text-[0.9rem] leading-relaxed">
                Necesitas Cobblemon y sus dependencias (Fabric API o NeoForge). Recomendamos usar
                nuestro modpack oficial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
