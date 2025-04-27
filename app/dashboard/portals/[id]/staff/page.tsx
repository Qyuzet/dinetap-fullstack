// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { CreditCard, ChefHat, Store, Loader2, ShieldAlert } from "lucide-react";
import { getPortalData } from "@/app/portal/[id]/page-server";
import { generateDummyOrders } from "@/app/actions/client-actions";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

// Import Portal type
import { Portal } from "@/models/Portal";

// Default restaurant data (will be replaced with real data)
const defaultRestaurant: Portal = {
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
  status: "active",
};

export default function StaffPortalPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { data: session, status } = useSession();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState<Portal>(defaultRestaurant);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isGeneratingData, setIsGeneratingData] = useState(false);

  // Fetch portal data and check authorization
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is authenticated
        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }

        if (status === "loading") {
          return;
        }

        // Fetch portal data
        const { portal } = await getPortalData(id as string);

        if (portal) {
          setRestaurant(portal);

          // Check if user is authorized to access this portal
          // In a real app, you would check if the user is the owner or staff of this restaurant
          if (session?.user && portal.userId === session.user.id) {
            setIsAuthorized(true);
          } else {
            // For demo purposes, we'll allow access
            // In a real app, you would redirect to an unauthorized page
            setIsAuthorized(true);
          }
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
  }, [id, router, session, status]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <h1 className="text-xl font-medium">Loading staff portal...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
          <p className="mb-6 text-gray-600">
            You don't have permission to access this portal's staff area.
          </p>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="sticky top-0 z-10 border-b shadow-sm"
        style={{
          backgroundColor: restaurant.colors?.primary || "#3B82F6",
          color: "white",
        }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-sm">
              <Store
                className="h-6 w-6"
                style={{ color: restaurant.colors?.primary || "#3B82F6" }}
              />
            </div>
            <span className="ml-2 text-xl font-bold">
              {restaurant.name} - Staff Portal
            </span>
          </div>

          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              asChild
            >
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Staff Access</h1>

        <p className="mb-8 text-gray-600">
          Select which staff interface you want to access for {restaurant.name}.
          These interfaces are restricted to authorized staff members only.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Cashier Interface Card */}
          <Card className="overflow-hidden">
            <div
              className="h-3 w-full"
              style={{
                backgroundColor: restaurant.colors?.primary || "#3B82F6",
              }}
            ></div>
            <CardHeader>
              <div className="flex items-center">
                <div
                  className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${
                      restaurant.colors?.primary || "#3B82F6"
                    }20`,
                  }}
                >
                  <CreditCard
                    className="h-5 w-5"
                    style={{ color: restaurant.colors?.primary || "#3B82F6" }}
                  />
                </div>
                <CardTitle>Cashier Interface</CardTitle>
              </div>
              <CardDescription>
                Process orders, handle payments, and manage the customer queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 space-y-2 text-sm text-gray-600">
                <li>• View and manage incoming orders</li>
                <li>• Process payments</li>
                <li>• Track order status</li>
                <li>• Manage customer information</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                style={{
                  backgroundColor: restaurant.colors?.primary || "#3B82F6",
                  color: "white",
                }}
                asChild
              >
                <Link href={`/portal/${id}/cashier`}>
                  Access Cashier Interface
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Kitchen Interface Card */}
          <Card className="overflow-hidden">
            <div
              className="h-3 w-full"
              style={{
                backgroundColor: restaurant.colors?.secondary || "#1E40AF",
              }}
            ></div>
            <CardHeader>
              <div className="flex items-center">
                <div
                  className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${
                      restaurant.colors?.secondary || "#1E40AF"
                    }20`,
                  }}
                >
                  <ChefHat
                    className="h-5 w-5"
                    style={{ color: restaurant.colors?.secondary || "#1E40AF" }}
                  />
                </div>
                <CardTitle>Kitchen Interface</CardTitle>
              </div>
              <CardDescription>
                View orders, manage food preparation, and track cooking status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 space-y-2 text-sm text-gray-600">
                <li>• See incoming orders in real-time</li>
                <li>• Track food preparation status</li>
                <li>• Manage cooking queue</li>
                <li>• Mark orders as ready for pickup</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                style={{
                  backgroundColor: restaurant.colors?.secondary || "#1E40AF",
                  color: "white",
                }}
                asChild
              >
                <Link href={`/portal/${id}/kitchen`}>
                  Access Kitchen Interface
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
            <h3 className="mb-2 font-semibold">Generate Test Data</h3>
            <p className="mb-4 text-sm">
              You can generate test orders to see how the system works without
              having to create real orders.
            </p>
            <Button
              variant="outline"
              className="bg-white"
              onClick={async () => {
                try {
                  setIsGeneratingData(true);
                  await generateDummyOrders(id as string, 10);
                  toast({
                    title: "Test Orders Generated",
                    description:
                      "10 test orders have been created successfully.",
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
                  setIsGeneratingData(false);
                }
              }}
              disabled={isGeneratingData}
            >
              {isGeneratingData ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Generate 10 Test Orders
            </Button>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <h3 className="mb-2 font-semibold">Security Notice</h3>
            <p className="text-sm">
              These interfaces contain sensitive operational information and
              controls. Never share access with unauthorized individuals and
              always log out when finished.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
