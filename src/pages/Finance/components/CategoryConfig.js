import {
  Car, Film, Zap, Heart, ShoppingCart, PiggyBank, Package, UtensilsCrossed,
  Home, Coffee, Plane, Laptop, ArrowUpRight, ArrowDownRight, Briefcase,
  Smile, Gift, Book, Music, Scissors, Wrench, Bus, Camera
} from 'lucide-react'

// Master registry of icons available for users to pick when creating a category
export const ICON_REGISTRY = {
  UtensilsCrossed, Car, Film, Zap, Heart, ShoppingCart, PiggyBank, Package,
  Home, Coffee, Plane, Laptop, ArrowUpRight, ArrowDownRight, Briefcase,
  Smile, Gift, Book, Music, Scissors, Wrench, Bus, Camera
}

// Predefined colors for the user to choose from — worn, muted tones (dried
// blood, ash, faded ink) to match the app's ink-and-cursed-energy palette,
// rather than bright candy accents.
export const COLOR_PALETTE = [
  '#6B2B2B', '#5C3A1E', '#4A4A1E', '#2E4A2E', '#1E4A4A',
  '#2E3A6B', '#4A2E6B', '#6B2E4A', '#7C3AED', '#38BDF8',
  '#B91C1C', '#C2872A', '#9D5C7C', '#4A4A5A'
]

/**
 * Utility to get an Icon component by its string name.
 * If not found, returns 'Package' as a fallback.
 */
export const getIconComponent = (iconName) => {
  return ICON_REGISTRY[iconName] || Package;
}
