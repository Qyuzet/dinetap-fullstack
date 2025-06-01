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
import {
  getMenuItemsData,
  createMenuItemData,
  updateMenuItemData,
  deleteMenuItemData
} from "./menu/page-server";
import type { Portal, MenuItem } from "@/models/Portal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Pencil, Trash2, ImagePlus } from "lucide-react";

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

    // Validate color formats (basic hex color validation)
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.primaryColor) ||
        !hexColorRegex.test(formData.secondaryColor) ||
        !hexColorRegex.test(formData.accentColor)) {
      toast({
        title: "Error",
        description: "Please enter valid hex color codes (e.g., #FF5733)",
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
          <MenuItemsTab portalId={params.id as string} portal={portal} />
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

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "JPY": return "¥";
    case "CAD": return "C$";
    case "AUD": return "A$";
    case "CNY": return "¥";
    case "INR": return "₹";
    case "BRL": return "R$";
    case "MXN": return "$";
    default: return "$";
  }
};

// MenuItemsTab Component
function MenuItemsTab({ portalId, portal }: { portalId: string; portal: Portal | null }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    image: "",
    available: true,
  });

  const categories = [
    "Appetizers", "Main Courses", "Soups", "Salads",
    "Desserts", "Beverages", "Sides", "Specials"
  ];

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (portalId) {
        try {
          const items = await getMenuItemsData(portalId);
          setMenuItems(items);
        } catch (error) {
          console.error("Error fetching menu items:", error);
          toast({
            title: "Error",
            description: "Failed to load menu items",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMenuItems();
  }, [portalId, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "", description: "", price: "", category: "",
      tags: "", image: "", available: true,
    });
    setEditingItem(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      tags: item.tags.join(", "),
      image: item.image || "",
      available: item.available,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price.trim() || !formData.category) {
      toast({
        title: "Error",
        description: "Name, price, and category are required",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Error",
        description: "Price must be a valid positive number",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        available: formData.available,
        portalId: portalId,
      };

      // Only include image field if it's not empty
      if (formData.image && formData.image.trim() !== "") {
        menuItemData.image = formData.image.trim();
      }

      if (editingItem) {
        const updatedItem = await updateMenuItemData(editingItem.id, menuItemData);
        if (updatedItem) {
          setMenuItems((prev) =>
            prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          );
          toast({
            title: "Success",
            description: "Menu item updated successfully",
          });
        }
      } else {
        const newItem = await createMenuItemData(menuItemData);
        if (newItem) {
          setMenuItems((prev) => [...prev, newItem]);
          toast({
            title: "Success",
            description: "Menu item added successfully",
          });
        }
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        const success = await deleteMenuItemData(id);
        if (success) {
          setMenuItems((prev) => prev.filter((item) => item.id !== id));
          toast({
            title: "Success",
            description: "Menu item deleted successfully",
          });
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
        toast({
          title: "Error",
          description: "Failed to delete menu item. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Menu Items</CardTitle>
            <CardDescription>
              Manage your restaurant's menu items directly here
            </CardDescription>
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <PlusCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium">No menu items yet</h3>
            <p className="mb-6 text-gray-600">
              Start adding items to your restaurant menu
            </p>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your restaurant menu items.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {getCurrencySymbol(portal?.settings?.currency || "USD")}
                      {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {item.available ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          No
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details of this menu item"
                : "Add a new item to your restaurant menu"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price ({getCurrencySymbol(portal?.settings?.currency || "USD")})
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {getCurrencySymbol(portal?.settings?.currency || "USD")}
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-7"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., spicy, vegan, gluten-free"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Enter a URL for your menu item image (optional)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="available">Item is available</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  "Update Item"
                ) : (
                  "Add Item"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
