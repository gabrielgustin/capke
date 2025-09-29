"use client"
import { useRef, useEffect, useState } from "react"
import { FoodCategory } from "@/components/food-category"
import type { ProductCategory } from "@/lib/products"

interface CategoryCarouselProps {
  categories: {
    id: ProductCategory
    name: string
  }[]
  activeCategory: ProductCategory
  onCategoryChange: (category: ProductCategory) => void
}

export function StickyCategoryCarousel({ categories, activeCategory, onCategoryChange }: CategoryCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFixed, setIsFixed] = useState(false)
  const [spacerHeight, setSpacerHeight] = useState(0)
  const [originalTop, setOriginalTop] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const calculateHeight = () => {
      if (containerRef.current) {
        return containerRef.current.offsetHeight
      }
      return 0
    }

    const rect = containerRef.current.getBoundingClientRect()
    const offsetTop = rect.top + window.scrollY
    setOriginalTop(offsetTop)

    const handleScroll = () => {
      const scrollY = window.scrollY

      if (scrollY > offsetTop) {
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

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isFixed, originalTop])

  // Auto-centrar la categoría activa en el carrusel
  useEffect(() => {
    if (!carouselRef.current) return

    const activeButton = carouselRef.current.querySelector(`[data-category-id="${activeCategory}"]`) as HTMLElement

    if (activeButton && carouselRef.current) {
      const carousel = carouselRef.current
      const buttonRect = activeButton.getBoundingClientRect()
      const carouselRect = carousel.getBoundingClientRect()

      const buttonCenter = buttonRect.left + buttonRect.width / 2 - carouselRect.left
      const carouselCenter = carouselRect.width / 2
      const scrollOffset = buttonCenter - carouselCenter

      carousel.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      })
    }
  }, [activeCategory])

  return (
    <>
      <div ref={containerRef} className="relative w-full">
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
          <div className="container-app py-1 pb-0 pt-0">
            <div
              className="overflow-x-auto pb-2 hide-scrollbar carousel-container"
              id="categories-carousel"
              ref={carouselRef}
            >
              <div className="flex space-x-3 min-w-max px-0">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    data-category-id={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus:border-0 active:outline-none hover:outline-none outline-none border-none rounded-xl w-20 flex-shrink-0"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    aria-label={`Seleccionar categoría ${category.name}`}
                    aria-pressed={activeCategory === category.id}
                  >
                    <FoodCategory
                      title={category.name}
                      iconType={category.id}
                      isActive={activeCategory === category.id}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFixed && <div style={{ height: `${spacerHeight}px` }} />}
    </>
  )
}
