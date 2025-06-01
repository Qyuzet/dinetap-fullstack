// @ts-nocheck
"use client"

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { menuCategories } from '@/data/menu-data'
import { cn } from '@/lib/utils'

interface MenuCategoryTabsProps {
  activeCategory?: string
}

export function MenuCategoryTabs({ activeCategory }: MenuCategoryTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      
      return params.toString()
    },
    [searchParams]
  )
  
  const handleTabChange = (value: string) => {
    // If "all" is selected, remove the category param
    const queryString = value === 'all' 
      ? createQueryString('category', '')
      : createQueryString('category', value)
      
    router.push(`${pathname}?${queryString}`)
  }
  
  return (
    <div className="relative mb-6 flex w-full items-center justify-center">
      <Tabs
        value={activeCategory || 'all'}
        onValueChange={handleTabChange}
        className="w-full overflow-auto"
      >
        <TabsList className="inline-flex w-full justify-start gap-1 overflow-x-auto p-1 sm:justify-center">
          <TabsTrigger
            value="all"
            className={cn(
              "rounded-md px-3 py-1.5",
              !activeCategory && "bg-[#8B0000] text-white hover:text-white"
            )}
          >
            All Items
          </TabsTrigger>
          {menuCategories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className={cn(
                "rounded-md whitespace-nowrap px-3 py-1.5",
                activeCategory === category.id && "bg-[#8B0000] text-white hover:text-white"
              )}
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      {/* Gradient fades on edges to indicate scrolling */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent md:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent md:hidden" />
    </div>
  )
}