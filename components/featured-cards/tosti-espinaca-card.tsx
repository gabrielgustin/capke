"use client"

import type React from "react"

import Link from "next/link"
import { Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VegetarianBadge } from "@/components/vegetarian-badge"
import { motion } from "framer-motion"
import { cardAnimation } from "@/lib/animation-utils"
import { ProductImage } from "@/components/product-image"

interface TostiEspinacaCardProps {
  isAdmin?: boolean
  onEdit?: (id: string) => void
}

export function TostiEspinacaCard({ isAdmin = false, onEdit }: TostiEspinacaCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onEdit) {
      onEdit("tosti-espinaca-champis")
    }
  }

  return (
    <Link href="/product/tosti-espinaca-champis" className="block h-full">
      <motion.div
        className="bg-lacapke-cream rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative"
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={cardAnimation}
      >
        {/* Botón de edición para administradores */}
        {isAdmin && (
          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 h-7 w-7 sm:h-8 sm:w-8 bg-white/80 hover:bg-white text-lacapke-charcoal rounded-full shadow-sm"
              onClick={handleEditClick}
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </motion.div>
        )}

        <div className="relative h-24 sm:h-28 lg:h-40 w-full p-1 sm:p-2">
          <motion.div
            className="relative h-full w-full rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <ProductImage
              src="/tosti-espinaca-champis-new.png"
              alt="Tosti de Espinaca y Champis"
              fill
              priority={true}
              className="object-cover"
            />
          </motion.div>
        </div>
        <div className="p-2 py-1.5 sm:p-3 sm:py-2 lg:p-4 flex flex-col flex-grow">
          {/* Título en la parte superior */}
          <motion.h3
            className="font-bold text-lacapke-charcoal text-xs sm:text-sm lg:text-base font-open-sans mb-0.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Tosti de Espinaca y Champis
          </motion.h3>

          {/* Descripción del producto */}
          <motion.p
            className="text-lacapke-charcoal/80 text-[10px] sm:text-xs lg:text-xs line-clamp-2 mb-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Sándwich en pan de masa madre, espinaca y champiñones salteados en aceite infusionado en ajo con queso
            muzzarella.
          </motion.p>

          {/* Logo y precio en la parte inferior */}
          <motion.div
            className="mt-auto pt-1 sm:pt-2 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Ícono vegetariano en la parte inferior izquierda */}
            <div className="relative">
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />
              </motion.div>
            </div>

            {/* Precio en la parte inferior derecha */}
            <motion.span
              className="font-bold text-lacapke-charcoal text-xs sm:text-sm lg:text-base font-open-sans"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              $ 8200
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}
