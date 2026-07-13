"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Product } from "@/types/database";

export interface CartItemType {
  id: string; // uuid for DB items, random string for local items
  product_id: string;
  quantity: number;
  size: string | null;
  product?: Product;
}

interface CartContextType {
  items: CartItemType[];
  loading: boolean;
  cartId: string | null;
  addToCart: (product: Product, quantity: number, size: string | null) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);
  const supabase = createClient();

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Logged-in user: get from DB
        let { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!cart) {
          const { data: newCart } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select("id")
            .single();
          cart = newCart;
        }

        if (cart) {
          setCartId(cart.id);
          const { data: cartItems } = await supabase
            .from("cart_items")
            .select("*, product:products(*, categories(*))")
            .eq("cart_id", cart.id)
            .order("created_at", { ascending: true });

          if (cartItems) {
            setItems(cartItems.map((item) => ({
              id: item.id,
              product_id: item.product_id,
              quantity: item.quantity,
              size: item.size,
              product: item.product,
            })));
          }
        }
      } else {
        // Guest user: get from localStorage
        const localCart = localStorage.getItem("yarsha_cart");
        if (localCart) {
          try {
            setItems(JSON.parse(localCart));
          } catch (e) {
            console.error("Failed to parse local cart", e);
          }
        }
      }
      setLoading(false);
    };

    loadCart();

    // Listen for auth changes to sync cart
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          loadCart(); // Might want to merge local storage to DB here in a real app
        } else if (event === "SIGNED_OUT") {
          setCartId(null);
          setItems([]); // Or load from local storage
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Save to localStorage whenever items change if not logged in
  useEffect(() => {
    if (!loading && !cartId) {
      localStorage.setItem("yarsha_cart", JSON.stringify(items));
    }
  }, [items, loading, cartId]);

  const addToCart = async (product: Product, quantity: number, size: string | null) => {
    if (cartId) {
      // DB
      const existingItem = items.find(
        (item) => item.product_id === product.id && item.size === size
      );

      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: newQty })
          .eq("id", existingItem.id)
          .select("*, product:products(*, categories(*))")
          .single();

        if (!error && data) {
          setItems(items.map((i) => (i.id === existingItem.id ? {
            id: data.id,
            product_id: data.product_id,
            quantity: data.quantity,
            size: data.size,
            product: data.product
          } : i)));
        }
      } else {
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            cart_id: cartId,
            product_id: product.id,
            quantity,
            size,
          })
          .select("*, product:products(*, categories(*))")
          .single();

        if (!error && data) {
          setItems([...items, {
            id: data.id,
            product_id: data.product_id,
            quantity: data.quantity,
            size: data.size,
            product: data.product
          }]);
        }
      }
    } else {
      // LocalStorage
      const existingItemIndex = items.findIndex(
        (item) => item.product_id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
        setItems(newItems);
      } else {
        const newItem: CartItemType = {
          id: Math.random().toString(36).substr(2, 9), // Fake ID
          product_id: product.id,
          quantity,
          size,
          product,
        };
        setItems([...items, newItem]);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);

    if (cartId) {
      // DB
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id);
      if (!error) {
        setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
      }
    } else {
      // LocalStorage
      setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    }
  };

  const removeFromCart = async (id: string) => {
    if (cartId) {
      // DB
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (!error) {
        setItems(items.filter((i) => i.id !== id));
      }
    } else {
      // LocalStorage
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const clearCart = async () => {
    if (cartId) {
      await supabase.from("cart_items").delete().eq("cart_id", cartId);
    }
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, loading, cartId, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
