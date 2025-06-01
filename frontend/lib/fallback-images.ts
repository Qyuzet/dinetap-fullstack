// Fallback images for different menu categories

// Function to get a fallback image based on category or item name
export function getFallbackImage(
  category: string = "",
  itemName: string = ""
): string {
  // Normalize inputs to lowercase for easier matching
  const normalizedCategory = category.toLowerCase();
  const normalizedName = itemName.toLowerCase();

  // Check for specific categories first
  if (
    normalizedCategory.includes("appetizer") ||
    normalizedCategory.includes("starter") ||
    normalizedName.includes("appetizer") ||
    normalizedName.includes("starter")
  ) {
    return "/images/fallback/appetizer.jpg";
  }

  if (normalizedCategory.includes("soup") || normalizedName.includes("soup")) {
    return "/images/fallback/soup.jpg";
  }

  if (
    normalizedCategory.includes("salad") ||
    normalizedName.includes("salad")
  ) {
    return "/images/fallback/salad.jpg";
  }

  if (
    normalizedCategory.includes("burger") ||
    normalizedName.includes("burger")
  ) {
    return "/images/fallback/burger.jpg";
  }

  if (
    normalizedCategory.includes("steak") ||
    normalizedName.includes("steak")
  ) {
    return "/images/fallback/steak.jpg";
  }

  if (normalizedCategory.includes("beef") || normalizedName.includes("beef")) {
    return "/images/fallback/steak.jpg";
  }

  if (
    normalizedCategory.includes("pizza") ||
    normalizedName.includes("pizza")
  ) {
    return "/images/fallback/pizza.jpg";
  }

  if (
    normalizedCategory.includes("chicken") ||
    normalizedName.includes("chicken")
  ) {
    return "/images/fallback/chicken.jpg";
  }

  if (
    normalizedCategory.includes("seafood") ||
    normalizedName.includes("fish") ||
    normalizedName.includes("shrimp") ||
    normalizedName.includes("seafood")
  ) {
    return "/images/fallback/seafood.jpg";
  }

  if (
    normalizedCategory.includes("pasta") ||
    normalizedName.includes("pasta") ||
    normalizedName.includes("noodle") ||
    normalizedName.includes("spaghetti")
  ) {
    return "/images/fallback/pasta.jpg";
  }

  if (normalizedCategory.includes("rice") || normalizedName.includes("rice")) {
    return "/images/fallback/rice.jpg";
  }

  if (
    normalizedCategory.includes("dessert") ||
    normalizedName.includes("cake") ||
    normalizedName.includes("ice cream") ||
    normalizedName.includes("sweet") ||
    normalizedName.includes("chocolate") ||
    normalizedName.includes("pastry")
  ) {
    return "/images/fallback/dessert.jpg";
  }

  if (
    normalizedCategory.includes("beverage") ||
    normalizedCategory.includes("drink") ||
    normalizedName.includes("tea") ||
    normalizedName.includes("coffee") ||
    normalizedName.includes("juice") ||
    normalizedName.includes("soda") ||
    normalizedName.includes("water") ||
    normalizedName.includes("cocktail")
  ) {
    return "/images/fallback/beverage.jpg";
  }

  // Default fallback image if no specific category is matched
  return "/images/fallback/default-food.jpg";
}

// Array of all fallback image paths for preloading
export const fallbackImagePaths = [
  "/images/fallback/appetizer.jpg",
  "/images/fallback/soup.jpg",
  "/images/fallback/salad.jpg",
  "/images/fallback/burger.jpg",
  "/images/fallback/steak.jpg",
  "/images/fallback/pizza.jpg",
  "/images/fallback/chicken.jpg",
  "/images/fallback/seafood.jpg",
  "/images/fallback/pasta.jpg",
  "/images/fallback/rice.jpg",
  "/images/fallback/dessert.jpg",
  "/images/fallback/beverage.jpg",
  "/images/fallback/default-food.jpg",
];
