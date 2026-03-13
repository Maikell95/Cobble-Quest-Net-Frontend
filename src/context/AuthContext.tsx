import { createContext, useState, useEffect, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export { AuthContext };

const TOKEN_KEY = 'cbq_admin_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount (page refresh), verify saved token and get a fresh one
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setIsLoading(false);
      return;
    }

    // Refresh the token so the 8h expiry resets on every page load
    fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${saved}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const newToken = data.data.token as string;
        sessionStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);

        // Decode username from the refreshed token
        return fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
      })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUsername(data.data.username);
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (user: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return data.message || 'Credenciales inválidas';
      }

      sessionStorage.setItem(TOKEN_KEY, data.data.token);
      setToken(data.data.token);
      setUsername(user);
      return null; // no error
    } catch {
      return 'Error de conexión con el servidor';
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
