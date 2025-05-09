"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User, Home, PlusCircle, ShoppingBag } from "lucide-react"
import { logout } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

interface DesktopNavigationProps {
  user: any
  onLoginSuccess: (user: any) => void
  cartItemCount?: number
  cartAnimation?: boolean
}

export function DesktopNavigation({
  user,
  onLoginSuccess,
  cartItemCount = 0,
  cartAnimation = false,
}: DesktopNavigationProps) {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showCartBadge, setShowCartBadge] = useState(false)
  const [animateCart, setAnimateCart] = useState(false)

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

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  const isAdmin = user?.username === "Admin1"

  const handleLoginSuccess = () => {
    setShowLoginForm(false)
  }

  return (
    <>
      <div className="hidden lg:block w-full border-b border-lacapke-charcoal/10 bg-white sticky top-0 z-30">
        <div className="container-app py-3 relative">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center">
              <div className="relative h-14 w-40">
                <Image src="/logo-default.png" alt="La Capke" fill className="object-contain" priority />
              </div>
            </Link>
          </div>

          <div className="flex items-center justify-between">
            {/* Botones de navegación a la izquierda */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-lacapke-charcoal hover:text-lacapke-charcoal/80 font-medium flex items-center"
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Link>
              <Link href="/menu" className="text-lacapke-charcoal hover:text-lacapke-charcoal/80 font-medium">
                Menú
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-lacapke-charcoal hover:text-lacapke-charcoal/80 font-medium flex items-center"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Administrar
                </Link>
              )}
            </div>

            {/* Elementos de la derecha (carrito, usuario, etc.) */}
            <div className="flex items-center space-x-6">
              <Link
                href="/cart"
                className="text-lacapke-charcoal hover:text-lacapke-charcoal/80 font-medium flex items-center relative"
              >
                <div className={`relative ${animateCart ? "animate-bounce" : ""}`}>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {showCartBadge && (
                    <span
                      className={`absolute -top-2 -right-1 bg-[#f8e1e1] text-lacapke-charcoal text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center ${animateCart ? "scale-125" : ""} transition-transform`}
                    >
                      {cartItemCount > 9 ? "9+" : cartItemCount}
                    </span>
                  )}
                </div>
                Mi Pedido
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-lacapke-cream">
                    <AvatarImage src="/logo-default.png" alt={user.username} />
                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-lacapke-charcoal">{user.username}</div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-lacapke-charcoal/20 text-lacapke-charcoal"
                  onClick={() => setShowLoginForm(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLoginForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 text-lacapke-charcoal z-20 bg-white rounded-full"
              onClick={() => setShowLoginForm(false)}
            >
              <span className="sr-only">Cerrar</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </Button>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </>
  )
}
