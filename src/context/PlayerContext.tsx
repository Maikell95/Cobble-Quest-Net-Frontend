import { createContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

const STORAGE_KEY = 'cbq_player';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface PlayerData {
  username: string;
  uuid: string | null;
  avatar: string;
  premium: boolean;
  online: boolean;
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
  /** Ensures a player is selected. Opens modal if not. Returns true if player exists. */
  requireWhitelistedPlayer: () => Promise<boolean>;
  /** Start polling online status (call when modal opens). Returns stop function. */
  startPollingOnlineStatus: () => () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export { PlayerContext };

function loadPlayer(): PlayerData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlayerData>;
    if (!parsed.username || !parsed.avatar || typeof parsed.premium !== 'boolean') {
      return null;
    }

    return {
      username: parsed.username,
      uuid: parsed.uuid ?? null,
      avatar: parsed.avatar,
      premium: parsed.premium,
      online: parsed.online ?? false,
    };
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
        online: data.online ?? false,
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

  /** Ensures a player is selected before proceeding (store/cart/ranks). */
  const requireWhitelistedPlayer = useCallback(async (): Promise<boolean> => {
    if (!player) {
      openModal();
      return false;
    }
    return true;
  }, [player, openModal]);

  const pollingRef = useRef(false);

  const startPollingOnlineStatus = useCallback((): (() => void) => {
    pollingRef.current = true;

    const poll = async () => {
      if (!pollingRef.current) return;
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as PlayerData | null;
      if (!current) return;
      try {
        const res = await fetch(`${API_URL}/api/player/online`);
        if (!res.ok) return;
        const data = await res.json();
        const players: string[] = data.summary?.uniquePlayers || [];
        const online = players.some(p => p.toLowerCase() === current.username.toLowerCase());
        if (online !== current.online) {
          const updated = { ...current, online };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          setPlayerState(updated);
        }
      } catch {
        // silently ignore network errors
      }
    };

    poll();
    const id = setInterval(poll, 15000);
    return () => {
      pollingRef.current = false;
      clearInterval(id);
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{ player, isModalOpen, isLoading, error, openModal, closeModal, setPlayer, clearPlayer, requirePlayer, requireWhitelistedPlayer, startPollingOnlineStatus }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
