// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShoppingCart,
  Store,
  Search,
  Menu,
  User,
  ChevronRight,
  Plus,
  Minus,
  X,
  Loader2,
  CreditCard,
  ChefHat,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import type { Portal, MenuItem } from "@/models/Portal";
import { OrderItem, PaymentMethod } from "@/models/Order";
import { getPortalData } from "./page-server";
import { createOrder, getOrderById } from "@/app/actions/client-actions";
import { useToast } from "@/components/ui/use-toast";
import { ChatAssistant } from "@/components/portal/chat-assistant";

// Default restaurant data (will be replaced with real data)
const defaultRestaurant = {
  id: "",
  name: "Restaurant",
  description: "Loading restaurant information...",
  logo: "/logo.png",
  colors: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#DBEAFE",
  },
  userId: "",
  createdAt: new Date(),
  status: "active" as const,
};

// Default menu items (will be replaced with real data)
const defaultMenuItems: MenuItem[] = [];

// Categories will be dynamically generated from menu items

export default function PortalPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState<Portal>(defaultRestaurant);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [filteredItems, setFilteredItems] =
    useState<MenuItem[]>(defaultMenuItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemDetails, setShowItemDetails] = useState(false);

  // Fetch portal and menu data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portal data using the server component
        const { portal, menuItems: items } = await getPortalData(id as string);
        if (portal) {
          setRestaurant(portal);
          setMenuItems(items);
          setFilteredItems(items);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(items.map((item) => item.category)),
          ].sort();
          setCategories(["All", ...uniqueCategories]);
        } else {
          // Portal not found, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // Filter menu items based on category and search query
  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    // Don't add if item is not available
    if (item.available === false) {
      toast({
        title: "Item Unavailable",
        description: "Sorry, this item is currently not available.",
        variant: "destructive",
      });
      return;
    }

    // Find existing item by menuItemId
    const existingItem = cart.find(
      (cartItem) => cartItem.menuItemId === item.id
    );

    if (existingItem) {
      // Create a new cart array with the updated item
      const updatedCart = cart.map((cartItem) =>
        cartItem.menuItemId === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      // Update the cart state
      setCart(updatedCart);

      // Show success toast
      toast({
        title: "Item Updated",
        description: `Added another ${item.name} to your cart.`,
      });
    } else {
      // Convert MenuItem to OrderItem with a stable ID based on the menu item ID
      const orderItem: OrderItem = {
        id: `item_${item.id}`, // Use the menu item ID instead of Date.now()
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
      };

      // Update the cart state with the new item
      const updatedCart = [...cart, orderItem];
      setCart(updatedCart);

      // Show success toast
      toast({
        title: "Item Added",
        description: `Added ${item.name} to your cart.`,
      });
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find((item) => item.id === itemId);

    if (!existingItem) return;

    if (existingItem.quantity > 1) {
      // Decrease quantity
      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCart(updatedCart);
    } else {
      // Remove item completely
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);

      // Show toast notification
      toast({
        title: "Item Removed",
        description: `Removed ${existingItem.name} from your cart.`,
      });
    }
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <h1 className="text-xl font-medium">Loading restaurant portal...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header
        className="sticky top-0 z-10 backdrop-blur-md"
        style={{
          backgroundColor: `${restaurant.colors?.accent || "#DBEAFE"}CC`,
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center">
            <div
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full p-2 shadow-md transition-transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${
                  restaurant.colors?.primary || "#3B82F6"
                }, ${restaurant.colors?.secondary || "#1E40AF"})`,
              }}
            >
              <Store className="h-7 w-7 text-white" />
            </div>
            <div className="ml-3">
              <span className="text-2xl font-bold tracking-tight">
                {restaurant.name}
              </span>
              <div className="text-xs text-gray-500">Digital Menu</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="relative overflow-hidden rounded-full border-2 transition-all duration-300 hover:shadow-md"
                  style={{
                    borderColor: restaurant.colors?.primary || "#3B82F6",
                    color: restaurant.colors?.primary || "#3B82F6",
                  }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2 font-medium">Cart</span>
                  {cart.length > 0 && (
                    <Badge
                      className="absolute -right-1 -top-1 h-6 w-6 rounded-full p-0 text-center text-xs font-bold text-white shadow-sm"
                      style={{
                        backgroundColor:
                          restaurant.colors?.primary || "#3B82F6",
                      }}
                    >
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                className="w-full sm:max-w-md p-0 h-[100vh] max-h-screen"
                side="right"
              >
                <div className="flex h-full flex-col">
                  <div className="sticky top-0 z-20 bg-white p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2
                        className="text-2xl font-bold tracking-tight"
                        style={{
                          color: restaurant.colors?.primary || "#3B82F6",
                        }}
                      >
                        Your Cart
                      </h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-2 text-gray-500 hover:text-gray-700 transition-colors"
                        style={{
                          borderColor: `${
                            restaurant.colors?.primary || "#3B82F6"
                          }30`,
                        }}
                        onClick={() => setCart([])}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear Cart
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-center mb-6">
                        <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-500">
                          Your cart is empty
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add items to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          Cart Items
                        </h3>
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="mb-3 flex items-start justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
                          >
                            <div className="flex items-start">
                              <div
                                className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm"
                                style={{
                                  boxShadow: `0 0 0 2px ${
                                    restaurant.colors?.primary || "#3B82F6"
                                  }20`,
                                }}
                              >
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="pt-1">
                                <h3 className="font-bold text-gray-800">
                                  {item.name}
                                </h3>
                                <p
                                  className="mt-1 text-sm font-semibold"
                                  style={{
                                    color:
                                      restaurant.colors?.primary || "#3B82F6",
                                  }}
                                >
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-2 transition-colors"
                                style={{
                                  borderColor: `${
                                    restaurant.colors?.primary || "#3B82F6"
                                  }30`,
                                  color:
                                    restaurant.colors?.primary || "#3B82F6",
                                }}
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center font-bold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-2 transition-colors"
                                style={{
                                  borderColor: `${
                                    restaurant.colors?.primary || "#3B82F6"
                                  }30`,
                                  color:
                                    restaurant.colors?.primary || "#3B82F6",
                                }}
                                onClick={() => {
                                  const menuItem = menuItems.find(
                                    (mi) => mi.id === item.menuItemId
                                  );
                                  if (menuItem) {
                                    addToCart(menuItem);
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="mt-auto space-y-3 px-4 py-4 border-t">
                      <div
                        className="space-y-3 rounded-xl p-4 shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, white, ${
                            restaurant.colors?.accent || "#DBEAFE"
                          }40)`,
                          borderLeft: `3px solid ${
                            restaurant.colors?.primary || "#3B82F6"
                          }`,
                        }}
                      >
                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                          Order Summary
                        </h3>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ${cartTotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span className="font-medium">$3.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">
                            ${(cartTotal * 0.1).toFixed(2)}
                          </span>
                        </div>
                        <Separator
                          className="my-3"
                          style={{
                            backgroundColor: `${
                              restaurant.colors?.primary || "#3B82F6"
                            }30`,
                            height: "2px",
                          }}
                        />
                        <div className="flex justify-between font-bold text-xl">
                          <span>Total</span>
                          <span
                            style={{
                              color: restaurant.colors?.primary || "#3B82F6",
                            }}
                          >
                            ${(cartTotal + 3.99 + cartTotal * 0.1).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full rounded-xl py-4 text-lg font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${
                            restaurant.colors?.primary || "#3B82F6"
                          }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                          color: "white",
                        }}
                        onClick={() => {
                          // Open the checkout sheet
                          document.getElementById("checkout-trigger")?.click();
                        }}
                      >
                        Proceed to Checkout
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div
          className="mb-10 rounded-2xl bg-white p-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, white, ${
              restaurant.colors?.accent || "#DBEAFE"
            }50)`,
            borderLeft: `4px solid ${restaurant.colors?.primary || "#3B82F6"}`,
          }}
        >
          <h1
            className="mb-2 text-4xl font-bold tracking-tight"
            style={{ color: restaurant.colors?.primary || "#3B82F6" }}
          >
            Welcome to {restaurant.name}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="mt-6 relative max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search our menu..."
              className="pl-10 h-12 rounded-full border-2 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                borderColor: `${restaurant.colors?.primary || "#3B82F6"}50`,
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-8 overflow-x-auto py-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Categories
          </h2>
          <div className="flex space-x-3">
            {categories.length > 0 &&
              categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="lg"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 transition-all duration-300 ${
                    selectedCategory === category
                      ? "shadow-md transform -translate-y-1"
                      : "hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                  style={
                    selectedCategory === category
                      ? {
                          background: `linear-gradient(135deg, ${
                            restaurant.colors?.primary || "#3B82F6"
                          }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                          color: "white",
                        }
                      : {
                          borderColor: `${
                            restaurant.colors?.primary || "#3B82F6"
                          }80`,
                          color: restaurant.colors?.primary || "#3B82F6",
                        }
                  }
                >
                  {category}
                </Button>
              ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length === 0 ? (
            <div className="col-span-full flex h-60 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-lg font-medium text-gray-500">
                  No menu items found
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Try a different search or category
                </p>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`group overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
                  item.available === false ? "opacity-60" : ""
                }`}
                style={{
                  border: "none",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                }}
                onClick={() => {
                  if (item.available !== false) {
                    // Show item details in a dialog
                    setSelectedItem(item);
                    setShowItemDetails(true);
                  } else {
                    toast({
                      title: "Item Unavailable",
                      description:
                        "Sorry, this item is currently not available.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                  {item.available === false && (
                    <div className="absolute left-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg bg-red-500">
                      <div className="flex items-center">
                        <X className="mr-1 h-3.5 w-3.5" />
                        Unavailable
                      </div>
                    </div>
                  )}
                  {item.tags.includes("popular") && (
                    <div
                      className="absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${
                          restaurant.colors?.primary || "#3B82F6"
                        }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                      }}
                    >
                      <div className="flex items-center">
                        <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                        Popular
                      </div>
                    </div>
                  )}
                  <div
                    className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold backdrop-blur-sm"
                    style={{ color: restaurant.colors?.primary || "#3B82F6" }}
                  >
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <CardHeader className="pb-2 pt-5">
                  <CardTitle className="text-xl font-bold">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="mt-1.5 line-clamp-2 text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-2">
                    {item.tags
                      .filter((tag) => tag !== "popular")
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full text-xs font-medium transition-colors"
                          style={{
                            borderColor: `${
                              restaurant.colors?.primary || "#3B82F6"
                            }40`,
                            color: restaurant.colors?.primary || "#3B82F6",
                            backgroundColor: `${
                              restaurant.colors?.primary || "#3B82F6"
                            }10`,
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
                <CardFooter className="pb-5 pt-2">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1.5 h-4 w-4" />
                      Ready in 15-20 min
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        addToCart(item);
                      }}
                      className="rounded-full px-5 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{
                        background:
                          item.available === false
                            ? "#9CA3AF"
                            : `linear-gradient(135deg, ${
                                restaurant.colors?.primary || "#3B82F6"
                              }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                        color: "white",
                      }}
                      disabled={item.available === false}
                    >
                      {item.available === false ? "Unavailable" : "Add to Cart"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Cart Summary (Fixed at bottom) */}
        {cart.length > 0 && (
          <div
            id="cart-summary"
            className="fixed bottom-0 left-0 right-0 backdrop-blur-md p-4 shadow-xl z-10"
            style={{
              backgroundColor: `${restaurant.colors?.accent || "#DBEAFE"}CC`,
              borderTop: `1px solid ${
                restaurant.colors?.primary || "#3B82F6"
              }20`,
            }}
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-4 flex h-14 w-14 items-center justify-center rounded-full shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${
                        restaurant.colors?.primary || "#3B82F6"
                      }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                    }}
                  >
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items in cart
                    </span>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: restaurant.colors?.primary || "#3B82F6" }}
                    >
                      ${cartTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      id="checkout-trigger"
                      className="rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(135deg, ${
                          restaurant.colors?.primary || "#3B82F6"
                        }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                        color: "white",
                      }}
                    >
                      Checkout
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    className="w-full sm:max-w-md p-0 h-[100vh] max-h-screen"
                    side="right"
                  >
                    <div className="flex h-full flex-col">
                      <div className="sticky top-0 z-20 bg-white p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h2
                            className="text-2xl font-bold tracking-tight"
                            style={{
                              color: restaurant.colors?.primary || "#3B82F6",
                            }}
                          >
                            Your Order
                          </h2>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-2 text-gray-500 hover:text-gray-700 transition-colors"
                            style={{
                              borderColor: `${
                                restaurant.colors?.primary || "#3B82F6"
                              }30`,
                            }}
                            onClick={() => setCart([])}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Clear Cart
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-40 text-center mb-6">
                            <ShoppingCart className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-500">
                              Your cart is empty
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              Add items to get started
                            </p>
                          </div>
                        ) : (
                          <div className="mb-6 space-y-3">
                            <h3 className="text-xl font-bold text-gray-800">
                              Cart Items
                            </h3>
                            {cart.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start justify-between rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-md"
                              >
                                <div className="flex items-start">
                                  <div
                                    className="mr-3 h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm"
                                    style={{
                                      boxShadow: `0 0 0 2px ${
                                        restaurant.colors?.primary || "#3B82F6"
                                      }20`,
                                    }}
                                  >
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="pt-1">
                                    <h3 className="font-bold text-gray-800">
                                      {item.name}
                                    </h3>
                                    <p
                                      className="mt-1 text-sm font-semibold"
                                      style={{
                                        color:
                                          restaurant.colors?.primary ||
                                          "#3B82F6",
                                      }}
                                    >
                                      ${item.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-2 transition-colors"
                                    style={{
                                      borderColor: `${
                                        restaurant.colors?.primary || "#3B82F6"
                                      }30`,
                                      color:
                                        restaurant.colors?.primary || "#3B82F6",
                                    }}
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center font-bold">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-full border-2 transition-colors"
                                    style={{
                                      borderColor: `${
                                        restaurant.colors?.primary || "#3B82F6"
                                      }30`,
                                      color:
                                        restaurant.colors?.primary || "#3B82F6",
                                    }}
                                    onClick={() => {
                                      const menuItem = menuItems.find(
                                        (mi) => mi.id === item.menuItemId
                                      );
                                      if (menuItem) {
                                        addToCart(menuItem);
                                      }
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div
                          className="space-y-3 rounded-xl p-4 shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, white, ${
                              restaurant.colors?.accent || "#DBEAFE"
                            }40)`,
                            borderLeft: `3px solid ${
                              restaurant.colors?.primary || "#3B82F6"
                            }`,
                          }}
                        >
                          <h3 className="font-bold text-gray-800 text-lg mb-2">
                            Order Summary
                          </h3>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              ${cartTotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Delivery Fee</span>
                            <span className="font-medium">$3.99</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">
                              ${(cartTotal * 0.1).toFixed(2)}
                            </span>
                          </div>
                          <Separator
                            className="my-3"
                            style={{
                              backgroundColor: `${
                                restaurant.colors?.primary || "#3B82F6"
                              }30`,
                              height: "2px",
                            }}
                          />
                          <div className="flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span
                              style={{
                                color: restaurant.colors?.primary || "#3B82F6",
                              }}
                            >
                              ${(cartTotal + 3.99 + cartTotal * 0.1).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {orderComplete ? (
                          <div className="space-y-4 text-center py-3">
                            <div
                              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${
                                  restaurant.colors?.primary || "#3B82F6"
                                }20, ${
                                  restaurant.colors?.accent || "#DBEAFE"
                                }60)`,
                              }}
                            >
                              <CheckCircle
                                className="h-12 w-12"
                                style={{
                                  color:
                                    restaurant.colors?.primary || "#3B82F6",
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold mb-2">
                                Order Placed Successfully!
                              </h3>
                              <p className="text-gray-600 mb-1">
                                Your order{" "}
                                <span className="font-semibold">
                                  #{orderId}
                                </span>{" "}
                                has been received.
                              </p>
                              <p className="text-gray-600">
                                Your food will be ready in approximately{" "}
                                <span className="font-semibold">
                                  20-30 minutes
                                </span>
                                .
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="mt-4 w-full rounded-xl py-3 text-lg font-medium border-2 transition-all hover:shadow-md"
                              style={{
                                borderColor: `${
                                  restaurant.colors?.primary || "#3B82F6"
                                }40`,
                                color: restaurant.colors?.primary || "#3B82F6",
                              }}
                              onClick={() => {
                                setOrderComplete(false);
                                setOrderId(null);
                                setCustomerName("");
                                setCustomerEmail("");
                                setCustomerPhone("");
                                setTableNumber("");
                              }}
                            >
                              Close
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="space-y-4 mb-4">
                              <h3 className="text-xl font-bold text-gray-800">
                                Customer Information
                              </h3>
                              <div className="grid gap-3">
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Name
                                  </Label>
                                  <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={customerName}
                                    onChange={(e) =>
                                      setCustomerName(e.target.value)
                                    }
                                    className="h-10 rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-1"
                                    style={{
                                      borderColor: `${
                                        restaurant.colors?.primary || "#3B82F6"
                                      }30`,
                                    }}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor="email"
                                      className="text-sm font-medium text-gray-700"
                                    >
                                      Email (optional)
                                    </Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      placeholder="Your email"
                                      value={customerEmail}
                                      onChange={(e) =>
                                        setCustomerEmail(e.target.value)
                                      }
                                      className="h-10 rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-1"
                                      style={{
                                        borderColor: `${
                                          restaurant.colors?.primary ||
                                          "#3B82F6"
                                        }30`,
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label
                                      htmlFor="phone"
                                      className="text-sm font-medium text-gray-700"
                                    >
                                      Phone (optional)
                                    </Label>
                                    <Input
                                      id="phone"
                                      placeholder="Your phone"
                                      value={customerPhone}
                                      onChange={(e) =>
                                        setCustomerPhone(e.target.value)
                                      }
                                      className="h-10 rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-1"
                                      style={{
                                        borderColor: `${
                                          restaurant.colors?.primary ||
                                          "#3B82F6"
                                        }30`,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label
                                    htmlFor="table"
                                    className="text-sm font-medium text-gray-700"
                                  >
                                    Table Number (optional)
                                  </Label>
                                  <Input
                                    id="table"
                                    placeholder="e.g. Table 5"
                                    value={tableNumber}
                                    onChange={(e) =>
                                      setTableNumber(e.target.value)
                                    }
                                    className="h-10 rounded-lg border-2 focus-visible:ring-2 focus-visible:ring-offset-1"
                                    style={{
                                      borderColor: `${
                                        restaurant.colors?.primary || "#3B82F6"
                                      }30`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 mb-4">
                              <h3 className="text-xl font-bold text-gray-800">
                                Payment Method
                              </h3>
                              <RadioGroup
                                value={paymentMethod}
                                onValueChange={(value) =>
                                  setPaymentMethod(value as PaymentMethod)
                                }
                                className="space-y-3"
                              >
                                <div
                                  className="flex items-center space-x-3 rounded-xl border-2 p-3 transition-all hover:shadow-sm"
                                  style={{
                                    borderColor:
                                      paymentMethod === "card"
                                        ? restaurant.colors?.primary ||
                                          "#3B82F6"
                                        : `${
                                            restaurant.colors?.primary ||
                                            "#3B82F6"
                                          }20`,
                                    backgroundColor:
                                      paymentMethod === "card"
                                        ? `${
                                            restaurant.colors?.primary ||
                                            "#3B82F6"
                                          }10`
                                        : "transparent",
                                  }}
                                >
                                  <RadioGroupItem value="card" id="card" />
                                  <Label
                                    htmlFor="card"
                                    className="flex flex-1 items-center cursor-pointer"
                                  >
                                    <CreditCard
                                      className="mr-3 h-5 w-5"
                                      style={{
                                        color:
                                          restaurant.colors?.primary ||
                                          "#3B82F6",
                                      }}
                                    />
                                    <span className="font-medium">
                                      Credit/Debit Card
                                    </span>
                                  </Label>
                                </div>
                                <div
                                  className="flex items-center space-x-3 rounded-xl border-2 p-3 transition-all hover:shadow-sm"
                                  style={{
                                    borderColor:
                                      paymentMethod === "cash"
                                        ? restaurant.colors?.primary ||
                                          "#3B82F6"
                                        : `${
                                            restaurant.colors?.primary ||
                                            "#3B82F6"
                                          }20`,
                                    backgroundColor:
                                      paymentMethod === "cash"
                                        ? `${
                                            restaurant.colors?.primary ||
                                            "#3B82F6"
                                          }10`
                                        : "transparent",
                                  }}
                                >
                                  <RadioGroupItem value="cash" id="cash" />
                                  <Label
                                    htmlFor="cash"
                                    className="flex-1 cursor-pointer font-medium"
                                  >
                                    Cash on Delivery
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            <div className="mt-6 mb-4 sticky bottom-0 bg-white pt-4 pb-4 border-t">
                              <Button
                                className="w-full rounded-xl py-4 text-lg font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                                size="lg"
                                style={{
                                  background: `linear-gradient(135deg, ${
                                    restaurant.colors?.primary || "#3B82F6"
                                  }, ${
                                    restaurant.colors?.secondary || "#1E40AF"
                                  })`,
                                  color: "white",
                                }}
                                disabled={!customerName || isProcessingOrder}
                                onClick={async () => {
                                  if (!customerName) {
                                    toast({
                                      title: "Name Required",
                                      description:
                                        "Please enter your name to place an order.",
                                      variant: "destructive",
                                    });
                                    return;
                                  }

                                  try {
                                    setIsProcessingOrder(true);

                                    // Create customer object
                                    const customer = {
                                      name: customerName,
                                      email: customerEmail || undefined,
                                      phone: customerPhone || undefined,
                                      table: tableNumber || undefined,
                                    };

                                    // Create order
                                    const order = await createOrder(
                                      id as string,
                                      cart,
                                      customer,
                                      {
                                        paymentMethod,
                                        table: tableNumber || undefined,
                                      }
                                    );

                                    // Set order ID and show success
                                    setOrderId(order.id);
                                    setOrderComplete(true);

                                    // Clear the cart
                                    setCart([]);

                                    // Show toast notification
                                    toast({
                                      title: "Order Placed Successfully!",
                                      description: `Your order #${order.id} has been received.`,
                                    });
                                  } catch (error) {
                                    console.error(
                                      "Error placing order:",
                                      error
                                    );
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to place your order. Please try again.",
                                      variant: "destructive",
                                    });
                                  } finally {
                                    setIsProcessingOrder(false);
                                  }
                                }}
                              >
                                {isProcessingOrder ? (
                                  <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    Processing Order...
                                  </>
                                ) : (
                                  <>
                                    Place Order
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                  </>
                                )}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Item Details Dialog */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
          {selectedItem && (
            <>
              <div className="relative aspect-video w-full overflow-hidden">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <DialogClose className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-gray-700 backdrop-blur-sm transition-colors hover:text-gray-900">
                  <X className="h-4 w-4" />
                </DialogClose>
                <div
                  className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold backdrop-blur-sm"
                  style={{ color: restaurant.colors?.primary || "#3B82F6" }}
                >
                  ${selectedItem.price.toFixed(2)}
                </div>
              </div>
              <div className="p-6">
                <DialogTitle className="text-2xl font-bold mb-2">
                  {selectedItem.name}
                </DialogTitle>
                <DialogDescription className="text-base text-gray-700 mb-4">
                  {selectedItem.description}
                </DialogDescription>

                {selectedItem.tags.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full text-xs font-medium transition-colors"
                          style={{
                            borderColor: `${
                              restaurant.colors?.primary || "#3B82F6"
                            }40`,
                            color: restaurant.colors?.primary || "#3B82F6",
                            backgroundColor: `${
                              restaurant.colors?.primary || "#3B82F6"
                            }10`,
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-1.5 h-4 w-4" />
                    Ready in 15-20 min
                  </div>
                  <Button
                    onClick={() => {
                      addToCart(selectedItem);
                      setShowItemDetails(false);
                    }}
                    className="rounded-full px-5 py-2 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      background:
                        selectedItem.available === false
                          ? "#9CA3AF"
                          : `linear-gradient(135deg, ${
                              restaurant.colors?.primary || "#3B82F6"
                            }, ${restaurant.colors?.secondary || "#1E40AF"})`,
                      color: "white",
                    }}
                    disabled={selectedItem.available === false}
                  >
                    {selectedItem.available === false
                      ? "Unavailable"
                      : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* AI Chat Assistant */}
      <ChatAssistant portalId={id as string} menuItems={menuItems} />
    </div>
  );
}
