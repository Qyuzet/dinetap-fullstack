// @ts-nocheck
import { CartItem } from '@/context/cart-context'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
}

export function OrderSummary({
  items,
  subtotal,
  tax,
  deliveryFee,
  total
}: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.item.id} className="flex items-start gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-md">
                  <Image
                    src={item.item.image}
                    alt={item.item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="line-clamp-1 font-medium">{item.item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.item.price)}
                      </p>
                      {item.specialInstructions && (
                        <p className="mt-1 text-xs italic text-muted-foreground line-clamp-1">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Free'}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="pt-1 text-xs text-muted-foreground">
              <p>Free delivery on orders over $25</p>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex justify-between pt-1 font-medium">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}