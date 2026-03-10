import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ImagePlus,
  Tag,
  DollarSign,
  FileText,
  Layers,
  ChevronDown,
  LogOut,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { CURRENCY_SYMBOL } from '../../config/constants';
import { useAuth } from '../../context/useAuth';
import type { StoreItem, StoreCategory, ServerEvent, EventTag } from '../../types';

// ===== Constants =====
const STORE_CATEGORIES: { id: StoreCategory; label: string }[] = [
  { id: 'keys', label: 'Llaves' },
  { id: 'breeding', label: 'Crianza' },
  { id: 'battlepass', label: 'Pase de Batalla' },
  { id: 'extras', label: 'Extras' },
];

const EVENT_TAGS: { id: EventTag; label: string; color: string }[] = [
  { id: 'pvp', label: 'PvP', color: '#ef4444' },
  { id: 'capture', label: 'Captura', color: '#22c55e' },
  { id: 'exploration', label: 'Exploración', color: '#3b82f6' },
  { id: 'tournament', label: 'Torneo', color: '#f59e0b' },
  { id: 'seasonal', label: 'Temporada', color: '#a855f7' },
  { id: 'special', label: 'Especial', color: '#ec4899' },
];

type Tab = 'store' | 'events';

// ===== Login Screen =====
function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);
    const err = await login(username, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-[400px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-[0_8px_30px_rgba(220,38,38,0.3)]">
            <Lock size={28} className="text-white" />
          </div>
        </div>

        <h1 className="font-display text-[1.75rem] font-extrabold text-[var(--text-primary)] text-center mb-1">
          Panel Admin
        </h1>
        <p className="text-[var(--text-muted)] text-[0.92rem] text-center mb-8">
          Ingresa tus credenciales para acceder
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
              <User size={13} /> Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              autoComplete="username"
              className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
              <Lock size={13} /> Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-11 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="px-4 py-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#ef4444] text-[0.85rem] font-medium"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-[0.92rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Lock size={16} /> Iniciar Sesión
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ===== Empty defaults =====
const emptyStoreItem: Omit<StoreItem, 'id'> = {
  name: '',
  image: '',
  price: 0,
  category: 'keys',
  description: '',
  discount: undefined,
};

const emptyEvent: Omit<ServerEvent, 'id'> = {
  title: '',
  description: '',
  image: '',
  startDate: '',
  endDate: '',
  tags: [],
  active: true,
};

// ===== Main Admin Component =====
export default function Admin() {
  const { isAuthenticated, isLoading, username, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('store');

  // Store state
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemDraft, setItemDraft] = useState(emptyStoreItem);

  // Events state
  const [events, setEvents] = useState<ServerEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<ServerEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventDraft, setEventDraft] = useState(emptyEvent);

  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when any modal is open
  useEffect(() => {
    if (showItemForm || showEventForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showItemForm, showEventForm]);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!showCategoryDropdown) return;
    const handler = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showCategoryDropdown]);

  // Auth gate
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // ---- Store handlers ----
  const openNewItem = () => {
    setEditingItem(null);
    setItemDraft(emptyStoreItem);
    setShowItemForm(true);
  };

  const openEditItem = (item: StoreItem) => {
    setEditingItem(item);
    setItemDraft({ ...item });
    setShowItemForm(true);
  };

  const saveItem = () => {
    if (!itemDraft.name.trim()) return;
    if (editingItem) {
      setStoreItems((prev) =>
        prev.map((i) => (i.id === editingItem.id ? { ...itemDraft, id: editingItem.id } : i)),
      );
    } else {
      const newId = storeItems.length > 0 ? Math.max(...storeItems.map((i) => i.id)) + 1 : 1;
      setStoreItems((prev) => [...prev, { ...itemDraft, id: newId }]);
    }
    setShowItemForm(false);
    setEditingItem(null);
  };

  const deleteItem = (id: number) => {
    setStoreItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ---- Event handlers ----
  const openNewEvent = () => {
    setEditingEvent(null);
    setEventDraft(emptyEvent);
    setShowEventForm(true);
  };

  const openEditEvent = (event: ServerEvent) => {
    setEditingEvent(event);
    setEventDraft({ ...event });
    setShowEventForm(true);
  };

  const saveEvent = () => {
    if (!eventDraft.title.trim()) return;
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? { ...eventDraft, id: editingEvent.id } : e)),
      );
    } else {
      const newId = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      setEvents((prev) => [...prev, { ...eventDraft, id: newId }]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const deleteEvent = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleEventTag = (tag: EventTag) => {
    setEventDraft((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-4 text-center bg-gradient-to-b from-primary/[0.06] to-transparent relative z-[1]">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-[2.5rem] font-extrabold text-[var(--text-primary)] mb-2 max-sm:text-[1.75rem]">
              Panel Admin
            </h1>
            <p className="text-[var(--text-muted)] text-[1.05rem] mb-4">
              Gestiona la tienda y los eventos del servidor
            </p>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] text-[0.85rem] font-medium cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
              onClick={logout}
            >
              <LogOut size={15} /> {username}
            </button>
          </motion.div>
        </div>
      </section>

      <div className="section-container pt-4 pb-16">
        {/* Tab Selector */}
        <div className="flex gap-2 mb-8 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-[14px] p-[0.35rem] w-fit mx-auto max-sm:w-full">
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[0.9rem] font-medium cursor-pointer transition-all max-sm:flex-1 max-sm:justify-center max-sm:px-4 ${
              activeTab === 'store'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            onClick={() => setActiveTab('store')}
          >
            <ShoppingBag size={16} /> Tienda
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[10px] text-[0.9rem] font-medium cursor-pointer transition-all max-sm:flex-1 max-sm:justify-center max-sm:px-4 ${
              activeTab === 'events'
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <CalendarDays size={16} /> Eventos
          </button>
        </div>

        {/* ===== STORE TAB ===== */}
        {activeTab === 'store' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-[1.4rem] font-bold text-[var(--text-primary)]">
                Artículos ({storeItems.length})
              </h2>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-[0.9rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)]"
                onClick={openNewItem}
              >
                <Plus size={16} /> Nuevo Artículo
              </button>
            </div>

            {/* Items List */}
            {storeItems.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]">
                <ShoppingBag size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-40" />
                <h3 className="text-[var(--text-secondary)] text-[1.1rem] font-semibold mb-2">
                  Sin artículos
                </h3>
                <p className="text-[var(--text-muted)] text-[0.9rem] mb-4">
                  Agrega artículos a la tienda para que aparezcan en la página.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-[0.88rem] cursor-pointer border border-primary/20 transition-all hover:bg-primary/20"
                  onClick={openNewItem}
                >
                  <Plus size={15} /> Agregar primer artículo
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {storeItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl transition-colors hover:border-[var(--border-hover)] max-sm:flex-col max-sm:items-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Image preview */}
                    <div className="w-14 h-14 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-theme)] flex items-center justify-center overflow-hidden shrink-0 max-sm:w-12 max-sm:h-12">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <ImagePlus size={20} className="text-[var(--text-muted)] opacity-40" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="text-[var(--text-primary)] text-[0.95rem] font-semibold truncate">
                          {item.name}
                        </h3>
                        <span className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary capitalize">
                          {STORE_CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                        </span>
                      </div>
                      <p className="text-[var(--text-muted)] text-[0.82rem] truncate">{item.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-[var(--text-primary)] font-bold text-[1rem] font-mono shrink-0">
                      {CURRENCY_SYMBOL}{item.price.toFixed(2)}
                      {item.discount != null && item.discount > 0 && (
                        <span className="text-[0.72rem] font-semibold ml-1.5 px-1.5 py-0.5 rounded bg-[rgba(34,197,94,0.12)] text-[#22c55e]">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        className="p-2 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                        onClick={() => openEditItem(item)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== EVENTS TAB ===== */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-[1.4rem] font-bold text-[var(--text-primary)]">
                Eventos ({events.length})
              </h2>
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-[0.9rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)]"
                onClick={openNewEvent}
              >
                <Plus size={16} /> Nuevo Evento
              </button>
            </div>

            {/* Events List */}
            {events.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[var(--border-theme)] bg-[var(--bg-surface)]">
                <CalendarDays size={48} className="mx-auto mb-4 text-[var(--text-muted)] opacity-40" />
                <h3 className="text-[var(--text-secondary)] text-[1.1rem] font-semibold mb-2">
                  Sin eventos
                </h3>
                <p className="text-[var(--text-muted)] text-[0.9rem] mb-4">
                  Crea eventos para que aparezcan en la página principal.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-[0.88rem] cursor-pointer border border-primary/20 transition-all hover:bg-primary/20"
                  onClick={openNewEvent}
                >
                  <Plus size={15} /> Crear primer evento
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    className="flex items-center gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl transition-colors hover:border-[var(--border-hover)] max-sm:flex-col max-sm:items-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Image preview */}
                    <div className="w-14 h-14 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-theme)] flex items-center justify-center overflow-hidden shrink-0 max-sm:w-12 max-sm:h-12">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <CalendarDays size={20} className="text-[var(--text-muted)] opacity-40" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-[var(--text-primary)] text-[0.95rem] font-semibold truncate">
                          {event.title}
                        </h3>
                        <span
                          className={`text-[0.7rem] font-bold px-2 py-0.5 rounded-full ${
                            event.active
                              ? 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]'
                              : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'
                          }`}
                        >
                          {event.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {event.tags.map((tag) => {
                          const tagInfo = EVENT_TAGS.find((t) => t.id === tag);
                          return (
                            <span
                              key={tag}
                              className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-md"
                              style={{
                                background: `${tagInfo?.color || '#888'}18`,
                                color: tagInfo?.color || '#888',
                              }}
                            >
                              {tagInfo?.label || tag}
                            </span>
                          );
                        })}
                      </div>
                      {event.startDate && (
                        <p className="text-[var(--text-muted)] text-[0.78rem] mt-1">
                          {event.startDate} → {event.endDate || '...'}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        className="p-2 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                        onClick={() => openEditEvent(event)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="p-2 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[rgba(239,68,68,0.1)] hover:text-[#ef4444]"
                        onClick={() => deleteEvent(event.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ===== STORE ITEM MODAL ===== */}
      <AnimatePresence>
        {showItemForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowItemForm(false)}
          >
            <motion.div
              className="w-full max-w-[540px] max-h-[85vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-theme)]">
                <h3 className="font-display text-[1.15rem] font-bold text-[var(--text-primary)]">
                  {editingItem ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h3>
                <button
                  className="p-1.5 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  onClick={() => setShowItemForm(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <FileText size={13} /> Nombre
                  </label>
                  <input
                    type="text"
                    value={itemDraft.name}
                    onChange={(e) => setItemDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Nombre del artículo"
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <FileText size={13} /> Descripción
                  </label>
                  <textarea
                    value={itemDraft.description}
                    onChange={(e) => setItemDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Descripción del artículo"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 resize-none placeholder:text-[var(--text-muted)] font-[inherit]"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <ImagePlus size={13} /> URL de Imagen
                  </label>
                  <input
                    type="text"
                    value={itemDraft.image}
                    onChange={(e) => setItemDraft((d) => ({ ...d, image: e.target.value }))}
                    placeholder="/images/store/item.png"
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <Layers size={13} /> Categoría
                  </label>
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      className={`w-full flex items-center justify-between px-4 py-2.5 bg-[var(--bg-surface)] border rounded-xl text-[0.9rem] cursor-pointer transition-colors ${
                        showCategoryDropdown
                          ? 'border-primary/50 text-[var(--text-primary)]'
                          : 'border-[var(--border-theme)] text-[var(--text-primary)] hover:border-[var(--border-hover)]'
                      }`}
                      onClick={() => setShowCategoryDropdown((v) => !v)}
                    >
                      <span>{STORE_CATEGORIES.find((c) => c.id === itemDraft.category)?.label || 'Seleccionar'}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[var(--text-muted)] transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.div
                          className="absolute z-20 top-[calc(100%+6px)] left-0 right-0 bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-xl shadow-[var(--shadow-lg)] overflow-hidden"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {STORE_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[0.88rem] font-medium cursor-pointer transition-colors ${
                                itemDraft.category === cat.id
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]'
                              }`}
                              onClick={() => {
                                setItemDraft((d) => ({ ...d, category: cat.id }));
                                setShowCategoryDropdown(false);
                              }}
                            >
                              {cat.label}
                              {itemDraft.category === cat.id && (
                                <span className="ml-auto text-primary"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Price + Discount Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                      <DollarSign size={13} /> Precio ({CURRENCY_SYMBOL})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemDraft.price || ''}
                      onChange={(e) =>
                        setItemDraft((d) => ({ ...d, price: parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 font-mono placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                      <Tag size={13} /> Descuento (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={itemDraft.discount ?? ''}
                      onChange={(e) =>
                        setItemDraft((d) => ({
                          ...d,
                          discount: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        }))
                      }
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 font-mono placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-theme)]">
                <button
                  className="px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] text-[0.88rem] font-medium cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)]"
                  onClick={() => setShowItemForm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-[0.88rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  onClick={saveItem}
                  disabled={!itemDraft.name.trim()}
                >
                  <Save size={15} /> {editingItem ? 'Guardar Cambios' : 'Crear Artículo'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== EVENT MODAL ===== */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventForm(false)}
          >
            <motion.div
              className="w-full max-w-[540px] max-h-[85vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-theme)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-theme)]">
                <h3 className="font-display text-[1.15rem] font-bold text-[var(--text-primary)]">
                  {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
                </h3>
                <button
                  className="p-1.5 rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  onClick={() => setShowEventForm(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 flex flex-col gap-5">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <FileText size={13} /> Título
                  </label>
                  <input
                    type="text"
                    value={eventDraft.title}
                    onChange={(e) => setEventDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Nombre del evento"
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <FileText size={13} /> Descripción
                  </label>
                  <textarea
                    value={eventDraft.description}
                    onChange={(e) => setEventDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Describe el evento y sus recompensas"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 resize-none placeholder:text-[var(--text-muted)] font-[inherit]"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <ImagePlus size={13} /> URL de Imagen
                  </label>
                  <input
                    type="text"
                    value={eventDraft.image}
                    onChange={(e) => setEventDraft((d) => ({ ...d, image: e.target.value }))}
                    placeholder="/images/events/event.webp"
                    className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 placeholder:text-[var(--text-muted)]"
                  />
                </div>

                {/* Date Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                      <CalendarDays size={13} /> Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={eventDraft.startDate}
                      onChange={(e) => setEventDraft((d) => ({ ...d, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                      <CalendarDays size={13} /> Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={eventDraft.endDate}
                      onChange={(e) => setEventDraft((d) => ({ ...d, endDate: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl text-[var(--text-primary)] text-[0.9rem] outline-none transition-colors focus:border-primary/50 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[var(--text-secondary)] mb-2">
                    <Tag size={13} /> Etiquetas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EVENT_TAGS.map((tag) => {
                      const selected = eventDraft.tags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          className="px-3.5 py-1.5 rounded-lg text-[0.82rem] font-semibold cursor-pointer transition-all border"
                          style={{
                            background: selected ? `${tag.color}20` : 'var(--bg-surface)',
                            borderColor: selected ? `${tag.color}50` : 'var(--border-theme)',
                            color: selected ? tag.color : 'var(--text-secondary)',
                          }}
                          onClick={() => toggleEventTag(tag.id)}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-surface)] border border-[var(--border-theme)] rounded-xl">
                  <div>
                    <p className="text-[var(--text-primary)] text-[0.9rem] font-semibold">
                      Evento Activo
                    </p>
                    <p className="text-[var(--text-muted)] text-[0.78rem]">
                      Los eventos activos se muestran en la página principal
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                      eventDraft.active ? 'bg-[#22c55e]' : 'bg-[var(--bg-surface-hover)]'
                    }`}
                    onClick={() => setEventDraft((d) => ({ ...d, active: !d.active }))}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        eventDraft.active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border-theme)]">
                <button
                  className="px-5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-theme)] text-[var(--text-secondary)] text-[0.88rem] font-medium cursor-pointer transition-all hover:bg-[var(--bg-surface-hover)]"
                  onClick={() => setShowEventForm(false)}
                >
                  Cancelar
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white font-semibold text-[0.88rem] cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(220,38,38,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  onClick={saveEvent}
                  disabled={!eventDraft.title.trim()}
                >
                  <Save size={15} /> {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
