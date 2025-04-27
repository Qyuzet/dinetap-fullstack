// @ts-nocheck
"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface MenuFiltersProps {
  selectedCuisine?: string
  selectedDiet?: string
  selectedPrice?: string
  selectedSpice?: string
  onFilterChange?: () => void
}

export function MenuFilters({
  selectedCuisine,
  selectedDiet,
  selectedPrice,
  selectedSpice,
  onFilterChange
}: MenuFiltersProps) {
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

  const handleFilterChange = (filterType: string, value: string) => {
    const queryString = createQueryString(filterType, value)
    router.push(`${pathname}?${queryString}`)
    
    if (onFilterChange) {
      onFilterChange()
    }
  }

  const clearFilters = () => {
    const currentCategory = searchParams.get('category') || ''
    const newParams = new URLSearchParams()
    
    if (currentCategory) {
      newParams.set('category', currentCategory)
    }
    
    router.push(`${pathname}?${newParams.toString()}`)
    
    if (onFilterChange) {
      onFilterChange()
    }
  }

  const cuisines = [
    { value: "American", label: "American" },
    { value: "Italian", label: "Italian" },
    { value: "Asian", label: "Asian" },
    { value: "Mediterranean", label: "Mediterranean" },
    { value: "Mexican", label: "Mexican" },
    { value: "Indian", label: "Indian" },
    { value: "French", label: "French" }
  ]

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten-free", label: "Gluten Free" },
    { value: "healthy", label: "Healthy" }
  ]

  const priceRanges = [
    { value: "0-10", label: "Under $10" },
    { value: "10-15", label: "$ 10 - $15" },
    { value: "15-20", label: "$ 15 - $20" },
    { value: "20-0", label: "$ 20+" }
  ]

  const spiceLevels = [
    { value: "1", label: "Mild 🌶️" },
    { value: "2", label: "Medium 🌶️🌶️" },
    { value: "3", label: "Hot 🌶️🌶️🌶️" }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Filters</h3>
        <Button
          variant="ghost"
          className="mb-2 h-auto p-0 text-sm text-muted-foreground"
          onClick={clearFilters}
        >
          Reset filters
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cuisine">Cuisine</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="cuisine"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedCuisine
                  ? cuisines.find((cuisine) => cuisine.value === selectedCuisine)?.label
                  : "Select cuisine"}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search cuisine..." className="h-9" />
                <CommandEmpty>No cuisine found.</CommandEmpty>
                <CommandGroup>
                  {cuisines.map((cuisine) => (
                    <CommandItem
                      key={cuisine.value}
                      value={cuisine.value}
                      onSelect={() => {
                        handleFilterChange("cuisine", 
                          cuisine.value === selectedCuisine ? "" : cuisine.value
                        )
                      }}
                    >
                      {cuisine.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCuisine === cuisine.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diet">Dietary Preference</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="diet"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedDiet
                  ? dietaryOptions.find((diet) => diet.value === selectedDiet)?.label
                  : "Select preference"}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search preference..." className="h-9" />
                <CommandEmpty>No preference found.</CommandEmpty>
                <CommandGroup>
                  {dietaryOptions.map((diet) => (
                    <CommandItem
                      key={diet.value}
                      value={diet.value}
                      onSelect={() => {
                        handleFilterChange("diet", 
                          diet.value === selectedDiet ? "" : diet.value
                        )
                      }}
                    >
                      {diet.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedDiet === diet.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="price"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedPrice
                  ? priceRanges.find((price) => price.value === selectedPrice)?.label
                  : "Select price range"}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandGroup>
                  {priceRanges.map((price) => (
                    <CommandItem
                      key={price.value}
                      value={price.value}
                      onSelect={() => {
                        handleFilterChange("price", 
                          price.value === selectedPrice ? "" : price.value
                        )
                      }}
                    >
                      {price.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedPrice === price.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spice">Spice Level</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="spice"
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selectedSpice
                  ? spiceLevels.find((spice) => spice.value === selectedSpice)?.label
                  : "Select spice level"}
                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandGroup>
                  {spiceLevels.map((spice) => (
                    <CommandItem
                      key={spice.value}
                      value={spice.value}
                      onSelect={() => {
                        handleFilterChange("spice", 
                          spice.value === selectedSpice ? "" : spice.value
                        )
                      }}
                    >
                      {spice.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedSpice === spice.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}