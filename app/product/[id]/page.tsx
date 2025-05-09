"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Info, Coffee, Utensils, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getAuthState, type User } from "@/lib/auth"
import { getProducts, type Product } from "@/lib/products"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { VegetarianBadge } from "@/components/vegetarian-badge"
import { ProductImage } from "@/components/product-image"

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isChanging, setIsChanging] = useState(false)
  const [changeDirection, setChangeDirection] = useState<"up" | "down" | null>(null)
  const [totalPrice, setTotalPrice] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [selectedVariantPrice, setSelectedVariantPrice] = useState<number | null>(null)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Cargar el producto por ID
  useEffect(() => {
    const products = getProducts()
    const foundProduct = products.find((p) => p.id === params.id)

    if (foundProduct) {
      console.log("Producto encontrado:", foundProduct)
      console.log("Imagen del producto:", foundProduct.image)

      // Verificación específica para productos con imágenes especiales
      if (foundProduct.id === "croissant-con-helado") {
        foundProduct.image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/croissant-con-helado-new-gyMAjojOB3VX5ONzNrvhI7qKT6LcvR.png"
      } else if (foundProduct.id === "palta-y-huevo" || foundProduct.id === "palta-y-huevo-baked") {
        foundProduct.image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AvocadoToastWithEgg%20%281%29.jpg-mNvdGGs7E4YipQmpYCvvxmrTrVDo0p.jpeg"
      } else if (foundProduct.id === "plato-de-huevos-revueltos") {
        foundProduct.image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/photo.jpg-slM6Nn7f44n9rYG7edb3eMrkFZRVPi.jpeg"
      } else if (foundProduct.id === "plato-de-tostadas") {
        foundProduct.image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1366_2000.jpg-orY32naxF9fnP6bmBy1xFB2VlJR0ym.jpeg"
      } else if (foundProduct.id === "budin") {
        foundProduct.image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-jJdFE8WbVdoM0kbuTilqMjIH0dWabd.jpeg"
      }

      setProduct(foundProduct)
      // Si el producto tiene variantes, seleccionar la primera por defecto
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0].name)
        setSelectedVariantPrice(foundProduct.variants[0].price)
      }
    } else {
      console.log("Producto no encontrado, creando uno genérico")
      // Producto no encontrado, crear uno genérico
      setProduct({
        id: params.id,
        name: "Producto no encontrado",
        image: "/placeholder.svg",
        price: 0,
        description: "Lo sentimos, no pudimos encontrar este producto.",
      })
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

    // Cargar usuario
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
      setIsAdmin(authUser.isAdmin || false)
    }
  }, [params.id])

  // Actualizar el precio total cuando cambia la cantidad o la variante
  useEffect(() => {
    if (product) {
      const basePrice = selectedVariantPrice !== null ? selectedVariantPrice : product.price
      setTotalPrice(quantity * basePrice)
    }
  }, [quantity, product, selectedVariantPrice])

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
    setIsChanging(true)
    setChangeDirection("up")
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      setIsChanging(true)
      setChangeDirection("down")
    }
  }

  // Efecto para resetear la animación
  useEffect(() => {
    if (isChanging) {
      const timer = setTimeout(() => {
        setIsChanging(false)
        setChangeDirection(null)
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

  // Función para agregar al carrito
  const addToCart = () => {
    if (!product) return

    // Crear el nuevo item
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: selectedVariantPrice !== null ? selectedVariantPrice : product.price,
      quantity: quantity,
      image: product.image || "/default-product-icon.png", // Imagen por defecto si no hay imagen
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

    // Mostrar feedback visual
    setIsAddingToCart(true)

    // Redirigir al inicio después de un breve retraso para que se vea la animación
    setTimeout(() => {
      router.push("/menu")
    }, 800)
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

  // Función para obtener el texto de la categoría
  const getCategoryText = (category: string | null) => {
    if (category === "brunch") {
      // Si el producto es "me-lo-merezco", mostrar "PARA DESAYUNAR Y MERENDAR" en lugar de "Brunchear"
      if (product.id === "me-lo-merezco") {
        return "PARA DESAYUNAR Y MERENDAR"
      }
      return "Brunchear"
    }
    if (category === "breakfast") return "Desayuno & Merienda"
    if (category === "lunch") return "Almuerzo & Cena"
    return null
  }

  // Determinar si el producto tiene imagen
  const hasImage = !!product.image

  // Función para obtener el icono según la categoría o ID del producto
  const getProductIcon = () => {
    if (product.category === "breakfast") {
      return <Coffee className="h-12 w-12 text-lacapke-charcoal/60" />
    } else if (product.category === "brunch") {
      return <Utensils className="h-12 w-12 text-lacapke-charcoal/60" />
    } else {
      return <Coffee className="h-12 w-12 text-lacapke-charcoal/60" />
    }
  }

  // Dentro del componente ProductPage, modificar las secciones relevantes:

  // Reemplazar el div principal por motion.div
  return (
    <motion.div
      className="bg-lacapke-background min-h-screen flex flex-col pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Desktop Navigation con contador de carrito */}
      <DesktopNavigation
        user={user}
        onLoginSuccess={handleLoginSuccess}
        cartItemCount={cartItemCount}
        cartAnimation={cartAnimation}
      />

      <div className="container-app flex-1 flex flex-col lg:flex-row lg:gap-8 lg:py-8">
        {/* Contenedor para la imagen y el botón con el mismo margen superior */}
        <div className="pt-16 relative lg:w-1/2 lg:pt-0">
          {/* Botón de retroceso - Solo visible en móvil */}
          <div className="fixed left-4 top-4 z-10 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white shadow-sm hover:bg-white/90"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6 text-lacapke-charcoal" />
            </Button>
          </div>

          {/* Botón de retroceso - Solo visible en desktop */}
          <div className="hidden lg:block mb-4 mt-4">
            <Button
              variant="outline"
              className="text-lacapke-charcoal hover:bg-lacapke-background border-lacapke-charcoal/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver al menú
            </Button>
          </div>

          {/* Modificar la sección de la imagen */}
          {hasImage ? (
            // Imagen del producto (si existe)
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
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.isVegetarian && (
                  <div className="absolute bottom-2 left-2 bg-white/80 p-1 rounded-full">
                    <VegetarianBadge className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Diseño alternativo para productos sin imagen
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
                {product.isVegetarian && (
                  <div className="absolute bottom-2 left-2 bg-white/80 p-1 rounded-full">
                    <VegetarianBadge className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 p-4 lg:p-0 flex flex-col">
          {/* Modificar el título del producto */}
          <motion.h1
            className="text-2xl lg:text-3xl font-bold mb-2 lg:mb-3 text-lacapke-charcoal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {product.name}
          </motion.h1>

          {/* Etiquetas del producto */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isVegetarian && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <VegetarianBadge className="h-3 w-3 mr-1" /> Vegetariano
              </Badge>
            )}
            {getCategoryText(product.category) && (
              <Badge
                variant="outline"
                className={
                  product.category === "breakfast" || product.id === "me-lo-merezco"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : product.category === "brunch"
                      ? "bg-orange-50 text-orange-700 border-orange-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                }
              >
                {getCategoryText(product.category)}
              </Badge>
            )}
          </div>

          {/* Tabs para información del producto */}
          <Tabs defaultValue="description" className="w-full mb-4">
            <TabsList className="mb-2">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="text-sm lg:text-base text-lacapke-charcoal">
              <p className="bg-white/70 p-3 rounded-lg shadow-sm border border-lacapke-charcoal/10 leading-relaxed tracking-wide">
                {product.id === "me-lo-merezco" ? (
                  <>
                    • 1 porción de torta a elección.
                    <br />• Mafalda prensada de jamón natural y<br />
                    queso danbo.
                    <br />• Muffin inglés con queso danbo,
                    <br />
                    panceta, cheesecream y huevo frito.
                  </>
                ) : (
                  <>
                    {product.description.split("•").map((item, index) =>
                      index === 0 ? (
                        item
                      ) : (
                        <React.Fragment key={index}>
                          <br />• {item.trim()}
                        </React.Fragment>
                      ),
                    )}
                  </>
                )}
              </p>
            </TabsContent>
            <TabsContent value="ingredients" className="text-sm lg:text-base text-lacapke-charcoal">
              <p>Ingredientes principales:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {product.id === "querido-bowl" && (
                  <>
                    <li>Yogurt natural</li>
                    <li>Granola casera</li>
                    <li>Frutas de estación</li>
                    <li>Miel</li>
                  </>
                )}
                {product.id === "croissant-con-helado" && (
                  <>
                    <li>Croissant de manteca</li>
                    <li>Helado de crema americana</li>
                    <li>Coulis de arándanos</li>
                    <li>Banana</li>
                    <li>Frutillas</li>
                  </>
                )}
                {product.id === "tosti-espinaca-champis" && (
                  <>
                    <li>Pan de masa madre</li>
                    <li>Espinaca fresca</li>
                    <li>Champiñones</li>
                    <li>Aceite de oliva infusionado con ajo</li>
                    <li>Queso muzzarella</li>
                  </>
                )}
                {product.id === "mafalda-prensada" && (
                  <>
                    <li>Pan mafalda</li>
                    <li>Jamón natural</li>
                    <li>Queso danbo</li>
                  </>
                )}
                {!["querido-bowl", "croissant-con-helado", "tosti-espinaca-champis", "mafalda-prensada"].includes(
                  product.id,
                ) && <li>Consultar con el personal por ingredientes específicos</li>}
              </ul>
            </TabsContent>
            <TabsContent value="info" className="text-sm lg:text-base text-lacapke-charcoal">
              <div className="space-y-2">
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-lacapke-charcoal/70" />
                  <span>Tiempo de preparación: 10-15 minutos</span>
                </p>
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-lacapke-charcoal/70" />
                  <span>Apto para compartir: {product.size === "large" ? "Sí" : "No"}</span>
                </p>
                <p className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-lacapke-charcoal/70" />
                  <span>Disponible para llevar: Sí</span>
                </p>
              </div>
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

          {/* Quantity Selector con colores pastel - Solo visible en desktop */}
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
                onClick={decrementQuantity}
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
                onClick={incrementQuantity}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Modificar el botón de agregar al carrito */}
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
                "bg-[#f8e1e1] hover:bg-[#f5d4d4] text-lacapke-charcoal border-0 px-6 py-6 rounded-lg flex items-center gap-2 transition-all duration-300",
                isAddingToCart && "bg-green-100 text-green-700",
              )}
              onClick={addToCart}
              disabled={isAddingToCart}
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
              {isAddingToCart ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Agregado
                </motion.div>
              ) : (
                <>
                  Agregar al pedido
                  <ShoppingBag className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Barra inferior con animación */}
      <AnimatePresence>
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white p-4 flex items-center justify-between lg:hidden z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="flex-1 max-w-[140px]">
            {/* Selector de cantidad con el nuevo estilo */}
            <div className="bg-gray-100 rounded-full flex items-center justify-between p-1 shadow-sm">
              <button
                className="w-10 h-10 flex items-center justify-center text-[#f8e1e1] bg-[#f8e1e1] rounded-full"
                onClick={decrementQuantity}
              >
                <Minus className="h-5 w-5 text-lacapke-charcoal" />
              </button>
              <span className="font-bold text-xl text-lacapke-charcoal">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center text-[#e0f0e9] bg-[#e0f0e9] rounded-full"
                onClick={incrementQuantity}
              >
                <Plus className="h-5 w-5 text-lacapke-charcoal" />
              </button>
            </div>
          </div>

          {/* Botón de agregar con el nuevo estilo */}
          <button
            className={cn(
              "flex-1 ml-4 bg-[#f8e1e1] text-lacapke-charcoal font-bold py-3 px-4 rounded-lg text-center transition-all",
              isAddingToCart && "bg-green-100 text-green-700",
            )}
            onClick={addToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center">
                <Check className="h-5 w-5 mr-2" />
                Agregado
              </span>
            ) : (
              <span>Agregar $ {totalPrice.toLocaleString()}</span>
            )}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* No incluimos el BottomNavigation aquí ya que estamos en una página de detalle de producto */}
    </motion.div>
  )
}
