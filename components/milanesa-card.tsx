"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { VegetarianBadge } from "@/components/vegetarian-badge"

interface MilanesaCardProps {
  id: string
  name: string
  description: string
  price: number
  image?: string
  isVegetarian?: boolean
  optional?: string
  childPortion?: {
    price: number
    description?: string
  }
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function MilanesaCard({
  id,
  name,
  description,
  price,
  image,
  isVegetarian = false,
  optional,
  childPortion,
  isAdmin = false,
  onEdit,
}: MilanesaCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit(id)
    }
  }

  return (
    <Link href={`/product/${id}`} className="block w-full">
      <div className="bg-[#e0f2e9] rounded-xl overflow-hidden shadow-sm w-full relative transition-transform hover:shadow-md hover:-translate-y-1">
        {isAdmin && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/80 hover:bg-white text-lacapke-charcoal rounded-full shadow-sm"
            onClick={handleEditClick}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-col md:flex-row">
          {image && (
            <div className="relative h-48 md:h-auto md:w-2/5 md:aspect-square">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lacapke-charcoal text-lg font-open-sans">{name}</h3>
              {isVegetarian && <VegetarianBadge className="h-5 w-5 ml-2" />}
            </div>

            <p className="text-lacapke-charcoal/80 text-sm mb-3">{description}</p>

            {optional && (
              <div className="bg-white/50 rounded-lg p-2 mb-3">
                <p className="text-lacapke-charcoal/80 text-xs">
                  <span className="font-semibold">Opcional:</span> {optional}
                </p>
              </div>
            )}

            <div className="mt-auto">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lacapke-charcoal text-lg font-open-sans">$ {price}</span>
              </div>

              {childPortion && (
                <div className="mt-2 pt-2 border-t border-lacapke-charcoal/10">
                  <div className="flex justify-between items-center">
                    <span className="text-lacapke-charcoal/80 text-xs">{childPortion.description}</span>
                    <span className="font-bold text-lacapke-charcoal text-sm font-open-sans">
                      $ {childPortion.price}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
