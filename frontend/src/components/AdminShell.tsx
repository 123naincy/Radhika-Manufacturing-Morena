"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../views/admin/AdminLayout";

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isAuthenticated && !isLogin) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLogin, loading, router]);

  if (isLogin) {
    return children;
  }

  if (loading || !isAuthenticated) {
    return (
      <div className="admin-auth-loading">
        <div className="admin-login-spinner" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
