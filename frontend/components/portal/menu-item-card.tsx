"use client";

import { useState } from "react";
import Image from "next/image";
import { getFallbackImage } from "@/lib/fallback-images";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemCardProps {
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
  tags?: string[];
}

export default function MenuItemCard({
  name,
  description,
  price,
  category = "",
  imageUrl,
  available = true,
  tags = [],
}: MenuItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(category, name);

  // Use the provided image URL or fallback to our category-based image
  const displayImageUrl = imageUrl && !imageError ? imageUrl : fallbackImage;

  // Determine if we're using a fallback image
  const isUsingFallback = !imageUrl || imageError;

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={displayImageUrl}
          alt={name}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />

        {/* Image placeholder indicator */}
        {(!imageUrl || imageError) && (
          <div className="absolute top-2 right-2 z-10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white/80 p-1 rounded-full">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Placeholder image. Update in dashboard.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute bottom-2 right-2">
          <Badge className="bg-white/90 text-black font-bold px-2 py-1">
            ${price.toFixed(2)}
          </Badge>
        </div>

        {/* Category badge if available */}
        {category && (
          <div className="absolute bottom-2 left-2">
            <Badge
              variant="outline"
              className="bg-white/90 text-gray-700 px-2 py-1"
            >
              {category}
            </Badge>
          </div>
        )}

        {/* Availability indicator */}
        {!available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
