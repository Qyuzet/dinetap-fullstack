// @ts-nocheck
"use client"

import { ShoppingBag, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { CartItem, useCart } from "@/context/cart-context"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CartItemCard } from "./cart-item-card"
import Link from "next/link"

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const TAX_RATE = 0.0825 // 8.25%
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  
  const handleCheckout = () => {
    setOpen(false)
    router.push('/checkout')
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle className="flex items-center text-xl">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-muted px-2 text-xs">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-3 py-4">
                {items.map((cartItem) => (
                  <CartItemCard key={cartItem.item.id} cartItem={cartItem} />
                ))}
              </div>
            </ScrollArea>
            
            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5 px-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8.25%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between pt-1 font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button 
                  size="lg" 
                  className="w-full bg-[#8B0000] hover:bg-[#8B0000]/90"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <div className="flex items-center justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setOpen(false)
                      router.push('/order')
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => clearCart()}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Clear Cart</span>
                  </Button>
                </div>
                <div className="pt-2 text-center text-xs text-muted-foreground">
                  <p>Free delivery on orders over $25</p>
                </div>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </p>
            </div>
            <Button
              className="mt-4 bg-[#8B0000] hover:bg-[#8B0000]/90"
              size="lg"
              onClick={() => {
                setOpen(false)
                router.push('/menu')
              }}
            >
              Browse Menu
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}