"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface LocationCardProps {
  name: string
  address: string
  image: string
}

export function LocationCard({ name, address, image }: LocationCardProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // Navegar al menú
    router.push("/menu")

    // Asegurar que la página se posicione en la parte superior
    window.scrollTo({
      top: 0,
      behavior: "auto", // Usar "auto" en lugar de "smooth" para un posicionamiento inmediato
    })
  }

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="border border-lacapke-charcoal/10 rounded-xl overflow-hidden hover:border-lacapke-accent/30 transition-colors">
        <div className="relative aspect-square w-full bg-white p-2 sm:p-4">
          <div className="relative h-full w-full">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain p-2 sm:p-4" />
          </div>
        </div>
        <CardContent className="p-3 sm:p-4 bg-lacapke-cream/50">
          <h3 className="text-base sm:text-xl font-bold text-lacapke-charcoal">{name}</h3>
          <p className="text-xs sm:text-sm text-lacapke-charcoal/70">{address}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
