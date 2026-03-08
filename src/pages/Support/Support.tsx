import { motion } from 'framer-motion';
import { MessageCircle, ExternalLink } from 'lucide-react';
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
            <MessageCircle size={36} className="text-primary mb-4" />
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
