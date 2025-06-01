// @ts-nocheck
"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CartItem, useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"

export function CartItemCard({ cartItem }: { cartItem: CartItem }) {
  const { item, quantity, specialInstructions } = cartItem
  const { updateQuantity, removeFromCart } = useCart()
  
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="relative h-16 w-16 overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium leading-tight">{item.name}</h4>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {formatCurrency(item.price)}
            </p>
            {specialInstructions && (
              <p className="mt-1 text-xs italic text-muted-foreground">
                "{specialInstructions}"
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => removeFromCart(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none"
              onClick={() => updateQuantity(item.id, quantity + 1)}
            >
              <Plus className="h-3 w-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
          <span className="font-medium">
            {formatCurrency(item.price * quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}