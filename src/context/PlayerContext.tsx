import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const STORAGE_KEY = 'cbq_player';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface PlayerData {
  username: string;
  uuid: string | null;
  avatar: string;
  premium: boolean;
}

interface PlayerContextType {
  player: PlayerData | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  openModal: () => void;
  closeModal: () => void;
  setPlayer: (username: string, premium: boolean) => Promise<boolean>;
  clearPlayer: () => void;
  requirePlayer: () => boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

function loadPlayer(): PlayerData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayerState] = useState<PlayerData | null>(loadPlayer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setError(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setError(null);
  }, []);

  const setPlayer = useCallback(async (username: string, premium: boolean): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/player/verify/${encodeURIComponent(username)}?premium=${premium}`,
      );
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setError(data.error || 'No se encontró ese jugador de Minecraft');
        return false;
      }

      const playerData: PlayerData = {
        username: data.username,
        uuid: data.uuid,
        avatar: data.avatar,
        premium: data.premium,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData));
      setPlayerState(playerData);
      setIsModalOpen(false);
      return true;
    } catch {
      setError('Error al verificar el jugador. Inténtalo de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearPlayer = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPlayerState(null);
  }, []);

  /** Returns true if player is already set, otherwise opens modal and returns false */
  const requirePlayer = useCallback((): boolean => {
    if (player) return true;
    openModal();
    return false;
  }, [player, openModal]);

  return (
    <PlayerContext.Provider
      value={{ player, isModalOpen, isLoading, error, openModal, closeModal, setPlayer, clearPlayer, requirePlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
