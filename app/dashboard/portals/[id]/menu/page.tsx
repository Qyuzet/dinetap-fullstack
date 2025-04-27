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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  PlusCircle,
  Loader2,
  Pencil,
  Trash2,
  ImagePlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getPortalData,
  getMenuItemsData,
  createMenuItemData,
  updateMenuItemData,
  deleteMenuItemData,
} from "./page-server";
import type { MenuItem, Portal } from "@/models/Portal";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

// Helper function to get currency symbol
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "CAD":
      return "C$";
    case "AUD":
      return "A$";
    case "CNY":
      return "¥";
    case "INR":
      return "₹";
    case "BRL":
      return "R$";
    case "MXN":
      return "$";
    default:
      return "$";
  }
};

export default function MenuManagementPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [portal, setPortal] = useState<Portal | null>(null);
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
    "Appetizers",
    "Main Courses",
    "Soups",
    "Salads",
    "Desserts",
    "Beverages",
    "Sides",
    "Specials",
  ];

  // Fetch portal and menu items data
  useEffect(() => {
    const fetchData = async () => {
      if (status === "authenticated" && params.id) {
        try {
          const portalData = await getPortalData(params.id as string);
          if (portalData) {
            setPortal(portalData);

            const items = await getMenuItemsData(params.id as string);
            setMenuItems(items);
          } else {
            toast({
              title: "Error",
              description: "Portal not found",
              variant: "destructive",
            });
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          toast({
            title: "Error",
            description: "Failed to load data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (status !== "loading") {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      image: "",
      available: true,
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

    setIsSaving(true);

    try {
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        image: formData.image,
        available: formData.available,
        portalId: params.id as string,
      };

      if (editingItem) {
        // Update existing menu item
        const updatedItem = await updateMenuItemData(
          editingItem.id,
          menuItemData
        );
        if (updatedItem) {
          setMenuItems((prev) =>
            prev.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          );
          toast({
            title: "Success",
            description: "Menu item updated successfully",
          });
        }
      } else {
        // Create new menu item
        const newItem = await createMenuItemData(menuItemData);
        if (newItem) {
          setMenuItems((prev) => [...prev, newItem]);
          toast({
            title: "Success",
            description: "Menu item added successfully",
          });
        } else {
          throw new Error("Failed to create menu item");
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
        } else {
          throw new Error("Failed to delete menu item");
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
          <Link href={`/dashboard/portals/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portal
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Menu Management</h1>
            <p className="text-gray-600">
              Manage menu items for {portal?.name}
            </p>
          </div>
          <Button onClick={openAddDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Add, edit, or remove items from your restaurant menu
          </CardDescription>
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
                <TableCaption>
                  A list of your restaurant menu items.
                </TableCaption>
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
      </Card>

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
                    Price (
                    {getCurrencySymbol(portal?.settings?.currency || "USD")})
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
                  <Select
                    value={formData.category}
                    onValueChange={handleSelectChange}
                  >
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
                <div className="flex space-x-2">
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-shrink-0"
                    disabled
                  >
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter a URL for your menu item image or upload one (coming
                  soon)
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
    </div>
  );
}
