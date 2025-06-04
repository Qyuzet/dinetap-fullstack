// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { portalApi } from "@/lib/api-client";
import type { Portal } from "@/models/Portal";
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
  PlusCircle,
  Store,
  Settings,
  LayoutDashboard,
  Trash2,
  Edit,
  Eye,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  // We're using defaultValue in the Tabs component, so we don't need this state
  // const [activeTab, setActiveTab] = useState("portals");
  const [portals, setPortals] = useState<Portal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user portals
  useEffect(() => {
    const fetchPortals = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          // Use the user's email as the user ID for now
          // This ensures each user sees only their own portals
          const userId = session.user.email;
          console.log("Fetching portals for user:", userId);
          const userPortals = await portalApi.getUserPortals(userId);
          setPortals(userPortals);
        } catch (error) {
          console.error("Error fetching portals:", error);
          toast({
            title: "Error",
            description: "Failed to load your portals. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (status !== "loading") {
        setIsLoading(false);
      }
    };

    fetchPortals();
  }, [status, session, toast]);

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="mt-2 h-4 w-[350px]" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-10 text-center">
        <Store className="mb-4 h-12 w-12 text-blue-600" />
        <h1 className="mb-2 text-2xl font-bold">
          Sign in to access your dashboard
        </h1>
        <p className="mb-6 text-gray-600">
          You need to be signed in to view and manage your restaurant portals
        </p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 rounded-2xl bg-gradient-to-r from-indigo-50 to-white p-8 shadow-sm">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-indigo-800">
          Welcome, {session?.user?.name}
        </h1>
        <p className="text-lg text-indigo-600/80">
          Manage your restaurant portals and settings
        </p>
      </div>

      <Tabs defaultValue="portals" className="space-y-6">
        <TabsList className="bg-indigo-50 p-1 rounded-xl">
          <TabsTrigger
            value="portals"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            My Portals
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portals" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-indigo-800">
              Your Restaurant Portals
            </h2>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="rounded-lg border-2 border-indigo-200 bg-white font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/seed");
                    const data = await response.json();
                    if (data.success) {
                      toast({
                        title: "Database Seeded",
                        description: `Created ${data.data.portals} portals and ${data.data.menuItems} menu items.`,
                      });
                      // Refresh the page to show the new data
                      window.location.reload();
                    } else {
                      throw new Error(data.error);
                    }
                  } catch (error) {
                    console.error("Error seeding database:", error);
                    toast({
                      title: "Error",
                      description: "Failed to seed database. Please try again.",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Seed Database
              </Button>
              <Button
                asChild
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Link href="/dashboard/create-portal">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Portal
                </Link>
              </Button>
            </div>
          </div>

          {portals.length === 0 ? (
            <Card className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-6 rounded-full bg-white p-5 shadow-md">
                  <Store className="h-14 w-14 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-indigo-800">
                  No portals yet
                </h3>
                <p className="mb-8 text-lg text-indigo-600/80">
                  Create your first restaurant portal to start taking orders
                </p>
                <Button
                  asChild
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 text-lg font-medium shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Link href="/dashboard/create-portal">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Portal
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portals.map((portal) => (
                <Card
                  key={portal.id}
                  className="group overflow-hidden border-0 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
                >
                  <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
                  <CardHeader className="pt-6">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-indigo-800">
                          {portal.name}
                        </CardTitle>
                        <CardDescription className="text-indigo-600/70">
                          {portal.description}
                        </CardDescription>
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1 font-medium bg-green-100 text-green-700 border-green-300 shadow-sm"
                        >
                          {portal.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center rounded-lg bg-indigo-50/70 p-3">
                        <span className="text-indigo-700 font-medium">
                          Created:
                        </span>
                        <span className="font-bold text-indigo-900 bg-white px-3 py-1 rounded-md shadow-sm">
                          {new Date(portal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-4 pt-5 pb-6 px-6">
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="default"
                        className="rounded-lg border-indigo-200 bg-white font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
                        asChild
                      >
                        <Link href={`/dashboard/portals/${portal.id}`}>
                          <Edit className="mr-2 h-5 w-5 text-indigo-500" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        size="default"
                        className="rounded-lg border-indigo-200 bg-white font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-50 hover:shadow-md"
                        asChild
                      >
                        <Link href={`/dashboard/portals/${portal.id}/staff`}>
                          <User className="mr-2 h-5 w-5 text-indigo-500" />
                          Staff
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="default"
                            className="rounded-lg border-red-200 bg-white font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 hover:text-red-700 hover:shadow-md"
                          >
                            <Trash2 className="mr-2 h-5 w-5 text-red-500" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the portal for{" "}
                              {portal.name}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={async () => {
                                try {
                                  await portalApi.deletePortal(portal.id);
                                  const success = true;
                                  if (success) {
                                    setPortals(
                                      portals.filter((p) => p.id !== portal.id)
                                    );
                                    toast({
                                      title: "Portal deleted",
                                      description: `${portal.name} has been deleted successfully.`,
                                    });
                                  } else {
                                    throw new Error("Failed to delete portal");
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error deleting portal:",
                                    error
                                  );
                                  toast({
                                    title: "Error",
                                    description:
                                      "Failed to delete the portal. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <Button
                      variant="outline"
                      size="default"
                      className="rounded-lg border-indigo-300 bg-indigo-100 font-medium text-indigo-700 shadow-sm transition-all hover:bg-indigo-200 hover:shadow-md w-full sm:w-auto"
                      asChild
                    >
                      <Link href={`/portal/${portal.id}`} target="_blank">
                        <Eye className="mr-2 h-5 w-5 text-indigo-500" />
                        View Portal
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Card className="group flex h-full flex-col items-center justify-center p-8 text-center border-2 border-dashed border-indigo-200 bg-indigo-50/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300">
                <div className="mb-6 rounded-full bg-white p-5 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-indigo-50">
                  <PlusCircle className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-indigo-800">
                  Create New Portal
                </h3>
                <p className="mb-8 text-lg text-indigo-600/80">
                  Set up a new restaurant ordering portal
                </p>
                <Button
                  asChild
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-lg font-medium shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Link href="/dashboard/create-portal">Get Started</Link>
                </Button>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="border-0 bg-white shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-800">
                Analytics
              </CardTitle>
              <CardDescription className="text-indigo-600/70">
                View performance metrics for your restaurant portals
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-6 rounded-full bg-indigo-50 p-5 shadow-sm">
                  <LayoutDashboard className="h-14 w-14 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-indigo-800">
                  Analytics Coming Soon
                </h3>
                <p className="text-lg text-indigo-600/80">
                  We&apos;re working on providing detailed analytics for your
                  portals
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-0 bg-white shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-indigo-800">
                Account Settings
              </CardTitle>
              <CardDescription className="text-indigo-600/70">
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-6 rounded-full bg-indigo-50 p-5 shadow-sm">
                  <Settings className="h-14 w-14 text-indigo-500" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-indigo-800">
                  Settings Coming Soon
                </h3>
                <p className="text-lg text-indigo-600/80">
                  We&apos;re working on providing account settings management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
