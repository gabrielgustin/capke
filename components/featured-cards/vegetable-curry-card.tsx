"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { VegetarianBadge } from "@/components/vegetarian-badge"
import { NewItemBadge } from "@/components/new-item-badge"

interface VegetableCurryCardProps {
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function VegetableCurryCard({ isAdmin = false, onEdit }: VegetableCurryCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit("vegetable-curry")
    }
  }

  return (
    <Link href="/product/vegetable-curry" className="block w-full">
      <div className="bg-[#f8f5d7] rounded-xl overflow-hidden shadow-sm w-full relative transition-transform hover:shadow-md hover:-translate-y-1">
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white text-lacapke-charcoal rounded-full shadow-sm"
            onClick={handleEditClick}
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}

        <div className="absolute top-2 left-2 z-10">
          <NewItemBadge />
        </div>

        <div className="flex flex-col">
          <div className="relative h-48 w-full">
            <Image src="/vegetable-curry.png" alt="Curry de Vegetales" fill className="object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lacapke-charcoal text-lg font-open-sans">Curry de Vegetales</h3>
              <VegetarianBadge className="h-5 w-5" />
            </div>
            <p className="text-lacapke-charcoal/80 text-sm mb-2">
              Curry aromático con brócoli, zanahorias, coliflor, arvejas y pimientos, servido con arroz basmati.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-lacapke-charcoal/70">Opción vegana disponible</span>
              <span className="font-bold text-lacapke-charcoal text-base font-open-sans">$ 11800</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
