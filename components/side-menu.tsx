"use client"

import { useState, useEffect } from "react"
import { Home, MapPin, Globe, Instagram, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAuthState, logout, type User as AuthUser } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)

  // Asegurar que el menú esté cerrado al montar el componente
  useEffect(() => {
    if (isOpen) {
      // Solo ejecutar efectos si el menú debe estar abierto
      // Cargar usuario
      const authUser = getAuthState()
      if (authUser) {
        setUser(authUser)
      }

      // Cargar carrito
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          const totalItems = parsedCart.reduce((sum: number, item: any) => sum + item.quantity, 0)
          setCartItemCount(totalItems)
        } catch (e) {
          console.error("Error parsing cart from localStorage", e)
        }
      }
    }
  }, [isOpen])

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setUser(null)
    onClose()
  }

  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
    setShowLoginForm(false)
  }

  const isAdmin = user?.username === "Admin1"

  return (
    <>
      {/* Overlay oscuro */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menú lateral */}
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[#0A4D8F] z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Contenido del menú */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <nav className="space-y-6">
              <Link
                href="/"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <Home className="mr-4" size={24} />
                <span>Inicio</span>
              </Link>

              <Link
                href="/menu"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <MapPin className="mr-4" size={24} />
                <span>Ubicación</span>
              </Link>

              <a
                href="https://lacapke.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <Globe className="mr-4" size={24} />
                <span>Sitio web</span>
              </a>

              <a
                href="https://instagram.com/lacapke"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white text-xl font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                <Instagram className="mr-4" size={24} />
                <span>Instagram</span>
              </a>
            </nav>
          </div>

          {/* Sección inferior */}
          <div className="mt-auto">
            {/* Mensaje promocional */}
            <div className="bg-[#0A4D8F] p-6 text-center border-t border-blue-600">
              <p className="text-white font-bold leading-tight">
                ¡Quiero una tienda así para mi emprendimiento!
              </p>
            </div>

            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="w-full bg-[#f5f5f7] py-4 text-[#0A4D8F] font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de inicio de sesión */}
      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 text-lacapke-charcoal z-20 bg-white rounded-full"
              onClick={() => setShowLoginForm(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  )
}
