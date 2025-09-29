"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, ArrowLeft, Share2 } from "lucide-react"
import { SideMenu } from "./side-menu"
import { ShareMenu } from "./share-menu"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Determinar si estamos en la página del menú
  const isMenuPage = pathname === "/menu"
  // Determinar si estamos en una página de producto
  const isProductPage = pathname?.startsWith("/product/")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleBack = () => {
    router.back()
  }

  const handleShare = () => {
    setIsShareMenuOpen(true)
  }

  // Asegurar que el menú se cierre al navegar
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
      setIsShareMenuOpen(false)
    }

    // Escuchar cambios de ruta
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  // Obtener información del producto para compartir
  const getShareInfo = () => {
    const productId = pathname?.split("/").pop()
    return {
      title: "Producto de La Capke",
      url: typeof window !== "undefined" ? window.location.href : "",
    }
  }

  const shareInfo = getShareInfo()

  return (
    <>
      {/* Header superior con logos */}
      <header className="bg-white w-full py-3 md:py-5 px-4 md:px-5 shadow-md">
        <div className="flex items-center justify-between relative my-0.5">
          <div className="flex items-center gap-3">
            <button
              className="text-lacapke-charcoal hover:opacity-80 transition-opacity"
              onClick={toggleMenu}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
            >
              <Menu size={30} strokeWidth={2.5} className="md:w-9 md:h-9" />
            </button>
            <div className="relative w-16 h-8 md:w-20 md:h-10">
              <Image
                src="/finall.png"
                alt="La Capke"
                fill
                style={{ objectFit: "contain" }}
                className="brightness-110"
              />
            </div>
            <div className="w-8 md:w-10"></div> {/* Spacer para equilibrar el menú */}
          </div>
          <Link href="/" className="text-center transform hover:scale-105 transition-transform"></Link>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-24 h-12 md:w-32 md:h-16 hidden md:block">
            <Image src="/images/design-mode/logito.png" alt="Autogestiva Logo" fill style={{ objectFit: "contain" }} />
          </div>
        </div>
      </header>

      {/* Header azul para página de menú y producto */}
      {(isMenuPage || isProductPage) && (
        <div className="bg-[#0A4D8F] w-full px-4 shadow-md py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isProductPage && (
                <button
                  onClick={handleBack}
                  className="text-white hover:opacity-80 transition-opacity"
                  aria-label="Volver atrás"
                >
                  <ArrowLeft size={24} />
                </button>
              )}
              <h1 className="text-white text-2xl md:text-2xl font-normal" style={{ fontFamily: "var(--font-anton)" }}>
                {isMenuPage ? "Categorías" : "Producto"}
              </h1>
            </div>
            {isProductPage && (
              <button
                onClick={handleShare}
                className="bg-white text-tupedido-blue px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center text-sm md:text-base hover:opacity-90 transition-opacity"
                aria-label="Compartir producto"
              >
                <Share2 className="mr-1 md:mr-2" size={18} />
                <span
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
                    fontWeight: 600,
                  }}
                >
                  Compartir
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menú lateral */}
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Menú de compartir */}
      <ShareMenu
        isOpen={isShareMenuOpen}
        onClose={() => setIsShareMenuOpen(false)}
        productTitle={shareInfo.title}
        productUrl={shareInfo.url}
      />
    </>
  )
}
