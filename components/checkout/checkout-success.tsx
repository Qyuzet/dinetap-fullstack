// @ts-nocheck
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ChevronRight, Clock, UtensilsCrossed } from 'lucide-react'
import { calculateEstimatedDeliveryTime, formatDateTime } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

interface CheckoutSuccessProps {
  orderId: string
}

export function CheckoutSuccess({ orderId }: CheckoutSuccessProps) {
  const estimatedDelivery = calculateEstimatedDeliveryTime(20)
  
  return (
    <main className="min-h-screen pb-16 pt-20">
      <div className="container flex items-center justify-center px-4 py-16">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="mb-1 font-medium">Order #{orderId}</p>
              <p className="text-sm text-muted-foreground">
                Thank you for your order. We've received it and will begin preparing it shortly.
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Estimated Delivery</h3>
                </div>
                <span className="text-sm font-medium text-[#8B0000]">
                  {formatDateTime(estimatedDelivery)}
                </span>
              </div>
              
              <div className="relative">
                <Separator className="absolute left-3 top-3 h-full w-[1px] bg-muted" />
                <div className="space-y-4">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-[#8B0000] text-center text-[10px] font-medium leading-6 text-white">
                      1
                    </div>
                    <p className="font-medium">Order Received</p>
                    <p className="text-xs text-muted-foreground">
                      We've received your order and payment
                    </p>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-muted/80 text-center text-[10px] font-medium leading-6">
                      2
                    </div>
                    <p className="font-medium text-muted-foreground">Preparing</p>
                    <p className="text-xs text-muted-foreground">
                      Our chefs are preparing your delicious meal
                    </p>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-muted/80 text-center text-[10px] font-medium leading-6">
                      3
                    </div>
                    <p className="font-medium text-muted-foreground">On the Way</p>
                    <p className="text-xs text-muted-foreground">
                      Your order is on its way to your location
                    </p>
                  </div>
                  
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-muted/80 text-center text-[10px] font-medium leading-6">
                      4
                    </div>
                    <p className="font-medium text-muted-foreground">Delivered</p>
                    <p className="text-xs text-muted-foreground">
                      Enjoy your meal!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-dashed p-4 text-center">
              <div className="mb-2 flex justify-center">
                <UtensilsCrossed className="h-8 w-8 text-[#DAA520]" />
              </div>
              <h3 className="mb-1 font-medium">Need Help?</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Our AI assistant is available to help with any questions about your order
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/complaints">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-[#8B0000] hover:bg-[#8B0000]/90">
              <Link href="/menu">
                Order More Food
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/" className="flex items-center justify-center">
                Return to Home
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}