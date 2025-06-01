// @ts-nocheck
import { Suspense } from "react";
import { MenuCategoryTabs } from "@/components/menu/menu-category-tabs";
import { MenuItemsGrid } from "@/components/menu/menu-items-grid";
import { MenuFilters } from "@/components/menu/menu-filters";

import { Skeleton } from "@/components/ui/skeleton";

interface MenuPageProps {
  searchParams: {
    category?: string;
    cuisine?: string;
    diet?: string;
    price?: string;
    spice?: string;
  };
}

export default function MenuPage({ searchParams }: MenuPageProps) {
  const { category, cuisine, diet, price, spice } = searchParams;

  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="container px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Our Menu
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our wide selection of dishes crafted with fresh ingredients
            and passion
          </p>
        </div>

        <div className="mb-6">
          <MenuCategoryTabs activeCategory={category} />
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <div className="hidden md:block">
            <MenuFilters
              selectedCuisine={cuisine}
              selectedDiet={diet}
              selectedPrice={price}
              selectedSpice={spice}
            />
          </div>
          <div>
            <Suspense
              fallback={
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                </div>
              }
            >
              <MenuItemsGrid
                category={category}
                cuisine={cuisine}
                diet={diet}
                price={price}
                spice={spice}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
