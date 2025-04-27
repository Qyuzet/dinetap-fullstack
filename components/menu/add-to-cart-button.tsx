// @ts-nocheck
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { MenuItem } from "@/types/menu";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  item: MenuItem;
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name} added to your cart`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="flex w-14 items-center justify-center text-center">
            {quantity}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>

        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-[#8B0000] text-white hover:bg-[#8B0000]/90"
          size="lg"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>

      <div>
        <Label htmlFor="special-instructions" className="mb-2 block text-sm">
          Special Instructions (optional)
        </Label>
        <Textarea
          id="special-instructions"
          placeholder="Any special requests, allergies, or preparation preferences..."
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="resize-none"
        />
      </div>
    </div>
  );
}
