import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { NAV_LINKS, SERVER_CONFIG } from '../../config/constants';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useServerStatus } from '../../hooks/useServerStatus';
import PeekPokemon from '../ui/PeekPokemon';

const B = import.meta.env.BASE_URL;
const NAV_POKEMON: Record<string, string> = {
  '/': `${B}images/pokemon/pikachu.webp`,
  '/store': `${B}images/pokemon/gholdengo.webp`,
  '/ranks': `${B}images/pokemon/mewtwo.webp`,
  '/wiki': `${B}images/pokemon/slowking.webp`,
  '/support': `${B}images/pokemon/blissey.webp`,
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const serverStats = useServerStatus();
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-[var(--navbar-bg)] backdrop-blur-[20px] border-b border-[var(--border-theme)] transition-colors duration-300 pt-[env(safe-area-inset-top)]">
      <div className="max-w-[1280px] mx-auto px-6 h-[70px] flex items-center justify-between max-md:px-4 max-md:h-[60px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline text-[var(--text-primary)] hover:opacity-85 transition-opacity">
          <img src={`${B}images/cobblequest.svg`} alt="Cobble Quest Network" className="w-9 h-9 rounded-lg object-contain" />
          <span className="font-display text-[1.4rem] font-bold text-[var(--text-primary)] max-[480px]:text-[1.15rem]">{SERVER_CONFIG.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex gap-1 max-md:hidden">
          {NAV_LINKS.map((link) => (
            <PeekPokemon key={link.path} corner="top-right" size={30} sprite={NAV_POKEMON[link.path]}>
              <Link
                to={link.path}
                className={`no-underline text-[0.95rem] font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                {link.label}
              </Link>
            </PeekPokemon>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 max-[480px]:gap-2">
          {/* Server Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-theme)]">
            <span className={`w-2 h-2 rounded-full animate-pulse-status ${
              serverStats.serverStatus === 'online'
                ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                : serverStats.serverStatus === 'offline'
                ? 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.5)] !animate-none'
                : 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            }`} />
            <span className="text-[var(--text-secondary)] text-[0.85rem] font-medium max-md:hidden">
              {serverStats.serverStatus === 'checking'
                ? '...'
                : `${serverStats.playersOnline}/${serverStats.maxPlayers}`}
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:border-[var(--border-hover)] transition-all duration-200 max-[480px]:w-[34px] max-[480px]:h-[34px] overflow-hidden"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            <img
              src={`${B}images/icons/${theme === 'dark' ? 'solgaleo' : 'lunala'}.svg`}
              alt={theme === 'dark' ? 'Solgaleo' : 'Lunala'}
              className="w-[22px] h-[22px] object-contain transition-transform duration-300 hover:scale-115 max-[480px]:w-[18px] max-[480px]:h-[18px]"
            />
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[0.7rem] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Toggle */}
          <button className="hidden max-md:flex items-center justify-center bg-transparent border-none text-[var(--text-secondary)] cursor-pointer w-10 h-10 rounded-lg active:bg-[var(--bg-surface-hover)]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay + Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-[60px] bg-black/40 z-[-1] md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/* Menu */}
            <motion.div
              ref={menuRef}
              className="flex flex-col px-6 pb-5 pt-2 gap-0.5 bg-[var(--navbar-bg)] border-b border-[var(--border-theme)] md:hidden"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.04 }}
                >
                  <Link
                    to={link.path}
                    className={`block no-underline text-base px-4 py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                      location.pathname === link.path
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-[var(--text-secondary)] active:bg-[var(--bg-surface-hover)]'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
