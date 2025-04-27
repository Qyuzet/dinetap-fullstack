// @ts-nocheck
"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CartItem, useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function OrderCartItem({ cartItem }: { cartItem: CartItem }) {
  const { item, quantity, specialInstructions: initialInstructions } = cartItem
  const { updateQuantity, removeFromCart, updateSpecialInstructions } = useCart()
  const [specialInstructions, setSpecialInstructions] = useState(initialInstructions || '')
  const [isEditing, setIsEditing] = useState(false)
  
  const handleUpdateInstructions = () => {
    updateSpecialInstructions(item.id, specialInstructions)
    setIsEditing(false)
  }
  
  return (
    <div className="rounded-lg border p-4">
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, 96px"
          />
          {item.spiceLevel && (
            <div className="absolute right-1 top-1">
              <Badge variant="secondary" className="bg-red-600 text-[10px] text-white">
                {Array.from({ length: item.spiceLevel }).map((_, i) => '🌶️').join('')}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/menu/${item.id}`}>
                <h3 className="font-medium hover:text-[#8B0000]">{item.name}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => removeFromCart(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
          
          {!isEditing && initialInstructions && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Special instructions:</span> {initialInstructions}
                <Button
                  variant="link"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </p>
            </div>
          )}
          
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="h-20 resize-none text-sm"
                placeholder="Any special requests or allergies..."
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleUpdateInstructions}
                  className="h-8 bg-[#556B2F] text-white hover:bg-[#556B2F]/90"
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    setSpecialInstructions(initialInstructions || '')
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-auto flex items-end justify-between pt-4">
              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => updateQuantity(item.id, quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                {!initialInstructions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setIsEditing(true)}
                  >
                    Add Instructions
                  </Button>
                )}
                <span className="font-medium">
                  {formatCurrency(item.price * quantity)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}