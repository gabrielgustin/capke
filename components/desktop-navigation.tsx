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
