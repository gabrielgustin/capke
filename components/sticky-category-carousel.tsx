"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FoodCategory } from "@/components/food-category"
import type { ProductCategory } from "@/lib/products"

interface CategoryCarouselProps {
  categories: {
    id: ProductCategory
    name: string
  }[]
  activeCategory: ProductCategory
  onCategoryChange: (category: ProductCategory) => void
  rightIcon?: React.ReactNode
}

export function StickyCategoryCarousel({
  categories,
  activeCategory,
  onCategoryChange,
  rightIcon,
}: CategoryCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFixed, setIsFixed] = useState(false)
  const [spacerHeight, setSpacerHeight] = useState(0)
  const [originalTop, setOriginalTop] = useState(0)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const checkForOverflow = () => {
    if (carouselRef.current) {
      const hasHorizontalOverflow = carouselRef.current.scrollWidth > carouselRef.current.clientWidth
      setHasOverflow(hasHorizontalOverflow)
    }
  }

  // Efecto para calcular la posición original y configurar el observer
  useEffect(() => {
    if (!containerRef.current) return

    // Marcar como inicializado después de un breve retraso
    const initTimer = setTimeout(() => {
      setIsInitialized(true)
    }, 500)

    // Calcular la altura del carrusel para el espaciador
    const calculateHeight = () => {
      if (containerRef.current) {
        return containerRef.current.offsetHeight
      }
      return 0
    }

    // Calcular la posición original una vez
    const rect = containerRef.current.getBoundingClientRect()
    const offsetTop = rect.top + window.scrollY
    setOriginalTop(offsetTop)

    // Función para manejar el scroll
    const handleScroll = () => {
      // Solo activar el comportamiento sticky después de la inicialización
      if (!isInitialized) return

      const scrollY = window.scrollY

      if (scrollY > originalTop) {
        if (!isFixed) {
          setIsFixed(true)
          setSpacerHeight(calculateHeight())
        }
      } else {
        if (isFixed) {
          setIsFixed(false)
          setSpacerHeight(0)
        }
      }
    }

    // Configurar el listener de scroll
    window.addEventListener("scroll", handleScroll)

    // Llamar una vez para configurar el estado inicial
    handleScroll()

    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(initTimer)
    }
  }, [isFixed, originalTop, isInitialized])

  useEffect(() => {
    // Verificar overflow inicial
    checkForOverflow()

    // Verificar overflow cuando cambia el tamaño de la ventana
    const handleResize = () => {
      checkForOverflow()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      {/* Contenedor principal que será reemplazado por el espaciador cuando esté fijo */}
      <div ref={containerRef} className="relative w-full">
        {/* El carrusel que se fijará */}
        <div
          className={`w-full bg-lacapke-background py-1 z-30 ${isFixed ? "fixed top-0 left-0 right-0 shadow-md" : ""}`}
          style={{
            position: isFixed ? "fixed" : "relative",
            top: isFixed ? 0 : "auto",
            left: isFixed ? 0 : "auto",
            right: isFixed ? 0 : "auto",
            zIndex: 30,
          }}
        >
          <div className="container-app py-1">
            <div className="text-center pt-1 mb-2">
              <h2 className="text-lg font-bold text-lacapke-charcoal">Categorías</h2>
            </div>

            <div
              className="overflow-x-auto pb-2 hide-scrollbar carousel-container"
              id="categories-carousel"
              ref={carouselRef}
            >
              <div className="flex space-x-3 min-w-max px-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-0 active:outline-none hover:outline-none outline-none border-none rounded-xl transition-all w-20 flex-shrink-0"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    aria-label={`Seleccionar categoría ${category.name}`}
                    aria-pressed={activeCategory === category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FoodCategory
                      title={category.name}
                      iconType={category.id}
                      isActive={activeCategory === category.id}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Espaciador para mantener el flujo del documento cuando el carrusel está fijo */}
      {isFixed && <div style={{ height: `${spacerHeight}px` }} />}
    </>
  )
}
