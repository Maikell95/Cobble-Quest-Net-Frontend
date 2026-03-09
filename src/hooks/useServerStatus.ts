import { useState, useEffect } from 'react';
import type { ServerStats } from '../types';
import { SERVER_CONFIG } from '../config/constants';

export function useServerStatus() {
  const [stats, setStats] = useState<ServerStats>({
    playersOnline: 0,
    maxPlayers: 0,
    serverStatus: 'checking',
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`https://api.mcsrvstat.us/3/${SERVER_CONFIG.ip}`);
        const data = await res.json();
        if (data.online) {
          setStats({
            playersOnline: data.players?.online ?? 0,
            maxPlayers: data.players?.max ?? 0,
            serverStatus: 'online',
          });
        } else {
          setStats((prev) => ({ ...prev, serverStatus: 'offline' }));
        }
      } catch {
        setStats((prev) => ({ ...prev, serverStatus: 'offline' }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
