import { useState, useEffect } from 'react';
import type { ServerStats } from '../types';

export function useServerStatus() {
  const [stats, setStats] = useState<ServerStats>({
    playersOnline: 0,
    maxPlayers: 100,
    serverStatus: 'online',
  });

  useEffect(() => {
    // TODO: Connect to real Minecraft server status API
    // For now, simulate server status
    const simulateStatus = () => {
      setStats({
        playersOnline: Math.floor(Math.random() * 80) + 10,
        maxPlayers: 100,
        serverStatus: 'online',
      });
    };

    simulateStatus();
    const interval = setInterval(simulateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return stats;
}
