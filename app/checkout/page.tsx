// @ts-nocheck
"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/cart-context'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { CheckoutSuccess } from '@/components/checkout/checkout-success'
import { ShoppingBag } from 'lucide-react'
import { generateOrderId } from '@/lib/utils'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [isCompleted, setIsCompleted] = useState(false)
  const [orderId, setOrderId] = useState('')
  
  // Calculate order totals
  const TAX_RATE = 0.0825 // 8.25% tax rate
  const DELIVERY_FEE = subtotal >= 25 ? 0 : 4.99
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax + DELIVERY_FEE
  
  const handleCompleteCheckout = () => {
    // In a real app, this would process payment and create an order
    const newOrderId = generateOrderId()
    setOrderId(newOrderId)
    setIsCompleted(true)
    clearCart()
  }
  
  // If cart is empty and not a completed order, redirect to menu
  if (items.length === 0 && !isCompleted) {
    return (
      <main className="min-h-screen pb-16 pt-20">
        <div className="container flex items-center justify-center px-4 py-16">
          <Card className="mx-auto max-w-md text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Your cart is empty</CardTitle>
              <CardDescription>
                Add some items to your cart before proceeding to checkout
              </CardDescription>
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
  
  // If checkout completed, show success page
  if (isCompleted) {
    return <CheckoutSuccess orderId={orderId} />
  }
  
  return (
    <main className="min-h-screen pb-16 pt-20">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">
            Complete your order by providing your details below
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CheckoutForm onCompleteCheckout={handleCompleteCheckout} />
          </div>
          
          <div>
            <OrderSummary 
              items={items}
              subtotal={subtotal}
              tax={tax}
              deliveryFee={DELIVERY_FEE}
              total={total}
            />
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                By completing your purchase, you agree to our{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-foreground">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="underline underline-offset-4 hover:text-foreground">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}