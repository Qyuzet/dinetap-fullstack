// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
  ArrowLeft,
  Store,
  Loader2,
  Palette,
  Menu as MenuIcon,
  Settings,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPortalData, updatePortalData } from "./page-server";
import type { Portal } from "@/models/Portal";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPortalPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [portal, setPortal] = useState<Portal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    currency: "USD",
  });

  // Fetch portal data
  useEffect(() => {
    const fetchPortal = async () => {
      if (status === "authenticated" && params.id) {
        try {
          const portalData = await getPortalData(params.id as string);
          if (portalData) {
            setPortal(portalData);
            setFormData({
              name: portalData.name,
              description: portalData.description,
              primaryColor: portalData.colors?.primary || "#3B82F6",
              secondaryColor: portalData.colors?.secondary || "#1E40AF",
              accentColor: portalData.colors?.accent || "#DBEAFE",
              currency: portalData.settings?.currency || "USD",
            });
          } else {
            toast({
              title: "Error",
              description: "Portal not found",
              variant: "destructive",
            });
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching portal:", error);
          toast({
            title: "Error",
            description: "Failed to load portal data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (status !== "loading") {
        setIsLoading(false);
      }
    };

    fetchPortal();
  }, [status, params.id, toast, router]);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Restaurant name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Update the portal
      const updatedPortal = await updatePortalData(params.id as string, {
        name: formData.name,
        description: formData.description,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor,
          accent: formData.accentColor,
        },
        settings: {
          currency: formData.currency,
        },
      });

      if (updatedPortal) {
        setPortal(updatedPortal);
        toast({
          title: "Success",
          description: "Portal updated successfully",
        });
      } else {
        throw new Error("Failed to update portal");
      }
    } catch (error) {
      console.error("Error updating portal:", error);
      toast({
        title: "Error",
        description: "Failed to update portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Portal</h1>
            <p className="text-gray-600">
              Customize your restaurant ordering portal
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            <Link href={`/portal/${params.id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Portal
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general">
            <Store className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="menu">
            <MenuIcon className="mr-2 h-4 w-4" />
            Menu Items
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Update your restaurant's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="text"
                        value={formData.primaryColor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="text"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-8 w-8 rounded-full border"
                        style={{ backgroundColor: formData.accentColor }}
                      />
                      <Input
                        id="accentColor"
                        name="accentColor"
                        type="text"
                        value={formData.accentColor}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-medium">Preview</h3>
                  <div className="rounded-lg border p-4">
                    <div
                      className="mb-4 rounded-lg p-4"
                      style={{ backgroundColor: formData.accentColor }}
                    >
                      <div className="flex items-center">
                        <Store
                          className="mr-2 h-6 w-6"
                          style={{ color: formData.primaryColor }}
                        />
                        <span
                          className="text-xl font-bold"
                          style={{ color: formData.secondaryColor }}
                        >
                          {formData.name}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      <div
                        className="rounded-lg px-4 py-2 text-white"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        Primary Button
                      </div>
                      <div
                        className="rounded-lg border px-4 py-2"
                        style={{
                          borderColor: formData.primaryColor,
                          color: formData.primaryColor,
                        }}
                      >
                        Secondary Button
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>
                Manage your restaurant's menu items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <MenuIcon className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 text-xl font-medium">Menu Management</h3>
                <p className="mb-6 text-gray-600">
                  Add, edit, and organize your restaurant menu items
                </p>
                <Button asChild>
                  <Link href={`/dashboard/portals/${params.id}/menu`}>
                    Manage Menu Items
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Portal Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for your portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="AUD">AUD (A$)</SelectItem>
                        <SelectItem value="CNY">CNY (¥)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="BRL">BRL (R$)</SelectItem>
                        <SelectItem value="MXN">MXN ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-sm text-gray-500">
                      This currency will be used for all menu items and orders
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
