"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { VegetarianBadge } from "@/components/vegetarian-badge"

interface PopCakeCardProps {
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function PopCakeCard({ isAdmin = false, onEdit }: PopCakeCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit("pop-cake")
    }
  }

  return (
    <Link href="/product/pop-cake" className="block w-full">
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

        <div className="flex flex-col">
          <div className="relative h-40 sm:h-48 w-full">
            <Image src="/pop-cake.jpg" alt="Pop Cake" fill className="object-cover" />
          </div>
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lacapke-charcoal text-sm sm:text-base lg:text-lg font-open-sans">
                Pop Cake
              </h3>
              <VegetarianBadge className="h-5 w-5" />
            </div>
            <p className="text-lacapke-charcoal/80 text-xs sm:text-sm mb-2">
              Deliciosos cake pops en colores pastel con sprinkles. Sabores: vainilla, chocolate y frutilla.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-lacapke-charcoal/70">Porción x3</span>
              <span className="font-bold text-lacapke-charcoal text-sm sm:text-base font-open-sans">$ 4500</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
