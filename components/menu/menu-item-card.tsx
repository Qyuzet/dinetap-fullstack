// @ts-nocheck
"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/cart-context'
import { MenuItem } from '@/types/menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Minus, Plus, Clock } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface MenuItemCardProps {
  item: MenuItem
  index: number
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [open, setOpen] = useState(false)
  const [specialInstructions, setSpecialInstructions] = useState('')
  
  const handleAddToCart = () => {
    addToCart(item, quantity, specialInstructions)
    setOpen(false)
    setQuantity(1)
    setSpecialInstructions('')
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {item.spiceLevel && (
            <div className="absolute right-2 top-2">
              <Badge variant="secondary" className="bg-red-600 text-white">
                {Array.from({ length: item.spiceLevel }).map((_, i) => '🌶️').join('')}
              </Badge>
            </div>
          )}
          {item.popular && (
            <div className="absolute left-2 top-2">
              <Badge className="bg-[#DAA520] text-white">
                Popular
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Link href={`/menu/${item.id}`} className="group-hover:text-[#8B0000]">
              <h3 className="line-clamp-1 font-medium transition-colors">{item.name}</h3>
            </Link>
            <span className="font-semibold text-[#8B0000]">${item.price.toFixed(2)}</span>
          </div>
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          <div className="mb-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" /> 
            {item.preparationTime} min prep time
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2 p-4 pt-0">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-[#556B2F] text-white hover:bg-[#556B2F]/90"
              >
                Add to Cart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
                <DialogDescription>
                  {item.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col gap-4 py-4">
                <div className="relative h-40 w-full overflow-hidden rounded-md">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-medium">Quantity</div>
                  <div className="flex items-center rounded-md border">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                      <span className="sr-only">Decrease</span>
                    </Button>
                    <div className="flex w-10 items-center justify-center text-sm">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                      <span className="sr-only">Increase</span>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="instructions" className="mb-2 block text-sm font-medium">
                    Special Instructions (optional)
                  </label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests or allergies..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                {item.allergens && item.allergens.length > 0 && (
                  <div className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                    <strong>Allergens:</strong> {item.allergens.join(', ')}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  {formatCurrency(item.price * quantity)}
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="bg-[#8B0000] hover:bg-[#8B0000]/90"
                >
                  Add to Cart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  )
}