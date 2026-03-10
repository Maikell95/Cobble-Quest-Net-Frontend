import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Loader2, AlertCircle, Shield, ShieldOff } from 'lucide-react';
import { usePlayer } from '../../context/usePlayer';

export default function PlayerModal() {
  const { isModalOpen, closeModal, setPlayer, isLoading, error } = usePlayer();
  const [username, setUsername] = useState('');
  const [isPremium, setIsPremium] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    const ok = await setPlayer(trimmed, isPremium);
    if (ok) setUsername('');
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[420px] bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-theme)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-[var(--text-primary)] text-base font-bold m-0">Jugador de Minecraft</h3>
                  <p className="text-[var(--text-muted)] text-[0.78rem] m-0">Ingresa tu nombre para asignar las compras</p>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-lg bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center justify-center hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-all"
                onClick={closeModal}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: Notch"
                  maxLength={16}
                  autoFocus
                  className="w-full px-4 py-3 pl-12 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-primary)] text-[0.95rem] outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)] placeholder:text-[var(--text-muted)]"
                  disabled={isLoading}
                />
                <img
                  src={username.trim()
                    ? `https://mc-heads.net/avatar/${encodeURIComponent(username.trim())}/32`
                    : 'https://mc-heads.net/avatar/MHF_Steve/32'}
                  alt=""
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded"
                />
              </div>

              {/* Premium Toggle */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)]">
                <button
                  type="button"
                  onClick={() => setIsPremium(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[0.82rem] font-medium border-none cursor-pointer transition-all ${
                    isPremium
                      ? 'bg-[#22c55e]/15 text-[#22c55e]'
                      : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <Shield size={14} />
                  Premium
                </button>
                <button
                  type="button"
                  onClick={() => setIsPremium(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[0.82rem] font-medium border-none cursor-pointer transition-all ${
                    !isPremium
                      ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                      : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <ShieldOff size={14} />
                  No Premium
                </button>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  className="flex items-center gap-2 text-[#ff5252] text-[0.82rem] mb-4 p-3 rounded-lg bg-[rgba(255,82,82,0.08)]"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Info */}
              <p className="text-[var(--text-muted)] text-[0.78rem] mb-5 leading-relaxed">
                {isPremium
                  ? 'Verificaremos tu cuenta en los servidores de Mojang para confirmar que es una cuenta premium válida.'
                  : 'Solo validaremos el formato de tu nombre. Asegúrate de escribirlo exactamente como aparece en el servidor.'}
              </p>

              <button
                type="submit"
                disabled={isLoading || !username.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white border-none font-bold text-[0.95rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Confirmar Jugador'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
