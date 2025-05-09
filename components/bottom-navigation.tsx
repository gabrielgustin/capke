"use client"

import { Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface BottomNavigationProps {
  cartItemCount?: number
  cartAnimation?: boolean
}

export function BottomNavigation({ cartItemCount = 0, cartAnimation = false }: BottomNavigationProps) {
  const [screenWidth, setScreenWidth] = useState(0)
  const pathname = usePathname()
  const [isProductDetailPage, setIsProductDetailPage] = useState(false)
  const [showCartBadge, setShowCartBadge] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)

  // Efecto para determinar si estamos en una página de detalle de producto
  useEffect(() => {
    setIsProductDetailPage(pathname?.startsWith("/product/") || false)
  }, [pathname])

  // Efecto para actualizar el ancho de pantalla
  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    // Establecer el ancho inicial
    updateScreenWidth()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", updateScreenWidth)

    // Limpiar listener
    return () => window.removeEventListener("resize", updateScreenWidth)
  }, [])

  // Efecto para mostrar el badge del carrito si hay items
  useEffect(() => {
    setShowCartBadge(cartItemCount > 0)
  }, [cartItemCount])

  // Efecto para la animación cuando se agrega un producto
  useEffect(() => {
    if (cartAnimation) {
      setAnimateCart(true)
      const timer = setTimeout(() => {
        setAnimateCart(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cartAnimation])

  // Función para determinar la visibilidad basada en el ancho de pantalla
  const getNavStyles = () => {
    // Si es pantalla grande (>=1024px), ocultar completamente
    if (screenWidth >= 1024) {
      return { display: "none" }
    }

    // Si es pantalla mediana (entre 768px y 1024px), reducir gradualmente la opacidad
    if (screenWidth >= 768) {
      const opacity = 1 - ((screenWidth - 768) / (1024 - 768)) * 0.7 // Reducir opacidad gradualmente
      return { opacity: opacity }
    }

    // Pantalla pequeña, visibilidad completa
    return { opacity: 1 }
  }

  // Si estamos en una página de detalle de producto, no mostrar la navegación
  if (isProductDetailPage) {
    return null
  }

  // Actualizar la aplicación de estilos en el div del navbar
  const navStyles = getNavStyles()

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-lacapke-charcoal/10 flex justify-around items-center py-3 z-50 transition-all duration-300"
      style={{
        ...navStyles,
      }}
    >
      <Link href="/">
        <Button variant="ghost" size="icon" className="text-lacapke-charcoal hover:bg-lacapke-background rounded-2xl">
          <Home className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/cart">
        <Button
          variant="ghost"
          size="icon"
          className="text-lacapke-charcoal hover:bg-lacapke-background rounded-2xl relative"
        >
          <div className={`relative ${animateCart ? "animate-bounce" : ""}`}>
            <ShoppingBag className="h-5 w-5" />
            {showCartBadge && (
              <span
                className={`absolute -top-2 -right-2 bg-[#f8e1e1] text-lacapke-charcoal text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center ${animateCart ? "scale-125" : ""} transition-transform`}
              >
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </div>
        </Button>
      </Link>
    </div>
  )
}
