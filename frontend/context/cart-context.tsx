// @ts-nocheck
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
import { useToast } from "@/hooks/use-toast";

export type CartItem = {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity: number,
    specialInstructions?: string
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSpecialInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }

    // Calculate totals
    const count = items.reduce((total, item) => total + item.quantity, 0);
    setItemCount(count);

    const total = items.reduce(
      (sum, item) => sum + item.item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [items]);

  const addToCart = (
    item: MenuItem,
    quantity: number,
    specialInstructions?: string
  ) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        if (specialInstructions) {
          newItems[existingItemIndex].specialInstructions = specialInstructions;
        }

        toast({
          title: "Item updated",
          description: `${item.name} quantity updated in your cart`,
        });

        return newItems;
      } else {
        // Add new item
        toast({
          title: "Added to cart",
          description: `${quantity}x ${item.name} added to your cart`,
        });

        return [...currentItems, { item, quantity, specialInstructions }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.item.id === itemId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.item.name} removed from your cart`,
        });
      }
      return currentItems.filter((item) => item.item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const updateSpecialInstructions = (itemId: string, instructions: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.item.id === itemId
          ? { ...item, specialInstructions: instructions }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSpecialInstructions,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  // Check if we're running on the server
  const isServer = typeof window === "undefined";

  if (context === undefined) {
    // If on server, return a dummy context instead of throwing
    if (isServer) {
      return {
        items: [],
        addToCart: () => {},
        removeFromCart: () => {},
        updateQuantity: () => {},
        updateSpecialInstructions: () => {},
        clearCart: () => {},
        itemCount: 0,
        subtotal: 0,
      } as CartContextType;
    }

    // Only throw in client-side rendering
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
