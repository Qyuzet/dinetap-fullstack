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

  // Redirect to the main portal page with menu tab
  useEffect(() => {
    router.replace(`/dashboard/portals/${params.id}?tab=menu`);
  }, [params.id, router]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-600">
          Menu management is now integrated into the main portal page.
        </p>
      </div>
    </div>
  );
}
