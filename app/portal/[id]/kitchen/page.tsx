// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Order, OrderStatus } from "@/models/Order";
import {
  getOrdersByStatus,
  updateOrderStatus,
  generateDummyOrders,
} from "@/app/actions/client-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Clock,
  CheckCircle,
  Bell,
  ChefHat,
  CreditCard,
  User,
  Loader2,
  X,
  Utensils,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    items: [
      {
        name: "Nasi Goreng Special",
        quantity: 2,
        price: 12.99,
        notes: "Extra spicy",
      },
      { name: "Es Cendol", quantity: 1, price: 5.99, notes: "" },
    ],
    total: 31.97,
    status: "confirmed",
    createdAt: new Date("2023-09-15T14:30:00"),
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    items: [
      { name: "Sate Ayam", quantity: 1, price: 9.99, notes: "No peanut sauce" },
      { name: "Soto Ayam", quantity: 1, price: 10.99, notes: "" },
    ],
    total: 20.98,
    status: "preparing",
    createdAt: new Date("2023-09-15T14:45:00"),
  },
  {
    id: "ORD-003",
    customerName: "Robert Johnson",
    items: [{ name: "Gado-Gado", quantity: 1, price: 8.99, notes: "No eggs" }],
    total: 8.99,
    status: "preparing",
    createdAt: new Date("2023-09-15T15:00:00"),
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    items: [
      { name: "Nasi Goreng Special", quantity: 1, price: 12.99, notes: "" },
      { name: "Sate Ayam", quantity: 2, price: 9.99, notes: "Well done" },
    ],
    total: 32.97,
    status: "ready",
    createdAt: new Date("2023-09-15T15:15:00"),
  },
];

