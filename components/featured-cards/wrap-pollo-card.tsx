"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { NewItemBadge } from "@/components/new-item-badge"

interface WrapPolloCardProps {
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function WrapPolloCard({ isAdmin = false, onEdit }: WrapPolloCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit("wrap-pollo")
    }
  }

  return (
    <Link href="/product/wrap-pollo" className="block w-full">
      <div className="bg-[#e0ebe5] rounded-xl overflow-hidden shadow-sm w-full relative transition-transform hover:shadow-md hover:-translate-y-1">
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

        <div className="flex flex-col md:flex-row">
          <div className="relative h-40 md:h-auto md:w-2/5 md:aspect-square">
            <Image src="/wrap-pollo.png" alt="Wrap de Pollo" fill className="object-cover" />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-lacapke-charcoal text-lg font-open-sans mb-2">Wrap de Pollo</h3>

            <p className="text-lacapke-charcoal/80 text-sm mb-3">
              Tortilla de wrap, mix de verdes, pollo marinado horneado, champiñones, cilantro, panceta, tomates asados,
              queso danbo, queso pategrás, aderezo de yogurt y pepino.
            </p>

            <div className="mt-auto">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lacapke-charcoal text-lg font-open-sans">$ 12500</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
