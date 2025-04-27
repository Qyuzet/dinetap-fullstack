// @ts-nocheck
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cart-context'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrderCartItem } from '@/components/order/order-cart-item'
import { ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function OrderPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  
  const TAX_RATE = 0.0825 // 8.25%
  const DELIVERY_FEE = subtotal >= 25 ? 0 : 4.99
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax + DELIVERY_FEE
  
  // Redirect to menu if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu')
    }
  }, [items.length, router])
  
  if (items.length === 0) {
    return (
      <main className="min-h-screen pb-16 pt-20">
        <div className="container flex items-center justify-center px-4 py-16">
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Your cart is empty</CardTitle>
              <p className="text-muted-foreground">
                Add some items to your cart before proceeding to checkout
              </p>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full bg-[#8B0000] hover:bg-[#8B0000]/90">
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="container px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Order</h1>
            <p className="text-muted-foreground">
              Review your items before checkout
            </p>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={() => clearCart()}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear Cart</span>
            </Button>
          )}
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center text-xl">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart Items
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[600px]">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <OrderCartItem key={item.item.id} cartItem={item} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8.25%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>{DELIVERY_FEE > 0 ? formatCurrency(DELIVERY_FEE) : 'Free'}</span>
                  </div>
                  {DELIVERY_FEE > 0 && (
                    <div className="pt-1 text-xs text-muted-foreground">
                      <p>Free delivery on orders over $25</p>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <div className="flex justify-between pt-1 text-lg font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button 
                  className="w-full bg-[#8B0000] hover:bg-[#8B0000]/90"
                  size="lg"
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link href="/menu">Add More Items</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}