"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/lib/products"

interface ImageCarouselProps {
  products: Product[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function ImageCarousel({ products, autoPlay = true, autoPlayInterval = 5000, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoPlay = () => {
    if (autoPlay && products.length > 1) {
      autoPlayRef.current = setInterval(() => {
        if (!isHovering) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
        }
      }, autoPlayInterval)
    }
  }

  const stopAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = null
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [isHovering, products.length])

  const goToPrevious = () => {
    stopAutoPlay()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1))
    startAutoPlay()
  }

  const goToNext = () => {
    stopAutoPlay()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    startAutoPlay()
  }

  const goToSlide = (index: number) => {
    stopAutoPlay()
    setCurrentIndex(index)
    startAutoPlay()
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-xl", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[16/9] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link href={`/product/${products[currentIndex].id}`}>
              <div className="relative h-full w-full">
                <Image
                  src={products[currentIndex].image || "/placeholder.svg"}
                  alt={products[currentIndex].name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{products[currentIndex].name}</h3>
                  <p className="text-sm line-clamp-2">{products[currentIndex].description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-lg">$ {products[currentIndex].price}</span>
                    {products[currentIndex].isNew && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Nuevo</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-lacapke-charcoal"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-lacapke-charcoal"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 p-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
