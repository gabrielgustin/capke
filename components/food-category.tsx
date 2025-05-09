"use client"

import { Coffee, Sandwich, Cake, Croissant, Utensils } from "lucide-react"
import { motion } from "framer-motion"

interface FoodCategoryProps {
  title: string
  iconType: "breakfast" | "brunch" | "lunch" | "desserts" | "bakery" | "coffee"
  isActive?: boolean
}

export function FoodCategory({ title, iconType, isActive = false }: FoodCategoryProps) {
  const renderIcon = () => {
    switch (iconType) {
      case "breakfast":
        return <Coffee className="h-6 w-6 text-lacapke-charcoal" />
      case "lunch":
        return <Utensils className="h-6 w-6 text-lacapke-charcoal" />
      case "brunch":
        return <Sandwich className="h-6 w-6 text-lacapke-charcoal" />
      case "desserts":
        return <Cake className="h-6 w-6 text-lacapke-charcoal" />
      case "bakery":
        return <Croissant className="h-6 w-6 text-lacapke-charcoal" />
      case "coffee":
        return <Coffee className="h-6 w-6 text-lacapke-charcoal" />
      default:
        return <Coffee className="h-6 w-6 text-lacapke-charcoal" />
    }
  }

  return (
    <div className="flex flex-col items-center w-16">
      <motion.div
        className={`rounded-full w-12 h-12 flex items-center justify-center ${
          isActive ? "bg-lacapke-cream border-2 border-lacapke-accent" : "bg-lacapke-cream/80"
        }`}
        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {renderIcon()}
      </motion.div>
      <motion.span
        className="text-[10px] font-medium text-lacapke-charcoal text-center mt-1 w-full h-8 flex items-center justify-center leading-tight"
        animate={isActive ? { fontWeight: 700 } : { fontWeight: 500 }}
      >
        {title}
      </motion.span>
    </div>
  )
}
