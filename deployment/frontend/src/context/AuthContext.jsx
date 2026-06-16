import { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiRegister, apiMe } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // true setelah sesi awal dicek

  // Pulihkan sesi dari token tersimpan saat aplikasi dibuka.
  useEffect(() => {
    const token = localStorage.getItem("cm_token");
    if (!token) {
      setReady(true);
      return;
    }
    apiMe()
      .then(setUser)
      .catch(() => localStorage.removeItem("cm_token"))
      .finally(() => setReady(true));
  }, []);

  const persist = ({ token, user }) => {
    localStorage.setItem("cm_token", token);
    setUser(user);
  };

  const login = async (identifier, password) => {
    const data = await apiLogin({ identifier, password });
    persist(data);
    return data.user;
  };

  const register = async (name, username, email, password) => {
    const data = await apiRegister({ name, username, email, password });
    persist(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("cm_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
