"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/products"

interface RefreshDataButtonProps {
  onRefresh: (products: any[]) => void
  className?: string
}

export function RefreshDataButton({ onRefresh, className = "" }: RefreshDataButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Pequeño retraso para mostrar la animación
    setTimeout(() => {
      // Obtener los productos actualizados
      const updatedProducts = getProducts()
      onRefresh(updatedProducts)

      setIsRefreshing(false)
    }, 600)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={`border-lacapke-charcoal/20 text-lacapke-charcoal ${className}`}
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Actualizando..." : "Actualizar datos"}
    </Button>
  )
}
