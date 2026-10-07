import type { Product } from "../types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/* =========================================================
   ADMIN AUTH HEADER
========================================================= */

const getAdminHeaders = () => {
  const token = localStorage.getItem(
    "radhika_admin_token"
  );

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};


/* =========================================================
   PRODUCTS
========================================================= */

interface ProductsResponse {
  success: boolean;
  products: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ProductResponse {
  success: boolean;
  product: Product;
}

interface BulkPriceResponse {
  success: boolean;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  data?: {
    unitPrice?: number;
    totalPrice?: number;
  };
}

export const getProducts =
  async (): Promise<ProductsResponse> => {
    const response = await fetch(
      `${API_URL}/products?limit=100`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch products"
      );
    }

    return response.json();
  };


export const getProductById =
  async (
    id: string
  ): Promise<ProductResponse> => {
    const response = await fetch(
      `${API_URL}/products/${id}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch product"
      );
    }

    return response.json();
  };


export const getBulkPrice =
  async (
    id: string,
    quantity: number
  ): Promise<BulkPriceResponse> => {
    const response = await fetch(
      `${API_URL}/products/${id}/bulk-price?quantity=${quantity}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to calculate bulk price"
      );
    }

    return response.json();
  };


export const getProductStats = async (): Promise<{
  success: boolean;
  totalProducts: number;
}> => {
  const response = await fetch(
    `${API_URL}/products/stats/count`,
    {
      headers: getAdminHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch product stats"
    );
  }

  return result;
};


export const createProduct = async (
  data: any
) => {
  const response = await fetch(
    `${API_URL}/products`,
    {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create product"
    );
  }

  return result;
};


export const updateProduct = async (
  id: string,
  data: any
) => {
  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update product"
    );
  }

  return result;
};


export const deleteProduct = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: "DELETE",
      headers: getAdminHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete product"
    );
  }

  return result;
};


/* =========================================================
   CATEGORIES
========================================================= */

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}


export const getCategories = async (): Promise<{
  success: boolean;
  categories: Category[];
}> => {
  const response = await fetch(
    `${API_URL}/categories`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch categories"
    );
  }

  return response.json();
};


export const createCategory = async (
  data: {
    name: string;
    slug: string;
    description?: string;
  }
) => {
  const response = await fetch(
    `${API_URL}/categories`,
    {
      method: "POST",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to create category"
    );
  }

  return result;
};


export const updateCategory = async (
  id: string,
  data: {
    name: string;
    slug: string;
    description?: string;
    isActive?: boolean;
  }
) => {
  const response = await fetch(
    `${API_URL}/categories/${id}`,
    {
      method: "PUT",
      headers: getAdminHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update category"
    );
  }

  return result;
};


export const deleteCategory = async (
  id: string
) => {
  const response = await fetch(
    `${API_URL}/categories/${id}`,
    {
      method: "DELETE",
      headers: getAdminHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to delete category"
    );
  }

  return result;
};


/* =========================================================
   QUOTES
========================================================= */

export interface QuoteProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


export interface QuoteRequestData {
  name: string;
  company?: string;
  phone: string;
  email: string;
  gstNumber?: string;
  city?: string;
  message?: string;
  products: QuoteProduct[];
  totalUnits: number;
  estimatedTotal: number;
  enquiryType?: "cart" | "contact" | "wholesale";
}


export interface QuoteRequest {
  _id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  gstNumber?: string;
  city?: string;

  products: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];

  totalUnits: number;
  estimatedTotal: number;
  enquiryType?: "cart" | "contact" | "wholesale";

  status:
    | "pending"
    | "contacted"
    | "quoted"
    | "completed";

  createdAt: string;
  updatedAt: string;
}


export const submitQuoteRequest =
  async (
    data: QuoteRequestData
  ) => {
    const response = await fetch(
      `${API_URL}/quotes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to submit quote request"
      );
    }

    return result;
  };


export const getQuoteRequests =
  async (): Promise<{
    success: boolean;
    quotes: QuoteRequest[];
  }> => {
    const response = await fetch(
      `${API_URL}/quotes`,
      {
        headers: getAdminHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch quote requests"
      );
    }

    return result;
  };


export const updateQuoteStatus =
  async (
    id: string,
    status: QuoteRequest["status"]
  ) => {
    const response = await fetch(
      `${API_URL}/quotes/${id}/status`,
      {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          status,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to update status"
      );
    }

    return result;
  };


/* =========================================================
   ORDERS
========================================================= */

export interface OrderItemData {
  productId: string;
  quantity: number;
}


export interface CreateOrderData {
  customer: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    gstNumber?: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  items: OrderItemData[];

  paymentMethod:
    | "cod"
    | "online"
    | "pending";

  notes?: string;
}


export const createOrder = async (
  data: CreateOrderData
) => {
  const response = await fetch(
    `${API_URL}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to place order"
    );
  }

  return result;
};


export interface AdminOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


export interface AdminOrder {
  _id: string;
  orderNumber: string;

  customer: {
    name: string;
    company?: string;
    phone: string;
    email: string;
    gstNumber?: string;
  };

  shippingAddress: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  items: AdminOrderItem[];

  totalUnits: number;
  subtotal: number;

  paymentMethod:
    | "cod"
    | "online"
    | "pending";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  notes?: string;

  createdAt: string;
  updatedAt: string;
}


export interface OrdersResponse {
  success: boolean;
  orders: AdminOrder[];
}


export const getOrders =
  async (): Promise<OrdersResponse> => {
    const response = await fetch(
      `${API_URL}/orders`,
      {
        headers: getAdminHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch orders"
      );
    }

    return result;
  };


export const getOrderById =
  async (
    id: string
  ): Promise<{
    success: boolean;
    order: AdminOrder;
  }> => {
    const response = await fetch(
      `${API_URL}/orders/${id}`,
      {
        headers: getAdminHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch order"
      );
    }

    return result;
  };


export const updateOrderStatus =
  async (
    id: string,
    status: AdminOrder["status"]
  ) => {
    const response = await fetch(
      `${API_URL}/orders/${id}/status`,
      {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          status,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to update order status"
      );
    }

    return result;
  };


/* =========================================================
   ORDER STATS
========================================================= */

export interface OrderStatsResponse {
  success: boolean;

  stats: {
    totalOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    totalOrderValue: number;
  };
}


export const getOrderStats =
  async (): Promise<OrderStatsResponse> => {
    const response = await fetch(
      `${API_URL}/orders/stats`,
      {
        headers: getAdminHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Failed to fetch order stats"
      );
    }

    return result;
  };


/* =========================================================
   ADMIN LOGIN
========================================================= */

export interface AdminLoginData {
  email: string;
  password: string;
}


export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;

  admin: {
    id: string;
    name: string;
    email: string;
    role: "admin";
  };
}


export const loginAdmin =
  async (
    data: AdminLoginData
  ): Promise<AdminLoginResponse> => {
    const response = await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Login failed"
      );
    }

    return result;
  };

  export const getCurrentAdmin =
  async (): Promise<{
    success: boolean;
    admin: {
      id: string;
      name: string;
      email: string;
      role: "admin";
    };
  }> => {
    const response = await fetch(
      `${API_URL}/auth/me`,
      {
        headers: getAdminHeaders(),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
          "Authentication failed"
      );
    }

    return result;
  };