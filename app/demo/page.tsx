"use client"

import { useState } from "react"
import HamburgerMenu from "@/components/hamburger-menu"

export default function DemoPage() {
  const [cartItemCount, setCartItemCount] = useState(3)

  // Ejemplo de usuario autenticado
  const user = {
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
  }
  // Para probar sin usuario: const user = null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#121628] text-[#f8f8f8] py-4 px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="text-[#d4b45a] font-bold text-xl">CAPKE</div>

        {/* Menú de hamburguesa */}
        <HamburgerMenu cartItemCount={cartItemCount} user={user} />
      </header>

      {/* Contenido de demostración */}
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Demostración del Menú Hamburguesa</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="mb-4">Haz clic en el icono de hamburguesa en la esquina superior derecha para abrir el menú.</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setCartItemCount((prev) => prev + 1)}
            >
              Añadir item al carrito
            </button>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => setCartItemCount((prev) => Math.max(0, prev - 1))}
              disabled={cartItemCount === 0}
            >
              Quitar item del carrito
            </button>

            <div className="text-sm text-gray-600">
              Items en el carrito: <span className="font-bold">{cartItemCount}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
