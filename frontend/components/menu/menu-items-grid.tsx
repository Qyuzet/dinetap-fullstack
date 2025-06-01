// @ts-nocheck
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MenuItem } from '@/types/menu'
import { menuItems } from '@/data/menu-data'
import { MenuItemCard } from './menu-item-card'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { MenuFilters } from './menu-filters'

interface MenuItemsGridProps {
  category?: string
  cuisine?: string
  diet?: string
  price?: string
  spice?: string
}

export function MenuItemsGrid({
  category,
  cuisine,
  diet,
  price,
  spice
}: MenuItemsGridProps) {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Filter menu items based on URL params
  useEffect(() => {
    let filtered = [...menuItems]
    
    if (category) {
      const categoryId = category.toLowerCase()
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === categoryName.toLowerCase() ||
        item.category.toLowerCase().includes(categoryId)
      )
    }
    
    if (cuisine) {
      filtered = filtered.filter(item => 
        item.cuisine.toLowerCase() === cuisine.toLowerCase()
      )
    }
    
    if (diet) {
      filtered = filtered.filter(item => 
        item.tags.includes(diet.toLowerCase())
      )
    }
    
    if (price) {
      const [min, max] = price.split('-').map(Number)
      filtered = filtered.filter(item => 
        (min === 0 || item.price >= min) && 
        (max === 0 || item.price <= max)
      )
    }
    
    if (spice) {
      const spiceLevel = parseInt(spice)
      filtered = filtered.filter(item => 
        item.spiceLevel === spiceLevel
      )
    }
    
    setFilteredItems(filtered)
  }, [category, cuisine, diet, price, spice])
  
  return (
    <>
      {/* Mobile filter button */}
      {isMobile && (
        <div className="mb-4 flex justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </p>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <MenuFilters
                selectedCuisine={cuisine}
                selectedDiet={diet}
                selectedPrice={price}
                selectedSpice={spice}
                onFilterChange={() => setIsSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      )}
      
      {filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mb-3 rounded-full bg-muted p-3">
            <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 text-lg font-medium">No items found</h3>
          <p className="mb-4 max-w-md text-sm text-muted-foreground">
            We couldn't find any items matching your current filters. Try adjusting your 
            selections or browse our full menu.
          </p>
          <Button
            onClick={() => {
              router.push('/menu')
              setIsSheetOpen(false)
            }}
            className="bg-[#8B0000] hover:bg-[#8B0000]/90"
          >
            View All Items
          </Button>
        </div>
      )}
    </>
  )
}