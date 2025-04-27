// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  LayoutDashboard,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      { name: "Nasi Goreng Special", quantity: 2, price: 12.99 },
      { name: "Es Cendol", quantity: 1, price: 5.99 },
    ],
    total: 31.97,
    status: "pending",
    createdAt: new Date("2023-09-15T14:30:00"),
  },
  {
    id: "ORD-002",
    customerName: "Jane Smith",
    items: [
      { name: "Sate Ayam", quantity: 1, price: 9.99 },
      { name: "Soto Ayam", quantity: 1, price: 10.99 },
    ],
    total: 20.98,
    status: "confirmed",
    createdAt: new Date("2023-09-15T14:45:00"),
  },
  {
    id: "ORD-003",
    customerName: "Robert Johnson",
    items: [{ name: "Gado-Gado", quantity: 1, price: 8.99 }],
    total: 8.99,
    status: "preparing",
    createdAt: new Date("2023-09-15T15:00:00"),
  },
  {
    id: "ORD-004",
    customerName: "Emily Davis",
    items: [
      { name: "Nasi Goreng Special", quantity: 1, price: 12.99 },
      { name: "Sate Ayam", quantity: 2, price: 9.99 },
    ],
    total: 32.97,
    status: "ready",
    createdAt: new Date("2023-09-15T15:15:00"),
  },
];

export default function AdminPortalPage() {
  const params = useParams();
  const { id } = params;

  const [restaurant, setRestaurant] = useState(mockRestaurant);
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("orders");

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  // Filter orders by status
  const getOrdersByStatus = (status: string) => {
    return orders.filter((order) => order.status === status);
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b bg-white shadow-sm"
        style={{ backgroundColor: restaurant.colors.secondary, color: "white" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Store className="mr-2 h-6 w-6" />
            <span className="text-xl font-bold">{restaurant.name} - Admin</span>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="orders"
          className="space-y-4"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="kitchen">
              <Printer className="mr-2 h-4 w-4" />
              Kitchen View
            </TabsTrigger>
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">New Orders</CardTitle>
                  <CardDescription>
                    Orders awaiting confirmation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: restaurant.colors.primary }}
                  >
                    {getOrdersByStatus("pending").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Confirmed</CardTitle>
                  <CardDescription>
                    Orders confirmed but not yet prepared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: restaurant.colors.primary }}
                  >
                    {getOrdersByStatus("confirmed").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Preparing</CardTitle>
                  <CardDescription>
                    Orders currently being prepared
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: restaurant.colors.primary }}
                  >
                    {getOrdersByStatus("preparing").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ready</CardTitle>
                  <CardDescription>
                    Orders ready for pickup/delivery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: restaurant.colors.primary }}
                  >
                    {getOrdersByStatus("ready").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl font-bold">All Orders</h2>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {order.id}
                          <Badge
                            className="ml-2 capitalize"
                            style={{
                              backgroundColor:
                                order.status === "pending"
                                  ? "#FEF3C7"
                                  : order.status === "confirmed"
                                  ? "#DBEAFE"
                                  : order.status === "preparing"
                                  ? "#E0E7FF"
                                  : "#DCFCE7",
                              color:
                                order.status === "pending"
                                  ? "#92400E"
                                  : order.status === "confirmed"
                                  ? "#1E40AF"
                                  : order.status === "preparing"
                                  ? "#3730A3"
                                  : "#166534",
                            }}
                          >
                            {order.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {order.customerName} - {formatTime(order.createdAt)}
                        </CardDescription>
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{ color: restaurant.colors.primary }}
                      >
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <ScrollArea className="h-24">
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                      >
                        <Printer className="mr-1 h-4 w-4" />
                        Print
                      </Button>
                    </div>

                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "confirmed")}
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Confirm Order
                      </Button>
                    )}

                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                      >
                        <Clock className="mr-1 h-4 w-4" />
                        Start Preparing
                      </Button>
                    )}

                    {order.status === "preparing" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Mark as Ready
                      </Button>
                    )}

                    {order.status === "ready" && (
                      <Button
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, "completed")}
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Complete Order
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="kitchen" className="space-y-4">
            <h2 className="text-2xl font-bold">Kitchen View</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Orders to Prepare</CardTitle>
                  <CardDescription>
                    Orders that need to be prepared by the kitchen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getOrdersByStatus("confirmed").map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="font-bold">{order.id}</div>
                          <Badge>{formatTime(order.createdAt)}</Badge>
                        </div>
                        <ul className="mb-4 space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border mr-2">
                                {item.quantity}
                              </div>
                              {item.name}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          onClick={() =>
                            updateOrderStatus(order.id, "preparing")
                          }
                          style={{
                            backgroundColor: restaurant.colors.primary,
                            color: "white",
                          }}
                        >
                          Start Preparing
                        </Button>
                      </div>
                    ))}

                    {getOrdersByStatus("confirmed").length === 0 && (
                      <div className="flex h-40 items-center justify-center text-muted-foreground">
                        No orders to prepare
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currently Preparing</CardTitle>
                  <CardDescription>
                    Orders currently being prepared by the kitchen
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getOrdersByStatus("preparing").map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="font-bold">{order.id}</div>
                          <Badge>{formatTime(order.createdAt)}</Badge>
                        </div>
                        <ul className="mb-4 space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border mr-2">
                                {item.quantity}
                              </div>
                              {item.name}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full"
                          onClick={() => updateOrderStatus(order.id, "ready")}
                          style={{
                            backgroundColor: restaurant.colors.primary,
                            color: "white",
                          }}
                        >
                          Mark as Ready
                        </Button>
                      </div>
                    ))}

                    {getOrdersByStatus("preparing").length === 0 && (
                      <div className="flex h-40 items-center justify-center text-muted-foreground">
                        No orders being prepared
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View performance metrics for your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <LayoutDashboard className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-xl font-medium">
                    Analytics Coming Soon
                  </h3>
                  <p className="text-muted-foreground">
                    We're working on providing detailed analytics for your
                    restaurant
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
