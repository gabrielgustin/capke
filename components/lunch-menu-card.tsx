"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VegetarianBadge } from "@/components/vegetarian-badge"

interface LunchMenuCardProps {
  id: string
  name: string
  description: string
  price: number
  image?: string
  isVegetarian?: boolean
  hasDoubleVegetarian?: boolean
  optional?: string
  variants?: Array<{
    name: string
    price: number
  }>
  isAdmin?: boolean
  onEdit?: (id: string) => void
  layout?: "with-image" | "text-only"
}

export function LunchMenuCard({
  id,
  name,
  description,
  price,
  image,
  isVegetarian = false,
  hasDoubleVegetarian = false,
  optional,
  variants,
  isAdmin = false,
  onEdit,
  layout = "text-only",
}: LunchMenuCardProps) {
  const formattedId = id.toLowerCase().replace(/\s+/g, "-")

  // Función para manejar el clic en el botón de edición
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  // Diseño con imagen a la izquierda
  if (layout === "with-image" && image) {
    return (
      <Link href={`/product/${formattedId}`} className="block h-full">
        <div className="bg-lacapke-cream rounded-xl overflow-hidden shadow-sm h-full relative transition-transform hover:shadow-md hover:-translate-y-1">
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

          <div className="flex flex-col md:flex-row">
            <div className="relative h-40 md:h-auto md:w-1/2 lg:w-2/5 p-2 md:p-3">
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={name}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            </div>
            <div className="p-3 md:p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lacapke-charcoal text-xs sm:text-sm lg:text-base font-open-sans mb-0.5">
                {name}
              </h3>
              <p className="text-lacapke-charcoal/80 text-[10px] sm:text-xs lg:text-xs line-clamp-3 mb-1">
                {description}
              </p>

              {optional && (
                <p className="text-lacapke-charcoal/80 text-[10px] sm:text-xs lg:text-xs mb-1">
                  <span className="font-medium">Opcional:</span> {optional}
                </p>
              )}

              {variants && variants.length > 0 && (
                <div className="space-y-0.5 sm:space-y-1 mt-1 mb-1">
                  {variants.map((variant, index) => (
                    <div key={index} className="flex justify-between text-xs lg:text-sm">
                      <span className="text-lacapke-charcoal font-bold text-xs lg:text-sm">{variant.name}</span>
                      <div className="flex items-center">
                        <div className="border-b border-dotted border-lacapke-charcoal/30 flex-grow mx-1 sm:mx-2 w-8 sm:w-12 lg:w-16"></div>
                        <span className="font-bold text-lacapke-charcoal font-open-sans text-xs lg:text-sm">
                          $ {variant.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-1 sm:pt-2 flex">
                <div className="flex items-center space-x-1">
                  {isVegetarian && <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />}
                  {hasDoubleVegetarian && <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Diseño solo texto (predeterminado)
  return (
    <Link href={`/product/${formattedId}`} className="block h-full">
      <div className="bg-lacapke-cream rounded-xl overflow-hidden shadow-sm h-full flex flex-col p-2 sm:p-3 lg:p-4 relative transition-transform hover:shadow-md hover:-translate-y-1">
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

        <h3 className="font-bold text-lacapke-charcoal text-xs sm:text-sm lg:text-base font-open-sans mb-0.5">
          {name}
        </h3>
        <p className="text-lacapke-charcoal/80 text-[10px] sm:text-xs lg:text-xs line-clamp-3 mb-1">{description}</p>

        {optional && (
          <p className="text-lacapke-charcoal/80 text-[10px] sm:text-xs lg:text-xs mb-1">
            <span className="font-medium">Opcional:</span> {optional}
          </p>
        )}

        {variants && variants.length > 0 && (
          <div className="space-y-0.5 sm:space-y-1 mt-1 mb-1">
            {variants.map((variant, index) => (
              <div key={index} className="flex justify-between text-xs lg:text-sm">
                <span className="text-lacapke-charcoal font-bold text-xs lg:text-sm">{variant.name}</span>
                <div className="flex items-center">
                  <div className="border-b border-dotted border-lacapke-charcoal/30 flex-grow mx-1 sm:mx-2 w-8 sm:w-12 lg:w-16"></div>
                  <span className="font-bold text-lacapke-charcoal font-open-sans text-xs lg:text-sm">
                    $ {variant.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-1 sm:pt-2 flex">
          <div className="flex items-center space-x-1">
            {isVegetarian && <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />}
            {hasDoubleVegetarian && <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />}
          </div>
        </div>
      </div>
    </Link>
  )
}
