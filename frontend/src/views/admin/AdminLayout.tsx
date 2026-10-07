"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  FileText,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Quote Requests",
    path: "/admin/quotes",
    icon: FileText,
  },
];

function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/admin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${
          sidebarOpen ? "admin-sidebar-open" : ""
        }`}
      >

        {/* Logo */}
        <div className="admin-sidebar-logo">

          <div className="admin-logo-mark">
            R
          </div>

          <div className="admin-logo-text">
            <strong>Radhika</strong>
            <span>Copy House</span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="admin-navigation">

          <div className="admin-nav-title">
            MAIN MENU
          </div>

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={closeSidebar}
                className={`admin-nav-link ${
                  (
                    item.path === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.path ||
                        pathname.startsWith(`${item.path}/`)
                  )
                    ? "active"
                    : ""
                }`}
              >

                <Icon size={20} />

                <span>{item.label}</span>

                <ChevronRight
                  size={16}
                  className="admin-nav-arrow"
                />

              </Link>
            );
          })}

        </nav>

        {/* Bottom Profile */}
        <div className="admin-sidebar-bottom">

          <div className="admin-profile">

            <div className="admin-profile-avatar">
              <User size={20} />
            </div>

            <div className="admin-profile-info">
              <strong>
                {admin?.name || "Administrator"}
              </strong>

              <span>
                {admin?.email || "Admin"}
              </span>
            </div>

          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* Main Area */}
      <div className="admin-main">

        {/* Top Header */}
        <header className="admin-topbar">

          <button
            className="admin-mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="admin-breadcrumb">
            <span>Admin Panel</span>
          </div>

          <div className="admin-topbar-user">

            <div className="admin-topbar-avatar">
              <User size={18} />
            </div>

            <div>
              <strong>
                {admin?.name || "Administrator"}
              </strong>

              <span>Admin</span>
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="admin-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;