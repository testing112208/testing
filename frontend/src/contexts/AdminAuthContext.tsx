'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiRequest } from "@/lib/api-client";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  adminEmail: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    const e = localStorage.getItem("admin_email");
    if (t) {
      setToken(t);
      setAdminEmail(e);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiRequest<{ success: boolean; token: string; admin?: { role: string } }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (data.success && data.token) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_email", email);
        localStorage.setItem("admin_role", data.admin?.role || "Operator");
        setToken(data.token);
        setAdminEmail(email);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_role");
    setToken(null);
    setAdminEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, token, login, logout, adminEmail }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
