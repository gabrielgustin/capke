"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAuthState, type User } from "@/lib/auth"
import { getProducts, type Product } from "@/lib/products"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { ProductImage } from "@/components/product-image"
import { Header } from "@/components/header"
import { VegetarianBadge } from "@/components/vegetarian-badge"
import { NewItemBadge } from "@/components/new-item-badge"

// Importar motion y las utilidades de animación
import { motion, AnimatePresence } from "framer-motion"
import { addToCartAnimation } from "@/lib/animation-utils"

// Definir el tipo para un item del carrito
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [isChanging, setIsChanging] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartItemCount, setCartItemCount] = useState(0)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [selectedVariantPrice, setSelectedVariantPrice] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)

  // Cargar el producto por ID
  useEffect(() => {
    window.scrollTo(0, 0)

    if (params.id) {
      const products = getProducts()
      const foundProduct = products.find((p) => p.id === params.id)

      if (foundProduct) {
        setProduct(foundProduct)

        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0].name)
          setSelectedVariantPrice(foundProduct.variants[0].price)
        }
      } else {
        // Si no se encuentra el producto, crear uno básico para evitar errores
        const productName = (params.id as string)
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        const fallbackProduct: Product = {
          id: params.id as string,
          name: productName,
          description:
            "Información del producto no disponible. Por favor, contacta con el restaurante para más detalles.",
          price: 0,
          image: "/default-product-icon.png",
          category: "breakfast",
        }
        setProduct(fallbackProduct)
      }
    }

    // Cargar usuario
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
      setIsAdmin(authUser.username === "Admin1")
    }
  }, [params.id])

  // Cargar el carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)

        // Calcular la cantidad total de items en el carrito
        const totalItems = parsedCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        setCartItemCount(totalItems)
      } catch (e) {
        console.error("Error parsing cart from localStorage", e)
      }
    }
  }, [params.id])

  // Actualizar el precio total cuando cambia la cantidad o la variante
  useEffect(() => {
    if (product) {
      const basePrice = selectedVariantPrice !== null ? selectedVariantPrice : product.price
      setTotalPrice(quantity * basePrice)
    }
  }, [quantity, product, selectedVariantPrice])

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
    setIsChanging(true)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      setIsChanging(true)
    }
  }

  // Efecto para resetear la animación
  useEffect(() => {
    if (isChanging) {
      const timer = setTimeout(() => {
        setIsChanging(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isChanging])

  // Función para seleccionar una variante
  const handleVariantSelect = (variantName: string) => {
    if (product && product.variants) {
      const variant = product.variants.find((v) => v.name === variantName)
      if (variant) {
        setSelectedVariant(variant.name)
        setSelectedVariantPrice(variant.price)
      }
    }
  }

  // Función para formatear precio
  const formatPrice = (price: number) => {
    return `$ ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
  }

  // Función para agregar al carrito
  const addToCart = () => {
    if (!product || product.price === 0) {
      alert("Este producto no está disponible para pedidos en línea. Por favor, contacta con el restaurante.")
      return
    }

    // Crear el nuevo item
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariantPrice !== null ? selectedVariantPrice : product.price,
      quantity: quantity,
      image: product.image || "/default-product-icon.png",
      variant: selectedVariant || undefined,
    }

    // Verificar si el producto ya está en el carrito con la misma variante
    const existingItemIndex = cart.findIndex((item) => item.id === product.id && item.variant === newItem.variant)

    let updatedCart: CartItem[]

    if (existingItemIndex >= 0) {
      // Si ya existe, actualizar la cantidad
      updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += quantity
    } else {
      // Si no existe, añadir el nuevo item
      updatedCart = [...cart, newItem]
    }

    // Actualizar el estado y localStorage
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Calcular la nueva cantidad total de items
    const newTotalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0)
    setCartItemCount(newTotalItems)

    // Activar la animación del carrito
    setCartAnimation(true)

    // Redirigir al menú inmediatamente
    router.push("/menu")
  }

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lacapke-charcoal">Cargando producto...</div>
      </div>
    )
  }

  // Determinar si el producto tiene imagen
  const hasImage = !!product.image && product.image !== "/default-product-icon.png"

  return (
    <motion.div
      className="bg-lacapke-background min-h-screen flex flex-col pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header component */}
      <Header />

      {/* Desktop Navigation con contador de carrito */}
      <DesktopNavigation
        user={user}
        onLoginSuccess={handleLoginSuccess}
        cartItemCount={cartItemCount}
        cartAnimation={cartAnimation}
      />

      <div className="container-app flex-1 flex flex-col lg:flex-row lg:gap-8 lg:py-8">
        {/* Contenedor para la imagen */}
        <div className="relative lg:w-1/2 lg:pt-0 pt-4">
          {/* Botón de retroceso - Solo visible en desktop */}
          <div className="hidden lg:block mb-4 mt-0">
            <Button
              variant="outline"
              className="text-lacapke-charcoal hover:bg-lacapke-background border-lacapke-charcoal/20 bg-transparent"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al menú
            </Button>
          </div>

          {/* Imagen del producto */}
          <div className="w-full flex justify-center px-4 lg:px-0">
            <div className="w-full max-w-xs lg:max-w-md aspect-square bg-white rounded-lg overflow-hidden shadow-sm relative">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/80 hover:bg-white text-lacapke-charcoal rounded-full shadow-sm"
                  onClick={() => router.push(`/menu?edit=${product.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}

              {hasImage ? (
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full">
                  <ProductImage
                    src="/default-product-icon.png"
                    alt={product.name}
                    width={200}
                    height={200}
                    fill={false}
                    className="object-contain"
                    priority={true}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.isVegetarian && <VegetarianBadge />}
            {product.isNew && <NewItemBadge />}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 p-4 lg:p-0 flex flex-col">
          <motion.h1
            className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3 text-lacapke-charcoal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {product.name}
          </motion.h1>

          {/* Tabs para información del producto */}
          <Tabs defaultValue="description" className="w-full mb-4">
            <TabsContent value="description" className="text-sm lg:text-base text-lacapke-charcoal">
              <p className="bg-white/70 p-3 rounded-lg shadow-sm border border-lacapke-charcoal/10 leading-relaxed tracking-wide">
                {product.description}
              </p>
            </TabsContent>
          </Tabs>

          {/* Variantes si existen */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-lacapke-charcoal mb-2 lg:text-lg">Variantes:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((variant, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={cn(
                      "justify-between border-lacapke-charcoal/20 hover:bg-lacapke-cream/30",
                      selectedVariant === variant.name && "bg-lacapke-cream/50 border-lacapke-charcoal/40",
                    )}
                    onClick={() => handleVariantSelect(variant.name)}
                  >
                    <span className="text-sm">{variant.name}</span>
                    <span className="font-semibold text-lacapke-charcoal ml-2">$ {variant.price.toLocaleString()}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector - Solo visible en desktop */}
          <div className="hidden lg:flex items-center justify-between mb-4 sm:mb-6 mt-auto">
            <div className="text-base sm:text-lg lg:text-xl font-medium text-lacapke-charcoal">
              ${(selectedVariantPrice !== null ? selectedVariantPrice : product.price).toFixed(2)}
              <span className="text-xs sm:text-sm text-lacapke-charcoal/70">/ unidad</span>
            </div>

            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg border-0 bg-[#f8e1e1] text-lacapke-charcoal hover:bg-[#f5d4d4]"
                onClick={decreaseQuantity}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <span
                className={cn(
                  "mx-3 sm:mx-4 font-medium text-base sm:text-xl w-5 sm:w-6 text-center text-lacapke-charcoal transition-transform duration-300",
                  isChanging && "transform scale-110",
                )}
              >
                {quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg border-0 bg-[#e0f0e9] text-lacapke-charcoal hover:bg-[#d3e8df]"
                onClick={increaseQuantity}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Botón de agregar al carrito - Desktop */}
          <motion.div
            className="hidden lg:flex items-center justify-between mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className={cn(
                "text-2xl font-bold text-lacapke-charcoal transition-all duration-300",
                isChanging && "scale-110 text-lacapke-accent",
              )}
              animate={isChanging ? { scale: 1.1 } : { scale: 1 }}
            >
              ${totalPrice.toFixed(2)}
            </motion.div>
            <motion.button
              className={cn(
                "bg-[#0A4D8F] hover:bg-[#083d73] text-white border-0 px-6 py-6 rounded-lg flex items-center gap-2 transition-all duration-300",
                product.price === 0 && "opacity-50 cursor-not-allowed",
              )}
              onClick={addToCart}
              disabled={product.price === 0}
              variants={addToCartAnimation}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.8,
              }}
            >
              {product.price === 0 ? "No disponible" : "Pedir al pedido"}
              <ShoppingBag className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Barra inferior móvil */}
      <AnimatePresence>
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-20 lg:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="py-3 px-5">
            <div className="flex justify-between items-center gap-3 md:gap-4 max-w-md mx-auto">
              {/* Selector de cantidad */}
              <div className="flex items-center justify-between bg-tupedido-yellow rounded-md p-1 shadow-md">
                <button
                  onClick={decreaseQuantity}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-tupedido-blue hover:bg-gray-200 rounded-md transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={20} strokeWidth={3} className="md:w-6 md:h-6" />
                </button>
                <span className="mx-2 md:mx-3 text-base md:text-lg font-bold text-tupedido-blue">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-tupedido-blue hover:bg-gray-200 rounded-md transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={20} strokeWidth={3} className="md:w-6 md:h-6" />
                </button>
              </div>

              {/* Botón de agregar */}
              <button
                onClick={addToCart}
                disabled={product.price === 0}
                className={cn(
                  "bg-tupedido-blue text-white font-bold py-2.5 md:py-3 px-4 md:px-6 rounded-md flex items-center justify-center shadow-md hover:opacity-90 transition-opacity",
                  product.price === 0 && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="mr-2 text-sm md:text-base">{product.price === 0 ? "No disponible" : "Pedir"}</span>
                {product.price > 0 && <span className="text-sm md:text-base">{formatPrice(totalPrice)}</span>}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
