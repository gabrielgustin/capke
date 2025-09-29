"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2, ArrowLeft, Minus, Plus, ShoppingBag, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { getAuthState, type User } from "@/lib/auth"
import { LeafIcon } from "@/components/icons"
import { getProducts } from "@/lib/products"
import { Toaster } from "@/components/ui/toaster"

// Importar motion y las utilidades de animación
import { motion, AnimatePresence } from "framer-motion"
import { slideUp, staggerContainer } from "@/lib/animation-utils"

// Definir el tipo para un item del carrito
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [orderDetails, setOrderDetails] = useState<{
    items: CartItem[]
    total: number
    orderNumber: string
  } | null>(null)

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (e) {
        console.error("Error parsing cart from localStorage", e)
      }
    }

    // Cargar usuario
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
    }

    // Cargar productos para obtener información adicional
    setProducts(getProducts())
  }, [])

  // Calcular el precio total cuando cambia el carrito
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotalPrice(total)
  }, [cart])

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id: string, variant: string | undefined, newQuantity: number) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id && item.variant === variant) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })
      .filter((item) => item.quantity > 0)

    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Función para eliminar un producto del carrito
  const removeItem = (id: string, variant?: string) => {
    const updatedCart = cart.filter((item) => !(item.id === id && item.variant === variant))
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
  }

  // Función para obtener información adicional del producto
  const getProductInfo = (id: string) => {
    return products.find((p) => p.id === id) || null
  }

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return price.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Función para finalizar el pedido
  const checkout = () => {
    // Generar un número de pedido aleatorio
    const orderNumber = `LC-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    // Guardar detalles del pedido
    setOrderDetails({
      items: [...cart],
      total: totalPrice,
      orderNumber,
    })

    // Mostrar el modal de confirmación
    setShowOrderConfirmation(true)
  }

  // Función para cerrar el modal y finalizar el proceso
  const closeOrderConfirmation = () => {
    setShowOrderConfirmation(false)

    // Limpiar el carrito
    setCart([])
    localStorage.removeItem("cart")

    // Redirigir al menú
    router.push("/menu")
  }

  return (
    <div className="bg-lacapke-background min-h-screen">
      {/* Desktop Navigation */}
      <DesktopNavigation user={user} onLoginSuccess={handleLoginSuccess} />

      <div className="container-app pb-20 lg:pb-10">
        {/* Header - Solo visible en móvil */}
        <header className="px-4 pt-6 pb-4 flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 mr-4 bg-white shadow-sm hover:bg-white/90 rounded-2xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6 text-lacapke-charcoal" />
          </Button>
          <h1 className="text-2xl font-bold text-lacapke-charcoal">Mi Pedido</h1>
        </header>

        {/* Header - Solo visible en desktop */}
        <header className="hidden lg:block pt-8 pb-4">
          <h1 className="text-3xl font-bold text-lacapke-charcoal">Mi Pedido</h1>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-0">
          <div className="max-w-2xl mx-auto">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-16 w-16 text-lacapke-charcoal/30 mb-4" />
                <p className="text-lacapke-charcoal/70 text-lg">Tu carrito está vacío</p>
                <Button
                  className="mt-6 bg-[#0A4D8F] hover:bg-[#083d73] text-white rounded-2xl"
                  onClick={() => router.push("/menu")}
                >
                  Ver menú
                </Button>
              </div>
            ) : (
              <>
                {/* Main Content */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    {cart.map((item, index) => {
                      const productInfo = getProductInfo(item.id)
                      return (
                        <motion.div
                          key={`${item.id}-${item.variant}-${index}`}
                          variants={slideUp}
                          className="bg-white rounded-2xl p-2 sm:p-3 flex items-center shadow-sm"
                        >
                          <div className="h-12 w-12 sm:h-16 sm:w-16 relative rounded-xl overflow-hidden mr-2 sm:mr-3 flex-shrink-0">
                            {item.image && item.image !== "" ? (
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              // Usar la misma imagen por defecto que en la página de detalle del producto
                              <div className="w-full h-full flex items-center justify-center bg-white">
                                <Image
                                  src="/default-product-icon.png"
                                  alt={item.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            )}
                            {productInfo?.isVegetarian && (
                              <div className="absolute bottom-0 left-0 bg-white/80 p-0.5 rounded-tr-md">
                                <LeafIcon className="h-3 w-3 text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lacapke-charcoal text-sm sm:text-base">{item.name}</h3>
                            {item.variant && <p className="text-xs text-lacapke-charcoal/70">{item.variant}</p>}
                            <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                              <span className="font-semibold text-lacapke-charcoal text-xs sm:text-base">
                                ${formatPrice(item.price * item.quantity)}
                              </span>
                              <div className="flex items-center">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-0 bg-[#f5f5f7] text-lacapke-charcoal hover:bg-[#e5e7eb]"
                                  onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                                >
                                  <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </Button>
                                <span className="mx-1.5 sm:mx-2 font-medium text-lacapke-charcoal text-sm sm:text-base">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border-0 bg-[#f5f5f7] text-lacapke-charcoal hover:bg-[#e5e7eb]"
                                  onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                                >
                                  <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 sm:h-8 sm:w-8 ml-1 sm:ml-2 text-red-500 hover:bg-red-50 rounded-full"
                                  onClick={() => removeItem(item.id, item.variant)}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>

                {/* Resumen del pedido */}
                <motion.div
                  className="bg-white rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-bold text-lacapke-charcoal mb-2 sm:mb-3 text-sm sm:text-base">
                    Resumen del pedido
                  </h3>
                  <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                    {cart.map((item, index) => (
                      <div
                        key={`summary-${item.id}-${item.variant}-${index}`}
                        className="flex justify-between text-xs sm:text-sm"
                      >
                        <span className="text-lacapke-charcoal/70">
                          {item.quantity} x {item.name}
                          {item.variant ? ` (${item.variant})` : ""}
                        </span>
                        <span className="text-lacapke-charcoal">${formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-lacapke-charcoal/10 pt-2 sm:pt-3 mt-2 sm:mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-lacapke-charcoal text-sm sm:text-base">Total</span>
                      <span className="text-lacapke-charcoal text-sm sm:text-base">${formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Botón de finalizar pedido */}
                <motion.button
                  className="w-full bg-[#0A4D8F] hover:bg-[#083d73] text-white py-4 text-lg font-medium rounded-2xl"
                  onClick={checkout}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Finalizar pedido
                </motion.button>
              </>
            )}
          </div>
        </main>

        {/* Modal de confirmación de pedido */}
        <AnimatePresence>
          {showOrderConfirmation && orderDetails && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg my-8"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Check className="h-6 w-6 text-green-500 mr-2" />
                    <h3 className="text-xl font-bold text-lacapke-charcoal">¡Pedido confirmado!</h3>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={closeOrderConfirmation}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                

                <h4 className="font-bold text-lacapke-charcoal mb-2">Detalle del pedido:</h4>
                <div className="border-t border-lacapke-charcoal/10 pt-2 mb-4">
                  {orderDetails.items.map((item, index) => (
                    <div key={`order-${index}`} className="flex justify-between py-1 text-sm">
                      <span className="text-lacapke-charcoal">
                        {item.quantity} x {item.name}
                        {item.variant ? ` (${item.variant})` : ""}
                      </span>
                      <span className="text-lacapke-charcoal font-medium">
                        ${formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-lacapke-charcoal/10 mt-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-lacapke-charcoal">Total</span>
                      <span className="text-lacapke-charcoal">${formatPrice(orderDetails.total)}</span>
                    </div>
                  </div>
                </div>

                

                <Button
                  className="w-full bg-[#0A4D8F] hover:bg-[#083d73] text-white py-4 font-medium rounded-2xl"
                  onClick={closeOrderConfirmation}
                >
                  Volver al menú
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
      <Toaster />
    </div>
  )
}
