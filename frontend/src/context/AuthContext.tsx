"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentAdmin,
  loginAdmin,
} from "../services/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

interface AuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [admin, setAdmin] =
    useState<AdminUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem(
      "radhika_admin_token"
    );

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response =
        await getCurrentAdmin();

      setAdmin(response.admin);

      localStorage.setItem(
        "radhika_admin",
        JSON.stringify(
          response.admin
        )
      );
    } catch (error) {
      console.error(
        "Admin authentication failed:",
        error
      );

      localStorage.removeItem(
        "radhika_admin_token"
      );

      localStorage.removeItem(
        "radhika_admin"
      );

      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const response =
      await loginAdmin({
        email,
        password,
      });

    localStorage.setItem(
      "radhika_admin_token",
      response.token
    );

    localStorage.setItem(
      "radhika_admin",
      JSON.stringify(
        response.admin
      )
    );

    setAdmin(response.admin);
  };

  const logout = () => {
    localStorage.removeItem(
      "radhika_admin_token"
    );

    localStorage.removeItem(
      "radhika_admin"
    );

    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated:
          !!admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};