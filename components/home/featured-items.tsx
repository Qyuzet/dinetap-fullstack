// @ts-nocheck
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { menuItems } from '@/data/menu-data'

export function FeaturedItems() {
  const { addToCart } = useCart()
  const { toast } = useToast()
  
  // Filter to only popular items and limit to 6
  const featuredItems = menuItems
    .filter(item => item.popular)
    .slice(0, 6)
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {item.spiceLevel && (
                <div className="absolute right-2 top-2">
                  <Badge variant="secondary" className="bg-red-600 text-white">
                    {Array.from({ length: item.spiceLevel }).map((_, i) => '🌶️').join('')}
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Link href={`/menu/${item.id}`}>
                  <h3 className="line-clamp-1 font-medium">{item.name}</h3>
                </Link>
                <span className="font-semibold text-[#8B0000]">${item.price.toFixed(2)}</span>
              </div>
              <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                onClick={() => {
                  addToCart(item, 1)
                  toast({
                    title: "Added to cart",
                    description: `${item.name} has been added to your cart.`
                  })
                }}
                className="w-full bg-[#556B2F] text-white hover:bg-[#556B2F]/90"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}