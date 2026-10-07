import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  X,
  CheckCircle2,
  Clock3,
  Truck,
  ShoppingBag,
} from "lucide-react";

import {
  getOrders,
  updateOrderStatus,
} from "../../services/api";

import type { AdminOrder } from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const response = await getOrders();

      setOrders(response.orders || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        order.orderNumber.toLowerCase().includes(searchText) ||
        order.customer.name.toLowerCase().includes(searchText) ||
        order.customer.phone.toLowerCase().includes(searchText) ||
        order.customer.email.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (
    order: AdminOrder,
    status: AdminOrder["status"]
  ) => {
    try {
      setUpdatingStatus(true);

      await updateOrderStatus(order._id, status);

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : null
      );
    } catch (err: any) {
      alert(err.message || "Failed to update order");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status: AdminOrder["status"]) => {
    return `admin-order-status status-${status}`;
  };

  const getPaymentClass = (
    status: AdminOrder["paymentStatus"]
  ) => {
    return `admin-payment-status payment-${status}`;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <RefreshCw className="spin" size={22} />
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page orders-admin-page">

      {/* HEADER */}

      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            RADHIKA COPY HOUSE
          </span>

          <h1>Orders</h1>

          <p>
            Manage customer orders and track order status.
          </p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      {/* STATS */}

      <div className="orders-stats-grid">

        <div className="orders-stat-card">
          <div className="orders-stat-icon">
            <ShoppingBag size={20} />
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div className="orders-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {
                orders.filter(
                  (order) => order.status === "pending"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div className="orders-stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Processing</span>
            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status === "processing"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-stat-card">
          <div className="orders-stat-icon">
            <Truck size={20} />
          </div>

          <div>
            <span>Shipped</span>
            <strong>
              {
                orders.filter(
                  (order) =>
                    order.status === "shipped"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="orders-toolbar">

        <div className="orders-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search order, customer, phone or email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="orders-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

      </div>

      {/* TABLE */}

      <div className="admin-table-card">

        <div className="admin-table-header">
          <div>
            <h2>Order List</h2>
            <span>
              {filteredOrders.length} orders found
            </span>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <Package size={40} />

            <h3>No orders found</h3>

            <p>
              Orders placed by customers will appear here.
            </p>
          </div>
        ) : (
          <div className="admin-table-scroll">

            <table className="admin-orders-table">

              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.map((order) => (
                  <tr key={order._id}>

                    <td>
                      <div className="order-number">
                        {order.orderNumber}
                      </div>

                      <small>
                        {order.totalUnits} units
                      </small>
                    </td>

                    <td>
                      <div className="order-customer">
                        <strong>
                          {order.customer.name}
                        </strong>

                        {order.customer.company && (
                          <span>
                            {order.customer.company}
                          </span>
                        )}

                        <small>
                          {order.customer.phone}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="order-products-count">
                        <Package size={15} />
                        {order.items.length} product
                        {order.items.length !== 1
                          ? "s"
                          : ""}
                      </div>
                    </td>

                    <td>
                      <strong>
                        ₹
                        {order.subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={getPaymentClass(
                          order.paymentStatus
                        )}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          order.status
                        )}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <div className="order-date">
                        <strong>
                          {formatDate(order.createdAt)}
                        </strong>

                        <small>
                          {formatTime(order.createdAt)}
                        </small>
                      </div>
                    </td>

                    <td>
                      <button
                        className="order-view-btn"
                        onClick={() =>
                          setSelectedOrder(order)
                        }
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ORDER DRAWER */}

      {selectedOrder && (
        <div
          className="order-drawer-overlay"
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            className="order-drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="order-drawer-header">

              <div>
                <span>ORDER</span>

                <h2>
                  {selectedOrder.orderNumber}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            {/* STATUS */}

            <div className="order-detail-status">

              <div>
                <span>Order Status</span>

                <strong
                  className={getStatusClass(
                    selectedOrder.status
                  )}
                >
                  {selectedOrder.status}
                </strong>
              </div>

              <select
                value={selectedOrder.status}
                disabled={updatingStatus}
                onChange={(e) =>
                  handleStatusChange(
                    selectedOrder,
                    e.target.value as AdminOrder["status"]
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="processing">
                  Processing
                </option>

                <option value="shipped">
                  Shipped
                </option>

                <option value="delivered">
                  Delivered
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            {/* CUSTOMER */}

            <div className="order-detail-section">

              <h3>
                <User size={17} />
                Customer Information
              </h3>

              <div className="order-info-grid">

                <div>
                  <span>Name</span>
                  <strong>
                    {selectedOrder.customer.name}
                  </strong>
                </div>

                {selectedOrder.customer.company && (
                  <div>
                    <span>Company</span>
                    <strong>
                      {selectedOrder.customer.company}
                    </strong>
                  </div>
                )}

                <div>
                  <span>Phone</span>
                  <strong>
                    {selectedOrder.customer.phone}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {selectedOrder.customer.email}
                  </strong>
                </div>

                {selectedOrder.customer.gstNumber && (
                  <div>
                    <span>GST Number</span>
                    <strong>
                      {selectedOrder.customer.gstNumber}
                    </strong>
                  </div>
                )}

              </div>

              <div className="order-contact-actions">

                <a
                  href={`tel:${selectedOrder.customer.phone}`}
                >
                  <Phone size={15} />
                  Call
                </a>

                <a
                  href={`mailto:${selectedOrder.customer.email}`}
                >
                  <Mail size={15} />
                  Email
                </a>

              </div>

            </div>

            {/* SHIPPING */}

            <div className="order-detail-section">

              <h3>
                <MapPin size={17} />
                Delivery Address
              </h3>

              <div className="order-address">

                <strong>
                  {selectedOrder.shippingAddress.address}
                </strong>

                <span>
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state}
                </span>

                <span>
                  PIN -{" "}
                  {selectedOrder.shippingAddress.pincode}
                </span>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="order-detail-section">

              <h3>
                <Package size={17} />
                Ordered Products
              </h3>

              <div className="order-items-list">

                {selectedOrder.items.map(
                  (item, index) => (
                    <div
                      className="order-detail-item"
                      key={`${item.productId}-${index}`}
                    >

                      <div className="order-item-main">

                        <strong>
                          {item.productName}
                        </strong>

                        <span>
                          SKU: {item.sku}
                        </span>

                      </div>

                      <div className="order-item-qty">
                        × {item.quantity}
                      </div>

                      <div className="order-item-price">

                        <span>
                          ₹{item.unitPrice} / unit
                        </span>

                        <strong>
                          ₹
                          {item.totalPrice.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* PAYMENT */}

            <div className="order-payment-box">

              <div>
                <span>Payment Method</span>

                <strong>
                  {selectedOrder.paymentMethod}
                </strong>
              </div>

              <div>
                <span>Payment Status</span>

                <strong>
                  {selectedOrder.paymentStatus}
                </strong>
              </div>

              <div>
                <span>Total Units</span>

                <strong>
                  {selectedOrder.totalUnits}
                </strong>
              </div>

              <div className="order-grand-total">

                <span>Order Total</span>

                <strong>
                  ₹
                  {selectedOrder.subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

            {/* NOTES */}

            {selectedOrder.notes && (
              <div className="order-detail-section">

                <h3>
                  Additional Notes
                </h3>

                <p className="order-notes">
                  {selectedOrder.notes}
                </p>

              </div>
            )}

            {/* TIMELINE */}

            <div className="order-detail-section">

              <h3>
                <CheckCircle2 size={17} />
                Order Timeline
              </h3>

              <div className="order-timeline">

                <div className="timeline-item active">
                  <span></span>

                  <div>
                    <strong>
                      Order Placed
                    </strong>

                    <small>
                      {formatDate(
                        selectedOrder.createdAt
                      )}{" "}
                      ·{" "}
                      {formatTime(
                        selectedOrder.createdAt
                      )}
                    </small>
                  </div>
                </div>

                {selectedOrder.status !==
                  "pending" &&
                  selectedOrder.status !==
                    "cancelled" && (
                    <div className="timeline-item active">
                      <span></span>

                      <div>
                        <strong>
                          {selectedOrder.status}
                        </strong>

                        <small>
                          Current order status
                        </small>
                      </div>
                    </div>
                  )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Orders;