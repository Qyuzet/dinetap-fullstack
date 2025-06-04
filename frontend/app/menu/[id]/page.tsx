// @ts-nocheck
import { notFound } from "next/navigation";
import Image from "next/image";
import { menuItems } from "@/data/menu-data";
import { MenuItem } from "@/types/menu";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame } from "lucide-react";
import { AddToCartButton } from "@/components/menu/add-to-cart-button";

export function generateStaticParams() {
  return menuItems.map((item) => ({
    id: item.id,
  }));
}

export default function MenuItemPage({ params }: { params: { id: string } }) {
  const item = menuItems.find((item) => item.id === params.id);

  if (!item) {
    notFound();
  }

  // Find related items (same category, excluding current item)
  const relatedItems = menuItems
    .filter(
      (relatedItem) =>
        relatedItem.category === item.category && relatedItem.id !== item.id
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen pb-20 pt-20">
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
              {item.popular && (
                <div className="absolute left-4 top-4">
                  <Badge className="bg-[#DAA520] px-3 py-1 text-white">
                    Popular Choice
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-bold">{item.name}</h1>

              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-md bg-muted/50 px-2 py-1"
                >
                  {item.cuisine}
                </Badge>

                {item.spiceLevel && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-red-700"
                  >
                    <Flame className="h-3 w-3" />
                    {Array.from({ length: item.spiceLevel })
                      .map((_, i) => "🌶️")
                      .join("")}
                  </Badge>
                )}

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {item.preparationTime} min
                </div>
              </div>

              <p className="mt-4 text-lg text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>

              {item.allergens && item.allergens.length > 0 && (
                <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Allergens:</strong> {item.allergens.join(", ")}
                </div>
              )}

              {item.nutritionalInfo && (
                <div className="mt-6">
                  <h3 className="mb-2 text-sm font-medium">
                    Nutritional Information
                  </h3>
                  <div className="grid grid-cols-4 gap-2 rounded-md border p-3 text-center">
                    <div>
                      <div className="text-sm font-semibold">
                        {item.nutritionalInfo.calories}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Calories
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {item.nutritionalInfo.protein}g
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Protein
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {item.nutritionalInfo.carbs}g
                      </div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {item.nutritionalInfo.fat}g
                      </div>
                      <div className="text-xs text-muted-foreground">Fat</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-[#8B0000]">
                    {formatCurrency(item.price)}
                  </div>
                </div>

                <AddToCartButton item={item} />
              </div>
            </div>
          </div>

          {relatedItems.length > 0 && (
            <div className="mt-16">
              <Separator className="mb-8" />
              <h2 className="mb-6 text-2xl font-bold">You Might Also Like</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {relatedItems.map((relatedItem) => (
                  <a
                    key={relatedItem.id}
                    href={`/menu/${relatedItem.id}`}
                    className="group rounded-lg border p-3 transition-all hover:border-[#8B0000]/30 hover:shadow-md"
                  >
                    <div className="relative mb-3 aspect-video overflow-hidden rounded-md">
                      <Image
                        src={relatedItem.image}
                        alt={relatedItem.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <h3 className="font-medium group-hover:text-[#8B0000]">
                      {relatedItem.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(relatedItem.price)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {relatedItem.cuisine}
                      </Badge>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
