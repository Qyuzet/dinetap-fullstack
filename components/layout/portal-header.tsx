// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import {
  ShoppingCart,
  Store,
  User,
  Menu,
  X,
  Search,
  Home,
  MessageCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

// Mock data - in a real app, this would come from the database
const mockRestaurant = {
  id: "1",
  name: "Solaria Restaurant",
  description: "Indonesian cuisine restaurant with a modern twist",
  logo: "/logo.png",
  colors: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#DBEAFE",
  },
};

export function PortalHeader({ cart = [] }: { cart?: any[] }) {
  const params = useParams();
  const { id } = params;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [restaurant, setRestaurant] = useState(mockRestaurant);

  const routes = [
    { href: `/portal/${id}`, label: "Menu" },
    { href: `/portal/${id}/about`, label: "About" },
    { href: `/portal/${id}/contact`, label: "Contact" },
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b shadow-sm"
      style={{ backgroundColor: restaurant.colors.accent }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link
            href={`/portal/${id}`}
            className="mr-6 flex items-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-white p-1 shadow-sm">
                <Store
                  className="h-6 w-6"
                  style={{ color: restaurant.colors.primary }}
                />
              </div>
              <span className="text-xl font-bold">{restaurant.name}</span>
            </div>
          </Link>

          <nav className="hidden space-x-4 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/50 hover:text-blue-600"
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:bg-white/50"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 hover:bg-white/50"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-700 hover:bg-white/50"
                style={{ color: restaurant.colors.primary }}
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-center text-[10px] text-white"
                    style={{ backgroundColor: restaurant.colors.primary }}
                  >
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-lg font-semibold">Your Cart</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>

                {cart.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center">
                    <ShoppingCart className="mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-center text-gray-500">
                      Your cart is empty
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() =>
                        document
                          .querySelector("button[data-state='open']")
                          ?.click()
                      }
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-auto py-4">
                      {cart.map((item, index) => (
                        <div
                          key={index}
                          className="mb-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="mr-3 h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>
                            $
                            {cart
                              .reduce(
                                (total, item) =>
                                  total + item.price * item.quantity,
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span>$3.99</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>
                            $
                            {(
                              cart.reduce(
                                (total, item) =>
                                  total + item.price * item.quantity,
                                0
                              ) + 3.99
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                      >
                        Checkout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="hidden items-center text-gray-700 hover:bg-white/50 md:flex"
            >
              <Home className="mr-2 h-4 w-4" />
              OACF Home
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="border-t bg-white p-4">
          <div className="container mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search menu..." className="pl-10" autoFocus />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="container px-4 py-4">
            <ul className="space-y-4">
              {routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  OACF Home
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
