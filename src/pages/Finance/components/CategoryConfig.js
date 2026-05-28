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

// Predefined colors for the user to choose from
export const COLOR_PALETTE = [
  '#f59e0b', '#60a5fa', '#7c6af7', '#f87171', '#ec4899', 
  '#fb923c', '#14b8a6', '#8b5cf6', '#0ea5e9', '#64748b', 
  '#34d399', '#10b981', '#059669', '#f43f5e'
]

/**
 * Utility to get an Icon component by its string name.
 * If not found, returns 'Package' as a fallback.
 */
export const getIconComponent = (iconName) => {
  return ICON_REGISTRY[iconName] || Package;
}
