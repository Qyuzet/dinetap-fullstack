// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Order, OrderStatus, PaymentMethod } from "@/models/Order";
import {
  getOrdersByStatus,
  updateOrderStatus,
  processOrderPayment,
  generateDummyOrders,
} from "@/app/actions/client-actions";
import {
  ShoppingBag,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Bell,
  Store,
  ChefHat,
  User,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data - in a real app, this would come from the database
const mockOrders = [
  {
    id: "ORD-1001",
    customer: "John Smith",
    items: [
      { name: "Cheeseburger", quantity: 2, price: 8.99, notes: "No pickles" },
      { name: "French Fries", quantity: 1, price: 3.99, notes: "" },
      { name: "Chocolate Shake", quantity: 1, price: 4.99, notes: "" },
    ],
    total: 26.96,
    status: "pending",
    paymentMethod: "Card",
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    table: "Takeout",
  },
  {
    id: "ORD-1002",
    customer: "Sarah Johnson",
    items: [
      {
        name: "Margherita Pizza",
        quantity: 1,
        price: 12.99,
        notes: "Extra cheese",
      },
      {
        name: "Caesar Salad",
        quantity: 1,
        price: 7.99,
        notes: "Dressing on the side",
      },
      { name: "Iced Tea", quantity: 2, price: 2.99, notes: "" },
    ],
    total: 26.96,
    status: "confirmed",
    paymentMethod: "Cash",
    createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
    table: "Table 5",
  },
  {
    id: "ORD-1003",
    customer: "Michael Brown",
    items: [
      {
        name: "Chicken Wings",
        quantity: 2,
        price: 10.99,
        notes: "Extra spicy",
      },
      { name: "Onion Rings", quantity: 1, price: 4.99, notes: "" },
      { name: "Soda", quantity: 3, price: 1.99, notes: "" },
    ],
    total: 32.94,
    status: "ready",
    paymentMethod: "Card",
    createdAt: new Date(Date.now() - 25 * 60000), // 25 minutes ago
    table: "Table 3",
  },
  {
    id: "ORD-1004",
    customer: "Emily Davis",
    items: [
      { name: "Pasta Carbonara", quantity: 1, price: 14.99, notes: "" },
      { name: "Garlic Bread", quantity: 1, price: 3.99, notes: "" },
      { name: "Tiramisu", quantity: 1, price: 6.99, notes: "" },
      { name: "Sparkling Water", quantity: 1, price: 2.99, notes: "" },
    ],
    total: 28.96,
    status: "completed",
    paymentMethod: "Card",
    createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
    table: "Table 8",
  },
];

// Mock restaurant data
const mockRestaurant = {
  id: "123",
  name: "Sample Restaurant",
  description: "A sample restaurant for demonstration",
  logo: "/logo.png",
  colors: {
    primary: "#3B82F6",
    secondary: "#1E40AF",
    accent: "#DBEAFE",
  },
  userId: "user123",
  createdAt: new Date(),
  status: "active" as const,
};

export default function CashierPortalPage() {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [activeTab, setActiveTab] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isOrderDetailsDialogOpen, setIsOrderDetailsDialogOpen] =
    useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
        const fetchedOrders = await getOrdersByStatus(
          id as string,
          statusFilter
        );
        setOrders(fetchedOrders);

        // Check for new pending orders to show alert
        const pendingOrders = fetchedOrders.filter(
          (order) => order.status === "pending"
        );
        if (pendingOrders.length > 0) {
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
  }, [id, status, isLoading, statusFilter, refreshTrigger]);

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
      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${newStatus}`,
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

  // Process payment
  const handleProcessPayment = async (
    orderId: string,
    paymentMethod: PaymentMethod,
    tip?: number
  ) => {
    try {
      setIsProcessing(true);
      await processOrderPayment(orderId, paymentMethod, tip);
      setIsPaymentDialogOpen(false);
      setSelectedOrder(null);
      // Refresh orders
      setRefreshTrigger((prev) => prev + 1);

      // Show success notification
      toast({
        title: "Payment Processed",
        description: `Payment for order #${orderId} processed successfully.`,
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter orders by status locally
  const filterOrdersByStatus = (status: string) => {
    if (status === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === status);
  };

  // Filter orders by search query
  const getFilteredOrders = () => {
    const filteredByStatus = filterOrdersByStatus(statusFilter);

    if (!searchQuery) {
      return filteredByStatus;
    }

    const query = searchQuery.toLowerCase();
    return filteredByStatus.filter(
      (order) =>
        order.id.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query))
    );
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get time elapsed
  const getTimeElapsed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) {
      return "Just now";
    } else if (diffMins === 1) {
      return "1 minute ago";
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }
  };

  // Handle tip change
  const handleTipChange = (value: string) => {
    const tipValue = parseFloat(value);
    if (!isNaN(tipValue) && tipValue >= 0) {
      setTipAmount(tipValue);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <h1 className="text-xl font-medium">Loading cashier interface...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b shadow-sm"
        style={{ backgroundColor: restaurant.colors.primary, color: "white" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-6 w-6" />
            <span className="text-xl font-bold">
              {restaurant.name} - Cashier
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
                  className="text-white hover:bg-white/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  Staff Portal
                </Button>
              </Link>
              <Link href={`/portal/${id}/kitchen`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChefHat className="mr-2 h-4 w-4" />
                  Kitchen View
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Search and filter */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search orders..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="ready">Ready for Pickup</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  setIsProcessing(true);
                  await generateDummyOrders(id as string, 5);
                  setRefreshTrigger((prev) => prev + 1);
                  toast({
                    title: "Test Orders Generated",
                    description:
                      "5 test orders have been created successfully.",
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
        </div>

        {/* Order management tabs */}
        <Tabs
          defaultValue="new"
          className="space-y-6"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new" className="relative">
              New
              {filterOrdersByStatus("pending").length > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0"
                  style={{ backgroundColor: restaurant.colors.secondary }}
                >
                  {filterOrdersByStatus("pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* New Orders Tab */}
          <TabsContent value="new" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterOrdersByStatus("pending").length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ShoppingBag className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                      <p>No new orders</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filterOrdersByStatus("pending").map((order) => (
                  <Card
                    key={order.id}
                    className="border-l-4 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderLeftColor: restaurant.colors.primary }}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderDetailsDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                      <CardDescription>
                        {order.customer.name}
                        {order.customer.table
                          ? ` • ${order.customer.table}`
                          : ""}{" "}
                        • {formatTime(order.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {getTimeElapsed(order.createdAt)}
                      </div>
                    </CardContent>
                    <CardFooter className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleUpdateOrderStatus(order.id, "cancelled")
                        }
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsPaymentDialogOpen(true);
                        }}
                        style={{
                          backgroundColor: restaurant.colors.primary,
                          color: "white",
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Processing Orders Tab */}
          <TabsContent value="processing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterOrdersByStatus("confirmed").length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                      <p>No orders in processing</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filterOrdersByStatus("confirmed").map((order) => (
                  <Card
                    key={order.id}
                    className="border-l-4 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderLeftColor: "#3B82F6" }}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderDetailsDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">
                          Processing
                        </Badge>
                      </div>
                      <CardDescription>
                        {order.customer.name}
                        {order.customer.table
                          ? ` • ${order.customer.table}`
                          : ""}{" "}
                        • {formatTime(order.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {getTimeElapsed(order.createdAt)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" variant="outline" disabled>
                        Preparing in Kitchen
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Ready Orders Tab */}
          <TabsContent value="ready" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterOrdersByStatus("ready").length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <CheckCircle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                      <p>No orders ready for pickup</p>
                    </div>
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
                      setIsOrderDetailsDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge className="bg-green-100 text-green-800">
                          Ready
                        </Badge>
                      </div>
                      <CardDescription>
                        {order.customer.name}
                        {order.customer.table
                          ? ` • ${order.customer.table}`
                          : ""}{" "}
                        • {formatTime(order.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 space-y-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-sm text-muted-foreground">
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {getTimeElapsed(order.createdAt)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() =>
                          handleUpdateOrderStatus(order.id, "completed")
                        }
                        style={{
                          backgroundColor: "#22C55E",
                          color: "white",
                        }}
                        disabled={isProcessing}
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
          </TabsContent>

          {/* Completed Orders Tab */}
          <TabsContent value="completed" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterOrdersByStatus("completed").length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <CheckCircle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                      <p>No completed orders</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filterOrdersByStatus("completed").map((order) => (
                  <Card
                    key={order.id}
                    className="border-l-4 opacity-80 cursor-pointer hover:shadow-md transition-all"
                    style={{ borderLeftColor: "#6B7280" }}
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderDetailsDialogOpen(true);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <CardDescription>
                        {order.customer.name}
                        {order.customer.table
                          ? ` • ${order.customer.table}`
                          : ""}{" "}
                        • {formatTime(order.createdAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-2 space-y-1">
                        <div className="text-sm">
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{" "}
                          items
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        {getTimeElapsed(order.createdAt)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the card click from triggering
                          setSelectedOrder(order);
                          setIsOrderDetailsDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Select payment method for order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              {selectedOrder && (
                <>
                  <div className="rounded-md bg-gray-50 p-3">
                    <div className="mb-2 space-y-1">
                      {selectedOrder.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium">Add Tip (Optional)</h3>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tipAmount.toString()}
                        onChange={(e) => handleTipChange(e.target.value)}
                        className="w-24"
                      />
                      <div className="ml-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTipAmount(
                              Math.round(selectedOrder.subtotal * 0.15 * 100) /
                                100
                            )
                          }
                        >
                          15%
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setTipAmount(
                              Math.round(selectedOrder.subtotal * 0.2 * 100) /
                                100
                            )
                          }
                        >
                          20%
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium mt-4">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() =>
                          handleProcessPayment(
                            selectedOrder.id,
                            "cash",
                            tipAmount
                          )
                        }
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <DollarSign className="mr-2 h-4 w-4" />
                        )}
                        Cash
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() =>
                          handleProcessPayment(
                            selectedOrder.id,
                            "card",
                            tipAmount
                          )
                        }
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        Card
                      </Button>
                    </div>

                    {tipAmount > 0 && (
                      <div className="mt-2 rounded-md bg-gray-50 p-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tip:</span>
                          <span>${tipAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>New Total:</span>
                          <span>
                            ${(selectedOrder.total + tipAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog
        open={isOrderDetailsDialogOpen}
        onOpenChange={setIsOrderDetailsDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order {selectedOrder?.id} • {selectedOrder?.customer.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {selectedOrder && (
              <div className="space-y-4">
                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    className={`
                      ${
                        selectedOrder.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                      ${
                        selectedOrder.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : ""
                      }
                      ${
                        selectedOrder.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                      ${
                        selectedOrder.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : ""
                      }
                      ${
                        selectedOrder.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                    `}
                  >
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </Badge>
                </div>

                {/* Order Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order Time:</span>
                  <span className="text-sm">
                    {formatTime(selectedOrder.createdAt)} •{" "}
                    {getTimeElapsed(selectedOrder.createdAt)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="rounded-md bg-gray-50 p-3">
                  <h3 className="mb-2 font-medium">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span>{selectedOrder.customer.name}</span>
                    </div>
                    {selectedOrder.customer.table && (
                      <div className="flex justify-between">
                        <span>Table:</span>
                        <span>{selectedOrder.customer.table}</span>
                      </div>
                    )}
                    {selectedOrder.customer.phone && (
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{selectedOrder.customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="rounded-md bg-gray-50 p-3">
                  <h3 className="mb-2 font-medium">Order Items</h3>
                  <div className="max-h-[200px] overflow-y-auto">
                    <div className="space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="rounded border border-gray-100 bg-white p-2"
                        >
                          <div className="flex justify-between font-medium">
                            <span>
                              {item.quantity}× {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.notes && (
                            <div className="mt-1 text-xs text-gray-500">
                              Note: {item.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>

                  {selectedOrder.paymentMethod && (
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <span className="capitalize">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOrderDetailsDialogOpen(false)}
                  >
                    Close
                  </Button>

                  {selectedOrder.status === "pending" && (
                    <Button
                      onClick={() => {
                        setIsOrderDetailsDialogOpen(false);
                        setIsPaymentDialogOpen(true);
                      }}
                      style={{
                        backgroundColor: restaurant.colors.primary,
                        color: "white",
                      }}
                    >
                      Process Payment
                    </Button>
                  )}

                  {selectedOrder.status === "ready" && (
                    <Button
                      onClick={() => {
                        handleUpdateOrderStatus(selectedOrder.id, "completed");
                        setIsOrderDetailsDialogOpen(false);
                      }}
                      style={{
                        backgroundColor: "#22C55E",
                        color: "white",
                      }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Complete Order
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
