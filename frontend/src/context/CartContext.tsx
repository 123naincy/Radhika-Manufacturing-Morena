"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (
    product: Product,
    quantity: number
  ) => void;

  removeFromCart: (
    productId: string
  ) => void;

  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  cartCount: number;

  cartTotal: number;
}

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("radhika_cart");

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch {
        setCartItems([]);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorage.setItem(
      "radhika_cart",
      JSON.stringify(cartItems)
    );
  }, [cartItems, hydrated]);

  // =========================
  // GET BULK PRICE
  // =========================

  const calculateUnitPrice = (
    product: Product,
    quantity: number
  ) => {

    const pricing =
      product.bulkPricing || [];

    let price =
      product.basePrice;

    for (const tier of pricing) {

      const minimum =
        tier.minQuantity;

      const maximum =
        tier.maxQuantity;

      if (
        quantity >= minimum &&
        (!maximum ||
          quantity <= maximum)
      ) {
        price = tier.price;
      }
    }

    return price;
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (
    product: Product,
    quantity: number
  ) => {

    if (
      quantity < product.moq
    ) {
      alert(
        `Minimum order quantity is ${product.moq}`
      );

      return;
    }

    setCartItems((currentItems) => {

      const existing =
        currentItems.find(
          (item) =>
            item.product._id ===
            product._id
        );

      const newQuantity =
        existing
          ? existing.quantity + quantity
          : quantity;

      const unitPrice =
        calculateUnitPrice(
          product,
          newQuantity
        );

      const totalPrice =
        unitPrice * newQuantity;

      if (existing) {

        return currentItems.map(
          (item) =>
            item.product._id ===
            product._id
              ? {
                  ...item,
                  quantity:
                    newQuantity,
                  unitPrice,
                  totalPrice,
                }
              : item
        );

      }

      return [
        ...currentItems,
        {
          product,
          quantity,
          unitPrice,
          totalPrice,
        },
      ];
    });
  };

  // =========================
  // UPDATE QUANTITY
  // =========================

  const updateQuantity = (
    productId: string,
    quantity: number
  ) => {

    setCartItems((currentItems) => {

      return currentItems.map(
        (item) => {

          if (
            item.product._id !==
            productId
          ) {
            return item;
          }

          const finalQuantity =
            Math.max(
              item.product.moq,
              quantity
            );

          const unitPrice =
            calculateUnitPrice(
              item.product,
              finalQuantity
            );

          return {
            ...item,
            quantity: finalQuantity,
            unitPrice,
            totalPrice:
              unitPrice *
              finalQuantity,
          };
        }
      );
    });
  };

  // =========================
  // REMOVE
  // =========================

  const removeFromCart = (
    productId: string
  ) => {

    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            item.product._id !==
            productId
        )
    );
  };

  // =========================
  // CLEAR
  // =========================

  const clearCart = () => {
    setCartItems([]);
  };

  // =========================
  // CART COUNT
  // =========================

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  // =========================
  // CART TOTAL
  // =========================

  const cartTotal =
    cartItems.reduce(
      (total, item) =>
        total + item.totalPrice,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================

export const useCart = () => {

  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};