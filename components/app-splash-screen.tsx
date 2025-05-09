"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import SplashScreen from "./splash-screen"

interface AppSplashScreenProps {
  children: React.ReactNode
}

export function AppSplashScreen({ children }: AppSplashScreenProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      // Asegurarse de que la página comience desde arriba
      window.scrollTo(0, 0)
      setLoading(false)
    }, 2500)

    // Manejar overflow del body
    if (loading) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ""
    }
  }, [loading])

  // Efecto adicional para asegurar que la página comience desde arriba cuando se complete la carga
  useEffect(() => {
    if (!loading) {
      // Pequeño retraso para asegurar que se ejecute después de la transición
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        })
      }, 100)
    }
  }, [loading])

  return (
    <>
      <AnimatePresence mode="wait">{loading && <SplashScreen />}</AnimatePresence>
      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s ease",
          visibility: loading ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </>
  )
}
