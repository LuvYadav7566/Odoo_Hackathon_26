import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("traveloop_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("traveloop_token");
    if (!token) return;
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("traveloop_user", JSON.stringify(res.data.user));
      })
      .catch(() => logout());
  }, []);

  const persist = (payload) => {
    localStorage.removeItem("traveloop_active_trip");
    localStorage.removeItem("traveloop_active_trip_cache");
    localStorage.removeItem("traveloop_trips_cache");
    localStorage.setItem("traveloop_token", payload.token);
    localStorage.setItem("traveloop_user", JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      persist(res.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", data);
      persist(res.data);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("traveloop_token");
    localStorage.removeItem("traveloop_user");
    localStorage.removeItem("traveloop_active_trip");
    localStorage.removeItem("traveloop_active_trip_cache");
    localStorage.removeItem("traveloop_trips_cache");
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, signup, logout, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
