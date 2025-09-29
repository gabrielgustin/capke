"use client"

import Link from "next/link"
import { Home, ShoppingBag } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface BottomNavigationProps {
  cartItemCount?: number
  cartAnimation?: boolean
  isShareMenuOpen?: boolean
}

export function BottomNavigation({
  cartItemCount = 0,
  cartAnimation = false,
  isShareMenuOpen = false,
}: BottomNavigationProps) {
  const pathname = usePathname()
  const [isProductDetailPage, setIsProductDetailPage] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)

  // Determinar si estamos en una página de detalle de producto
  useEffect(() => {
    setIsProductDetailPage(pathname?.startsWith("/product/") || false)
  }, [pathname])

  // Animación cuando se agrega un producto
  useEffect(() => {
    if (cartAnimation) {
      setAnimateCart(true)
      const timer = setTimeout(() => setAnimateCart(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [cartAnimation])

  // No mostrar en páginas de detalle de producto
  if (isProductDetailPage) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 lg:hidden">
      {/* Espacio transparente */}
      <div className="h-[15px] bg-transparent"></div>

      {/* Navbar */}
      <nav
        className="py-3 px-5 shadow-lg transition-all duration-300"
        style={{
          backgroundColor: isShareMenuOpen ? "rgba(0, 0, 0, 0.5)" : "#f5f5f7",
        }}
      >
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center">
            <Home size={26} strokeWidth={2.5} className="text-[#0A4D8F]" />
          </Link>
          <Link href="/cart" className="flex flex-col items-center relative">
            <div className={`relative ${animateCart ? "animate-bounce" : ""}`}>
              <ShoppingBag size={26} strokeWidth={2.5} className="text-[#0A4D8F]" />
              {cartItemCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-[#0A4D8F] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ${animateCart ? "scale-125" : ""} transition-transform`}
                >
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}