export default function KitchenPortalPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState(mockRestaurant);

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Import the getPortalData function dynamically to avoid circular dependencies
        const { getPortalData } = await import("../page-server");
        const { portal } = await getPortalData(id as string);

        if (portal) {
          setRestaurant(portal);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchData();
  }, [id]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/dashboard/portals/${id}/staff`);
    }

    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, router, id]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (status !== "authenticated" || isLoading) return;

      try {
        // Get confirmed and preparing orders for the kitchen
        const confirmedOrders = await getOrdersByStatus(
          id as string,
          "confirmed"
        );
        const preparingOrders = await getOrdersByStatus(
          id as string,
          "preparing"
        );
        const readyOrders = await getOrdersByStatus(id as string, "ready");

        // Combine all orders
        const allOrders = [
          ...confirmedOrders,
          ...preparingOrders,
          ...readyOrders,
        ];
        setOrders(allOrders);

        // Check for new confirmed orders to show alert
        if (confirmedOrders.length > 0) {
          setNewOrderAlert(true);

          // Auto-dismiss after 5 seconds
          setTimeout(() => {
            setNewOrderAlert(false);
          }, 5000);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    // Set up polling for new orders every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [id, status, isLoading, refreshTrigger]);

  // Update order status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      setIsProcessing(true);
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders
      setRefreshTrigger((prev) => prev + 1);

      // Show success notification
      const statusMessages = {
        preparing: "Order is now being prepared",
        ready: "Order is ready for pickup",
        completed: "Order has been completed",
      };

      toast({
        title: "Order Status Updated",
        description:
          statusMessages[newStatus] || `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter orders by status locally
  const filterOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Calculate time elapsed since order creation
  const getTimeElapsed = (createdAt: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 minute ago";
    return `${diffMins} minutes ago`;
  };

  // Simulate new order notification
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance of new order every 30 seconds
      if (Math.random() < 0.2) {
        setNewOrderAlert(true);

        // Play notification sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch((e) => console.log("Audio play failed:", e));

        // Clear alert after 5 seconds
        setTimeout(() => {
          setNewOrderAlert(false);
        }, 5000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <h1 className="text-xl font-medium">Loading kitchen interface...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b shadow-sm"
        style={{ backgroundColor: restaurant.colors.secondary, color: "white" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm">
              <ChefHat
                className="h-6 w-6"
                style={{ color: restaurant.colors.primary }}
              />
            </div>
            <span className="ml-2 text-xl font-bold">
              {restaurant.name} - Kitchen
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {newOrderAlert && (
              <div className="animate-pulse flex items-center rounded-full bg-red-500 px-3 py-1 text-sm text-white">
                <Bell className="mr-1 h-4 w-4" />
                New Order!
              </div>
            )}

            {/* Navigation links to other interfaces */}
            <div className="hidden md:flex space-x-2">
              <Link href={`/dashboard/portals/${id}/staff`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border border-white/30"
                >
                  <User className="mr-2 h-4 w-4" />
                  Staff Portal
                </Button>
              </Link>
              <Link href={`/portal/${id}/cashier`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border border-white/30"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Cashier View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>

          <Button
            variant="outline"
            size="sm"
            className="bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            onClick={async () => {
              try {
                setIsProcessing(true);
                await generateDummyOrders(id as string, 5);
                setRefreshTrigger((prev) => prev + 1);
                toast({
                  title: "Test Orders Generated",
                  description: "5 test orders have been created successfully.",
                });
              } catch (error) {
                console.error("Error generating dummy orders:", error);
                toast({
                  title: "Error",
                  description:
                    "Failed to generate test orders. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Test Orders
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Incoming Orders */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Incoming Orders
              {filterOrdersByStatus("confirmed").length > 0 && (
                <Badge
                  className="ml-2"
                  style={{
                    backgroundColor: restaurant.colors.primary,
                    color: "white",
                  }}
                >
                  {filterOrdersByStatus("confirmed").length}
                </Badge>
              )}
            </h2>

            {filterOrdersByStatus("confirmed").length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                  No new orders
                </CardContent>
              </Card>
            ) : (
              filterOrdersByStatus("confirmed").map((order) => (
                <Card
                  key={order.id}
                  className="border-l-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderLeftColor: restaurant.colors.primary }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        Order {order.id}
                        <Badge className="ml-2 bg-blue-100 text-blue-800">
                          New
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTime(order.createdAt)}
                      </div>
                    </div>
                    <CardDescription>
                      {order.customer.name}
                      {order.customer.table
                        ? ` • ${order.customer.table}`
                        : ""}{" "}
                      • {getTimeElapsed(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex flex-col">
                          <div className="flex items-center font-medium">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-800 mr-2">
                              {item.quantity}
                            </div>
                            {item.name}
                          </div>
                          {item.notes && (
                            <div className="ml-8 text-sm text-muted-foreground">
                              Note: {item.notes}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpdateOrderStatus(order.id, "preparing")
                      }
                      disabled={isProcessing}
                      style={{
                        backgroundColor: restaurant.colors.primary,
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Start Preparing
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          {/* In Progress Orders */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              In Progress
              {filterOrdersByStatus("preparing").length > 0 && (
                <Badge
                  className="ml-2"
                  style={{
                    backgroundColor: restaurant.colors.primary,
                    color: "white",
                  }}
                >
                  {filterOrdersByStatus("preparing").length}
                </Badge>
              )}
            </h2>

            {filterOrdersByStatus("preparing").length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                  No orders in progress
                </CardContent>
              </Card>
            ) : (
              filterOrdersByStatus("preparing").map((order) => (
                <Card
                  key={order.id}
                  className="border-l-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderLeftColor: "#FFA500" }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        Order {order.id}
                        <Badge className="ml-2 bg-orange-100 text-orange-800">
                          Preparing
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTime(order.createdAt)}
                      </div>
                    </div>
                    <CardDescription>
                      {order.customer.name}
                      {order.customer.table
                        ? ` • ${order.customer.table}`
                        : ""}{" "}
                      • {getTimeElapsed(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex flex-col">
                          <div className="flex items-center font-medium">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-800 mr-2">
                              {item.quantity}
                            </div>
                            {item.name}
                          </div>
                          {item.notes && (
                            <div className="ml-8 text-sm text-muted-foreground">
                              Note: {item.notes}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#FFA500",
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Mark as Ready
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Ready Orders */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Ready for Pickup/Delivery
            {filterOrdersByStatus("ready").length > 0 && (
              <Badge
                className="ml-2"
                style={{
                  backgroundColor: "#22C55E",
                  color: "white",
                }}
              >
                {filterOrdersByStatus("ready").length}
              </Badge>
            )}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterOrdersByStatus("ready").length === 0 ? (
              <Card>
                <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                  No orders ready for pickup
                </CardContent>
              </Card>
            ) : (
              filterOrdersByStatus("ready").map((order) => (
                <Card
                  key={order.id}
                  className="border-l-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderLeftColor: "#22C55E" }}
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        Order {order.id}
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          Ready
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {formatTime(order.createdAt)}
                      </div>
                    </div>
                    <CardDescription>
                      {order.customer.name}
                      {order.customer.table
                        ? ` • ${order.customer.table}`
                        : ""}{" "}
                      • {getTimeElapsed(order.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">
                      {order.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}{" "}
                      items
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() =>
                        handleUpdateOrderStatus(order.id, "completed")
                      }
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#22C55E",
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Complete Order
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-md rounded-xl p-0 overflow-hidden">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold flex items-center">
                    Order {selectedOrder.id}
                    <Badge
                      className="ml-2"
                      style={{
                        backgroundColor:
                          selectedOrder.status === "confirmed"
                            ? "#3B82F6"
                            : selectedOrder.status === "preparing"
                            ? "#FFA500"
                            : selectedOrder.status === "ready"
                            ? "#22C55E"
                            : "#9CA3AF",
                        color: "white",
                      }}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Badge>
                  </DialogTitle>
                  <DialogClose className="rounded-full p-1 hover:bg-gray-100">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
                <DialogDescription className="mt-1">
                  {selectedOrder.customer.name}
                  {selectedOrder.customer.table
                    ? ` • ${selectedOrder.customer.table}`
                    : ""}{" "}
                  • {formatTime(selectedOrder.createdAt)}•{" "}
                  {getTimeElapsed(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 pt-2">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Utensils className="mr-2 h-4 w-4" />
                    Order Items
                  </h3>
                  <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedOrder.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-col p-3 rounded-lg border border-gray-100 bg-gray-50"
                      >
                        <div className="flex items-center justify-between font-medium">
                          <div className="flex items-center">
                            <div
                              className="flex h-6 w-6 items-center justify-center rounded-full mr-2"
                              style={{
                                backgroundColor:
                                  selectedOrder.status === "confirmed"
                                    ? "#EFF6FF"
                                    : selectedOrder.status === "preparing"
                                    ? "#FFF7ED"
                                    : selectedOrder.status === "ready"
                                    ? "#F0FDF4"
                                    : "#F9FAFB",
                                color:
                                  selectedOrder.status === "confirmed"
                                    ? "#3B82F6"
                                    : selectedOrder.status === "preparing"
                                    ? "#FFA500"
                                    : selectedOrder.status === "ready"
                                    ? "#22C55E"
                                    : "#9CA3AF",
                              }}
                            >
                              {item.quantity}
                            </div>
                            {item.name}
                          </div>
                          <span className="text-gray-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="ml-8 mt-1 text-sm text-gray-500">
                            Note: {item.notes}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowOrderDetails(false)}
                  >
                    Close
                  </Button>
                  {selectedOrder.status === "confirmed" && (
                    <Button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, "preparing");
                        setShowOrderDetails(false);
                      }}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: restaurant.colors.primary,
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Start Preparing
                    </Button>
                  )}
                  {selectedOrder.status === "preparing" && (
                    <Button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, "ready");
                        setShowOrderDetails(false);
                      }}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#FFA500",
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Mark as Ready
                    </Button>
                  )}
                  {selectedOrder.status === "ready" && (
                    <Button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, "completed");
                        setShowOrderDetails(false);
                      }}
                      disabled={isProcessing}
                      style={{
                        backgroundColor: "#22C55E",
                        color: "white",
                      }}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
