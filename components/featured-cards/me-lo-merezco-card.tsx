"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
interface MeLoMerezcoCardProps {
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function MeLoMerezcoCard({ isAdmin = false, onEdit }: MeLoMerezcoCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit("me-lo-merezco")
    }
  }

  return (
    <Link href="/product/me-lo-merezco" className="block w-full">
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

        <div className="relative h-40 sm:h-48 lg:h-56 w-full">
          <Image src="/me-lo-merezco.png" alt="Me lo merezco" fill className="object-cover" />
        </div>
        <div className="p-3 sm:p-4 flex flex-col h-full">
          <h3 className="font-bold text-lacapke-charcoal text-sm sm:text-lg lg:text-xl font-open-sans mb-2">
            Me lo merezco
          </h3>

          <p className="text-lacapke-charcoal/80 text-xs sm:text-sm">
            Torre de tres platos para compartir entre 2 personas
          </p>

          {/* Precio en la parte inferior derecha */}
          <div className="mt-auto pt-1 sm:pt-2 flex justify-end items-center">
            <span className="font-bold text-lacapke-charcoal text-xs sm:text-sm lg:text-base font-open-sans">
              $ 22000
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
