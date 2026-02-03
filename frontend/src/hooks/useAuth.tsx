import React, { createContext, useContext, useEffect, useState } from "react";
import * as AuthService from "@/lib/services/auth";

interface AuthContextValue {
  token: string | null;
  role: string | null;
  userId: number | null;
  userName: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  register: (payload: { name: string; email: string; password: string; role: any; mobile?: string }) => Promise<any>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("userRole"));
  const [userId, setUserId] = useState<number | null>(() => {
    const v = localStorage.getItem("userId");
    return v ? Number(v) : null;
  });
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem("userName"));

  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("userRole"));
      const v = localStorage.getItem("userId");
      setUserId(v ? Number(v) : null);
      setUserName(localStorage.getItem("userName"));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // If the user is already signed in (token + userId) but userName is missing, load it
  useEffect(() => {
    const loadUserName = async () => {
      if (!userName && userId) {
        try {
          const user = await AuthService.getUserById(userId);
          if (user && user.name) {
            localStorage.setItem("userName", user.name);
            setUserName(user.name);
          }
        } catch (e) {
          // ignore
        }
      }
    };
    loadUserName();
  }, [userId, userName]);

  const signIn = async (email: string, password: string) => {
    const resp = await AuthService.signIn(email, password);
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("userRole"));
    setUserId(localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null);
    setUserName(localStorage.getItem("userName"));
    return resp;
  };

  const register = async (payload: { name: string; email: string; password: string; role: any; mobile?: string }) => {
    return AuthService.register(payload);
  };

  const signOut = () => {
    AuthService.signOut();
    setToken(null);
    setRole(null);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, userName, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
