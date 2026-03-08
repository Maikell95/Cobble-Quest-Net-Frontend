import { Link } from 'react-router-dom';
import { Gamepad2, ExternalLink } from 'lucide-react';
import { SERVER_CONFIG, NAV_LINKS } from '../../config/constants';

export default function Footer() {
  return (
    <footer className="bg-[var(--footer-bg)] border-t border-[var(--border-theme)] pt-16 pb-8 mt-auto transition-colors duration-300">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-12 max-md:grid-cols-2 max-md:gap-8 max-sm:grid-cols-1">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white font-display text-[1.2rem] font-bold">
              <Gamepad2 size={28} className="text-primary" />
              <span>{SERVER_CONFIG.name}</span>
            </div>
            <p className="text-[#999] text-[0.9rem] leading-relaxed">{SERVER_CONFIG.description}</p>
            <div>
              <code className="bg-primary/12 text-primary-light px-4 py-2 rounded-lg font-mono text-[0.9rem] border border-primary/20">{SERVER_CONFIG.ip}</code>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-[0.95rem] font-semibold mb-4">Navegación</h4>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white text-[0.95rem] font-semibold mb-4">Comunidad</h4>
            <div className="flex flex-col gap-2">
              <a href={SERVER_CONFIG.discord} target="_blank" rel="noopener noreferrer" className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">
                Discord <ExternalLink size={12} />
              </a>
              <a href="https://cobblemon.com" target="_blank" rel="noopener noreferrer" className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">
                Cobblemon Oficial <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-[0.95rem] font-semibold mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/terms" className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Términos de Servicio</Link>
              <Link to="/privacy" className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Política de Privacidad</Link>
              <Link to="/refunds" className="text-[#888] no-underline text-[0.9rem] hover:text-primary-light transition-colors flex items-center gap-1.5">Reembolsos</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] text-center">
          <p className="text-[#888] text-[0.85rem]">
            © {new Date().getFullYear()} {SERVER_CONFIG.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-[0.75rem] text-[#555]">
            {SERVER_CONFIG.name} no está afiliado con Mojang Studios, Microsoft, Nintendo, The
            Pokémon Company, ni Cobblemon.
          </p>
        </div>
      </div>
    </footer>
  );
}
