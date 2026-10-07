import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Clock3,
  IndianRupee,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

import {
  getProductStats,
  getQuoteRequests,
  getOrders,
  getOrderStats,
} from "../../services/api";

import type { AdminOrder } from "../../services/api";

function AdminDashboard() {
  const [totalProducts, setTotalProducts] =
    useState(0);

  const [totalQuotes, setTotalQuotes] =
    useState(0);

  const [pendingQuotes, setPendingQuotes] =
    useState(0);

  const [orderStats, setOrderStats] =
    useState({
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalOrderValue: 0,
    });

  const [recentOrders, setRecentOrders] =
    useState<AdminOrder[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard = async () => {
    try {
      setError("");

      const [
        productResponse,
        quoteResponse,
        orderResponse,
        statsResponse,
      ] = await Promise.all([
        getProductStats(),
        getQuoteRequests(),
        getOrders(),
        getOrderStats(),
      ]);

      setTotalProducts(
        productResponse.totalProducts
      );

      const quotes =
        quoteResponse.quotes || [];

      setTotalQuotes(quotes.length);

      setPendingQuotes(
        quotes.filter(
          (quote) =>
            quote.status === "pending"
        ).length
      );

      setRecentOrders(
        (orderResponse.orders || []).slice(0, 5)
      );

      setOrderStats(
        statsResponse.stats
      );
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const formatCurrency = (
    amount: number
  ) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getStatusClass = (
    status: string
  ) => {
    return `admin-order-status status-${status}`;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <RefreshCw
            size={20}
            className="spin"
          />

          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-dashboard-page">

      {/* HEADER */}

      <div className="admin-page-header">

        <div>
          <span className="admin-eyebrow">
            RADHIKA COPY HOUSE
          </span>

          <h1>Dashboard</h1>

          <p>
            Overview of your stationery
            business.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadDashboard}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="dashboard-stats-grid">

        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <Package size={21} />
          </div>

          <div>
            <span>Total Products</span>
            <strong>
              {totalProducts}
            </strong>
          </div>

          <Link href="/admin/products">
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <ShoppingBag size={21} />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>
              {orderStats.totalOrders}
            </strong>
          </div>

          <Link href="/admin/orders">
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Pending Orders</span>
            <strong>
              {orderStats.pendingOrders}
            </strong>
          </div>

          <Link href="/admin/orders">
            <ArrowRight size={16} />
          </Link>

        </div>


        <div className="dashboard-stat-card">

          <div className="dashboard-stat-icon">
            <IndianRupee size={21} />
          </div>

          <div>
            <span>Order Value</span>
            <strong>
              {formatCurrency(
                orderStats.totalOrderValue
              )}
            </strong>
          </div>

          <Link href="/admin/orders">
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>


      {/* SECONDARY STATS */}

      <div className="dashboard-secondary-grid">

        <div className="dashboard-mini-card">
          <span>Processing Orders</span>

          <strong>
            {orderStats.processingOrders}
          </strong>
        </div>

        <div className="dashboard-mini-card">
          <span>Shipped Orders</span>

          <strong>
            {orderStats.shippedOrders}
          </strong>
        </div>

        <div className="dashboard-mini-card">
          <span>Delivered Orders</span>

          <strong>
            {orderStats.deliveredOrders}
          </strong>
        </div>

        <div className="dashboard-mini-card">
          <span>Quote Requests</span>

          <strong>
            {totalQuotes}
          </strong>

          <small>
            {pendingQuotes} pending
          </small>
        </div>

      </div>


      {/* RECENT ORDERS */}

      <div className="dashboard-content-card">

        <div className="dashboard-card-header">

          <div>
            <h2>Recent Orders</h2>

            <p>
              Latest customer orders
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="dashboard-view-all"
          >
            View All
            <ArrowRight size={15} />
          </Link>

        </div>


        {recentOrders.length === 0 ? (

          <div className="dashboard-empty">
            <ShoppingBag size={35} />

            <h3>No orders yet</h3>

            <p>
              New customer orders will
              appear here.
            </p>
          </div>

        ) : (

          <div className="dashboard-orders-list">

            {recentOrders.map((order) => (

              <div
                className="dashboard-order-row"
                key={order._id}
              >

                <div className="dashboard-order-number">
                  <strong>
                    {order.orderNumber}
                  </strong>

                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>


                <div className="dashboard-order-customer">

                  <strong>
                    {order.customer.name}
                  </strong>

                  <span>
                    {order.customer.phone}
                  </span>

                </div>


                <div className="dashboard-order-units">

                  <Package size={14} />

                  {order.totalUnits} units

                </div>


                <div className="dashboard-order-amount">

                  <strong>
                    {formatCurrency(
                      order.subtotal
                    )}
                  </strong>

                </div>


                <span
                  className={getStatusClass(
                    order.status
                  )}
                >
                  {order.status}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;