import { Link } from 'react-router-dom';
import { SERVER_CONFIG, NAV_LINKS } from '../../config/constants';

const B = import.meta.env.BASE_URL;

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border-theme)] pt-16 pb-8 mt-auto transition-colors duration-300 pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="max-w-[1280px] mx-auto px-6 max-md:px-4">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-12 max-md:grid-cols-2 max-md:gap-8 max-sm:grid-cols-1">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[var(--footer-heading)] font-display text-[1.2rem] font-bold">
              <img src={`${B}images/resultado.svg`} alt="Cobble Quest" className="w-7 h-7 object-contain" />
              <span>{SERVER_CONFIG.name}</span>
            </div>
            <p className="text-[var(--footer-text)] text-[0.9rem] leading-relaxed">{SERVER_CONFIG.description}</p>
            <div>
              <code className="bg-primary/12 text-primary-light px-4 py-2 rounded-lg font-mono text-[0.9rem] border border-primary/20">{SERVER_CONFIG.ip}</code>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[var(--footer-heading)] text-[0.95rem] font-semibold mb-4">Navegación</h4>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[var(--footer-heading)] text-[0.95rem] font-semibold mb-4">Comunidad</h4>
            <div className="flex flex-col gap-2">
              <a href={SERVER_CONFIG.discord} target="_blank" rel="noopener noreferrer" className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-[#5865F2] transition-colors flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418z"/></svg>
                Discord
              </a>
              <a href="https://cobblemon.com" target="_blank" rel="noopener noreferrer" className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-[#e74c3c] transition-colors flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="var(--bg-base, #0a0a1a)"/></svg>
                Cobblemon Oficial
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[var(--footer-heading)] text-[0.95rem] font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Términos de Servicio</Link>
              <Link to="/privacy" className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Política de Privacidad</Link>
              <Link to="/refunds" className="text-[var(--footer-text)] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Reembolsos</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--footer-border)] text-center">
          <p className="text-[var(--footer-text)] text-[0.85rem]">
            © {new Date().getFullYear()} {SERVER_CONFIG.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-[0.75rem] text-[var(--footer-muted)]">
            {SERVER_CONFIG.name} no está afiliado con Mojang Studios, Microsoft, Nintendo, The
            Pokémon Company, ni Cobblemon.
          </p>
        </div>
      </div>
    </footer>
  );
}
