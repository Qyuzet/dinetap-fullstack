// @ts-nocheck
import Link from 'next/link'
import Image from 'next/image'
import { menuCategories } from '@/data/menu-data'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function Categories() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {menuCategories.map((category, index) => (
        <Link 
          key={category.id}
          href={`/menu?category=${category.id}`}
          className="h-full"
        >
          <Card className={cn(
            "group h-full overflow-hidden transition-all duration-300 hover:shadow-md",
            index === 0 && "border-[#8B0000]/20 bg-[#8B0000]/5",
            index === 1 && "border-[#556B2F]/20 bg-[#556B2F]/5",
            index === 2 && "border-[#DAA520]/20 bg-[#DAA520]/5",
            index === 3 && "border-[#8B4513]/20 bg-[#8B4513]/5",
            index === 4 && "border-[#4682B4]/20 bg-[#4682B4]/5",
          )}>
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <CardContent className="p-4">
              <h3 className="mb-1 text-center font-medium">{category.name}</h3>
              <p className="text-center text-xs text-muted-foreground">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}