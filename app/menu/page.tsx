"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Home, ShoppingBag, LogOut, PlusCircle, Edit, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FoodCategory } from "@/components/food-category"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MenuItemCard } from "@/components/menu-item-card"
import { LoginForm } from "@/components/login-form"
import { AdminPanel } from "@/components/admin-panel"
import { ProductEditModal } from "@/components/product-edit-modal"
import Image from "next/image"
import { TicketIcon } from "@/components/icons"
import Link from "next/link"
import { getAuthState, logout, type User } from "@/lib/auth"
import {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  resetProducts,
  getDefaultCategory,
  type Product,
  type ProductCategory,
  PRODUCTS_VERSION,
} from "@/lib/products"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { VegetarianBadge } from "@/components/vegetarian-badge"
import { NewItemBadge } from "@/components/new-item-badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Añadir la importación de useSearchParams
import { useSearchParams } from "next/navigation"

// Añadir la importación del nuevo componente
import { RefreshDataButton } from "@/components/refresh-data-button"

// Importar motion y las utilidades de animación
import { motion, AnimatePresence } from "framer-motion"
import { categoryAnimation, mobileMenuAnimation, menuItemAnimation } from "@/lib/animation-utils"

// Importar el componente
import { ScrollToTopButton } from "@/components/scroll-to-top-button"

// Importar el nuevo componente
import { StickyCategoryCarousel } from "@/components/sticky-category-carousel"

// Importar el nuevo componente CategoryEditModal
import { CategoryEditModal, type Category } from "@/components/category-edit-modal"

// Importar componentes específicos para productos
import { CroissantHeladoCard } from "@/components/featured-cards/croissant-helado-card"
import { TostiEspinacaCard } from "@/components/featured-cards/tosti-espinaca-card"

// Definir el tipo para un item del carrito
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
}

// Find the HamburgerIcon component and replace it with this corrected version:

const HamburgerIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z"
        fill="currentColor"
      />
      <path
        d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
        fill="currentColor"
      />
      <path
        d="M5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H19C19.5523 19 20 18.5523 20 18C20 17.4477 19.5523 17 19 17H5Z"
        fill="currentColor"
      />
    </svg>
  )
}

// Modificar el componente FoodCategory para usar animaciones
function AnimatedFoodCategory({ title, iconType, isActive, onClick }) {
  return (
    <motion.div
      variants={categoryAnimation}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <FoodCategory title={title} iconType={iconType} />
    </motion.div>
  )
}

export default function MenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("brunch") // Cambiado a "brunch" por defecto
  const [cartItemCount, setCartItemCount] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isResetting, setIsResetting] = useState(false)

  // Añadir un nuevo estado para manejar la edición de categorías
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // Añadir después de la declaración de carouselRef
  const searchParams = useSearchParams()
  const editProductId = searchParams.get("edit")

  // Referencias para las secciones de categoría
  const breakfastRef = useRef<HTMLDivElement>(null)
  const brunchRef = useRef<HTMLDivElement>(null)
  const lunchRef = useRef<HTMLDivElement>(null)
  const dessertsRef = useRef<HTMLDivElement>(null)
  const bakeryRef = useRef<HTMLDivElement>(null)
  const coffeeRef = useRef<HTMLDivElement>(null)

  // Función para forzar la actualización de productos
  const forceResetProducts = () => {
    setIsResetting(true)
    // Limpiar localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("products")
    }
    // Obtener productos predeterminados
    const defaultProducts = resetProducts()
    setProducts(defaultProducts)

    toast({
      title: "Productos actualizados",
      description: "Se han restablecido todos los productos a la versión más reciente",
      duration: 3000,
    })

    setTimeout(() => {
      setIsResetting(false)
    }, 1000)
  }

  // Cargar el estado de autenticación y productos al iniciar
  useEffect(() => {
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
    }

    // Verificar si hay una versión almacenada
    const storedVersion = localStorage.getItem("products_version")

    // Si la versión almacenada es diferente a la actual, forzar actualización
    if (storedVersion !== PRODUCTS_VERSION) {
      forceResetProducts()
      localStorage.setItem("products_version", PRODUCTS_VERSION)
    } else {
      // Cargar productos normalmente
      const loadedProducts = getProducts()
      setProducts(loadedProducts)
    }
  }, [])

  // Verificar si hay un producto para editar desde la URL
  useEffect(() => {
    if (editProductId && isAdmin) {
      const productToEdit = products.find((p) => p.id === editProductId)
      if (productToEdit) {
        setEditingProduct(productToEdit)
        setShowEditModal(true)
      }
    }
  }, [editProductId, products])

  // Cargar carrito y calcular cantidad de items
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[]
        const totalItems = parsedCart.reduce((sum, item) => sum + item.quantity, 0)
        setCartItemCount(totalItems)
      } catch (e) {
        console.error("Error parsing cart from localStorage", e)
      }
    }
  }, [])

  // Efecto para la animación inicial del carrusel
  useEffect(() => {
    // Mostrar una animación sutil después de cargar la página
    const carousel = document.getElementById("categories-carousel")
    if (carousel) {
      // Asegurarse de que el carrusel sea visible inicialmente
      setTimeout(() => {
        carousel.scrollLeft = 0
      }, 500)
    }
  }, [])

  // Añadir este efecto después de los otros useEffect
  useEffect(() => {
    // Asegurar que la página comience desde la parte superior al cargar
    window.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }, [])

  // Función para desplazar el carrusel a la izquierda
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -150, behavior: "smooth" })
    }
  }

  // Función para desplazar el carrusel a la derecha
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 150, behavior: "smooth" })
    }
  }

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout()
    setUser(null)
    setIsMenuOpen(false)
  }

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
    setShowLoginForm(false)
    setIsMenuOpen(false)
  }

  // Función para editar un producto
  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId)
    if (productToEdit) {
      setEditingProduct(productToEdit)
      setShowEditModal(true)
    } else {
      // Si no se encuentra en la lista de productos, crear uno nuevo con ese ID
      const productName = productId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      const newProduct: Product = {
        id: productId,
        name: productName,
        description: "",
        price: 0,
        category: getDefaultCategory(productId, productName),
      }
      setEditingProduct(newProduct)
      setShowEditModal(true)
    }
  }

  // Modificar la función handleSaveProduct para actualizar inmediatamente la UI
  // Reemplazar la función handleSaveProduct con:
  const handleSaveProduct = (updatedProduct: Product) => {
    const updatedProducts = updateProduct(updatedProduct)
    setProducts(updatedProducts)
    setShowEditModal(false)
    setEditingProduct(null)

    // Actualizar la categoría si ha cambiado
    if (updatedProduct.category && updatedProduct.category !== activeCategory) {
      setActiveCategory(updatedProduct.category)
      scrollToCategory(updatedProduct.category)
    }

    // Mostrar notificación de éxito
    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados correctamente",
      duration: 3000,
    })
  }

  // Función para añadir un nuevo producto
  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = addProduct(newProduct)
    setProducts(updatedProducts)

    // Mostrar notificación de éxito
    toast({
      title: "Producto añadido",
      description: "El nuevo producto ha sido añadido correctamente",
      duration: 3000,
    })
  }

  // Función para eliminar un producto
  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = deleteProduct(productId)
    setProducts(updatedProducts)
    setShowEditModal(false)
    setEditingProduct(null)

    // Mostrar notificación de éxito
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente",
      duration: 3000,
    })
  }

  // Función para restablecer los productos
  const handleResetProducts = () => {
    forceResetProducts()
  }

  // Añadir la función para manejar la adición de categorías
  const handleAddCategory = () => {
    // Crear una nueva categoría con valores predeterminados
    const newCategory: Category = {
      id: "",
      name: "Nueva Categoría",
      description: "",
      backgroundColor: "#f8f5d7",
      textColor: "#4a4a4a",
      icon: "coffee",
    }
    setEditingCategory(newCategory)
    setShowCategoryModal(true)
  }

  // Añadir la función para guardar categorías
  const handleSaveCategory = (category: Category) => {
    // Aquí iría la lógica para guardar la categoría
    // Por ahora, solo cerramos el modal
    console.log("Categoría guardada:", category)
    setShowCategoryModal(false)
    setEditingCategory(null)

    // Mostrar notificación de éxito
    toast({
      title: "Categoría guardada",
      description: "La categoría ha sido guardada correctamente",
      duration: 3000,
    })
  }

  // Añadir la función para eliminar categorías
  const handleDeleteCategory = (categoryId: string) => {
    // Aquí iría la lógica para eliminar la categoría
    console.log("Categoría eliminada:", categoryId)
    setShowCategoryModal(false)
    setEditingCategory(null)

    // Mostrar notificación de éxito
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada correctamente",
      duration: 3000,
    })
  }

  // Modificar la función scrollToCategory en app/menu/page.tsx
  // Buscar esta función y reemplazarla con la siguiente versión:

  // Función para hacer scroll a la categoría seleccionada
  const scrollToCategory = (category: ProductCategory) => {
    setActiveCategory(category)

    // Solo hacer scroll si la página ya ha sido cargada completamente
    // y el usuario ha interactuado con la página
    if (document.readyState === "complete" && performance.now() > 5000) {
      let ref = null
      switch (category) {
        case "breakfast":
          ref = breakfastRef
          break
        case "brunch":
          ref = brunchRef
          break
        case "lunch":
          ref = lunchRef
          break
        case "desserts":
          ref = dessertsRef
          break
        case "bakery":
          ref = bakeryRef
          break
        case "coffee":
          ref = coffeeRef
          break
      }

      if (ref && ref.current) {
        // Scroll con animación suave
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
  }

  // Verificar si el usuario es administrador
  const isAdmin = user?.username === "Admin1"

  // Obtener títulos de categorías
  const getCategoryTitle = (category: ProductCategory): string => {
    switch (category) {
      case "breakfast":
        return "PARA DESAYUNAR Y MERENDAR"
      case "brunch":
        return "PARA BRUNCHEAR"
      case "lunch":
        return "PARA ALMORZAR Y CENAR"
      case "desserts":
        return "POSTRES"
      case "bakery":
        return "PASTELERÍA Y PANADERÍA"
      case "coffee":
        return "CAFETERÍA"
      default:
        return "PARA DESAYUNAR Y MERENDAR"
    }
  }

  // Componente para el botón de edición del administrador
  const AdminEditButton = ({ productId }: { productId: string }) => {
    if (!isAdmin) return null

    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/80 hover:bg-white text-lacapke-charcoal rounded-full shadow-sm"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleEditProduct(productId)
        }}
      >
        <Edit className="h-4 w-4" />
      </Button>
    )
  }

  // Componente para tarjeta simple personalizable
  const SimpleCard = ({
    id,
    name,
    price,
    description,
    isVegetarian = false,
    isNew = false,
    image,
  }: {
    id: string
    name: string
    price: number
    description: string
    isVegetarian?: boolean
    isNew?: boolean
    image?: string
  }) => {
    return (
      <Link href={`/product/${id}`} className="block h-full">
        <div className="bg-[#f8f5d7] rounded-xl overflow-hidden shadow-sm h-full flex flex-col p-2 sm:p-3 relative">
          {isAdmin && <AdminEditButton productId={id} />}

          {/* Añadir imagen si existe */}
          {image && (
            <div className="relative h-24 sm:h-28 lg:h-40 w-full mb-2 rounded-lg overflow-hidden">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </div>
          )}

          <div className="mb-auto">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-lacapke-charcoal text-xs sm:text-sm font-open-sans">{name}</h3>
              {isNew && <NewItemBadge className="ml-1" />}
            </div>
            <p className="text-lacapke-charcoal/80 text-[9px] sm:text-[10px] line-clamp-2 mt-0.5">{description}</p>
          </div>
          <div className="flex justify-between items-center w-full mt-1 sm:mt-2">
            <div className="relative">{isVegetarian && <VegetarianBadge className="h-4 w-4 sm:h-5 sm:w-5" />}</div>
            <span className="font-bold text-lacapke-charcoal text-xs sm:text-sm font-open-sans">$ {price}</span>
          </div>
        </div>
      </Link>
    )
  }

  // Filtrar productos por categoría
  const breakfastProducts = products.filter((product) => product.category === "breakfast")
  const brunchProducts = products.filter((product) => product.category === "brunch")
  const lunchProducts = products.filter((product) => product.category === "lunch")
  const dessertProducts = products.filter((product) => product.category === "desserts")

  // Renderizar contenido específico para la categoría "brunch"
  const renderBrunchContent = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Primera fila */}
        <div className="col-span-1">
          <MenuItemCard
            id="sandwich-mediterraneo"
            name="Sándwich Mediterráneo"
            description="Ciabatta de pan de masa madre, cheesecream, queso pategrás, jamón crudo, tomates asados y rúcula."
            price={13300}
            image="/sandwich-mediterraneo.jpg"
            isAdmin={isAdmin}
            onEdit={handleEditProduct}
          />
        </div>
        <div className="col-span-1">
          <MenuItemCard
            id="club-sandwich"
            name="Club Sándwich"
            description="Pollo asado, rúcula, tomates asados, panceta, mostaneza, jamón natural, queso danbo y queso pategrás."
            price={13800}
            image="/club-sandwich.jpg"
            isAdmin={isAdmin}
            onEdit={handleEditProduct}
          />
        </div>
        <div className="col-span-1">
          <MenuItemCard
            id="tosti-madre"
            name="Tosti Madre"
            description="Sándwich en pan de masa madre relleno de jamón natural a la plancha, queso danbo y pategrás, con un toque de mostaza."
            price={8200}
            image="/tosti-madre.jpg"
            isAdmin={isAdmin}
            onEdit={handleEditProduct}
          />
        </div>

        {/* Segunda fila */}
        <div className="col-span-1">
          <MenuItemCard
            id="toston-de-palta"
            name="Tostón de Palta"
            description="Tostada de pan de masa madre, hummus cremoso de garbanzo, champiñones salteados y palta."
            price={7900}
            image="/toston-de-palta.jpg"
            isVegetarian={true}
            isAdmin={isAdmin}
            onEdit={handleEditProduct}
          />
        </div>
        <div className="col-span-1">
          <MenuItemCard
            id="el-benedictino"
            name="El Benedictino"
            description="Dos esponjosos muffins inglés, cheesecream, espinaca salteada, salmón ahumado, huevo media cocción y salsa holandesa cítrica."
            price={8700}
            image="/el-benedictino.jpg"
            isAdmin={isAdmin}
            onEdit={handleEditProduct}
          />
        </div>
        <div className="col-span-1">
          <CroissantHeladoCard isAdmin={isAdmin} onEdit={handleEditProduct} />
        </div>

        {/* Tercera fila - Nuevos productos */}
        <div className="col-span-1">
          <TostiEspinacaCard isAdmin={isAdmin} onEdit={handleEditProduct} />
        </div>
      </div>
    )
  }

  // Renderizar contenido para la categoría "lunch"
  const renderLunchContent = () => {
    return (
      <div className="bg-white/50 p-8 rounded-lg text-center">
        <p className="text-lacapke-charcoal/70">No hay productos disponibles en esta categoría actualmente</p>
      </div>
    )
  }

  // Add this function to render the desserts content
  const renderDessertsContent = () => {
    return (
      <div className="bg-white/50 p-8 rounded-lg text-center">
        <p className="text-lacapke-charcoal/70">No hay productos disponibles en esta categoría actualmente</p>
      </div>
    )
  }

  // Add this function to render the breakfast content
  const renderBreakfastContent = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {breakfastProducts.map((product) => (
          <div className="col-span-1" key={product.id}>
            <SimpleCard
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              isVegetarian={product.isVegetarian}
              isNew={product.isNew}
              image={product.image}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-lacapke-background min-h-screen">
      {/* Desktop Navigation con contador de carrito */}
      <DesktopNavigation user={user} onLoginSuccess={handleLoginSuccess} cartItemCount={cartItemCount} />

      {/* Mobile Header */}
      <header className="lg:hidden px-4 pt-6 pb-2">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className={`h-14 w-14 z-50 -ml-2 text-lacapke-charcoal ${isMenuOpen ? "opacity-0" : "opacity-100"} transition-opacity`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HamburgerIcon className="h-10 w-10" />
          </Button>

          <div className="relative h-20 w-64">
            <Image src="/finall.png" alt="La Capke" fill className="object-contain" priority />
          </div>

          <div className="w-8">{/* Espacio vacío para equilibrar el diseño */}</div>
        </div>

        {/* Promo Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="border border-lacapke-charcoal/20 rounded-full px-4 py-2 flex items-center gap-3 bg-white">
            <div className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-lacapke-charcoal" />
              <div className="text-xs">
                <span className="font-medium text-lacapke-charcoal">Lunes a Jueves</span>
                <br />
                <span className="text-lacapke-charcoal/70 text-[10px]">(excepto feriados)</span>
              </div>
            </div>
            <div className="h-8 w-px bg-lacapke-charcoal/20"></div>
            <div className="text-xs">
              <span className="font-bold text-sm text-lacapke-charcoal">EFECTIVO 10%</span>
              <br />
              <span className="text-lacapke-charcoal/70">DE DESCUENTO</span>
            </div>
          </div>

          {/* Reemplazar el uso de LeafIcon en la sección de promo */}
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-lacapke-charcoal/80">
              <VegetarianBadge className="h-4 w-4" />
              <span>VEGETARIANO</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-lacapke-charcoal/80">
              <VegetarianBadge className="h-4 w-4" />
              <VegetarianBadge className="h-4 w-4" />
              <span>VEGANO</span>
            </div>
          </div>
        </div>

        {/* Slide-out Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.div
          className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl"
          variants={mobileMenuAnimation}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
        >
          {/* Contenido del menú móvil */}
          <div className="relative">
            <motion.button
              variants={menuItemAnimation}
              className="absolute right-2 top-2 h-8 w-8 text-lacapke-charcoal z-20"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <motion.div className="p-6 pt-12 border-b border-lacapke-charcoal/10" variants={menuItemAnimation}>
            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border-2 border-lacapke-cream">
                  <AvatarImage src="/la-capke-logo.png" alt="Admin" />
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lacapke-charcoal text-lg">{user.username}</h3>
                  <p className="text-sm text-lacapke-charcoal/70">Administrador</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Avatar className="h-14 w-14 border-2 border-lacapke-cream mb-2">
                  <AvatarImage src="/la-capke-logo.png" alt="La Capke" />
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
                <Button
                  className="w-full bg-[#f8e1e1] hover:bg-[#f5d4d4] text-lacapke-charcoal"
                  onClick={() => setShowLoginForm(true)}
                >
                  Iniciar Sesión
                </Button>
              </div>
            )}
          </motion.div>

          <motion.nav className="p-4">
            <motion.ul className="space-y-2">
              <motion.li variants={menuItemAnimation}>
                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lacapke-charcoal hover:bg-lacapke-cream/50"
                  >
                    <Home className="mr-3 h-5 w-5" />
                    Home
                  </Button>
                </Link>
              </motion.li>
              <li>
                <Link href="/cart" className="block">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lacapke-charcoal hover:bg-lacapke-cream/50"
                  >
                    <div className="relative mr-3">
                      <ShoppingBag className="h-5 w-5" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#f8e1e1] text-lacapke-charcoal text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {cartItemCount > 9 ? "9+" : cartItemCount}
                        </span>
                      )}
                    </div>
                    Mi Pedido
                  </Button>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lacapke-charcoal hover:bg-lacapke-cream/50"
                  >
                    <PlusCircle className="mr-3 h-5 w-5" />
                    Administrar Productos
                  </Button>
                </li>
              )}
              {user && (
                <li className="pt-4 mt-4 border-t border-lacapke-charcoal/10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </Button>
                </li>
              )}
            </motion.ul>
          </motion.nav>
        </motion.div>

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

        {/* Modal de edición de producto */}
        {showEditModal && (
          <ProductEditModal
            product={editingProduct}
            onClose={() => {
              setShowEditModal(false)
              setEditingProduct(null)
            }}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </header>

      {/* Desktop Promo Section */}
      <div className="hidden lg:flex justify-center py-4">
        <div className="container-app">
          <div className="border border-lacapke-charcoal/20 rounded-full px-6 py-3 flex items-center gap-6 bg-white max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <TicketIcon className="h-6 w-6 text-lacapke-charcoal" />
              <div className="text-sm">
                <span className="font-medium text-lacapke-charcoal">Lunes a Jueves</span>
                <br />
                <span className="text-lacapke-charcoal/70 text-xs">(except feriados)</span>
              </div>
            </div>
            <div className="h-10 w-px bg-lacapke-charcoal/20"></div>
            <div className="text-sm">
              <span className="font-bold text-lg text-lacapke-charcoal">EFECTIVO 10%</span>
              <br />
              <span className="text-lacapke-charcoal/70">DE DESCUENTO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container-app mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input placeholder="Buscar.." className="bg-white border-lacapke-charcoal/20 shadow-sm" />
          </div>
          <Button variant="outline" size="icon" className="bg-white shadow-sm border-lacapke-charcoal/20">
            <Search className="h-5 w-5 text-lacapke-charcoal" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-app pb-20 lg:pb-10">
        {/* Panel de Administración (solo visible para administradores) */}
        {isAdmin && (
          <>
            <AdminPanel
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
              onResetProducts={handleResetProducts}
              onAddCategory={handleAddCategory}
            />
            <div className="flex justify-end mb-4">
              <RefreshDataButton onRefresh={(updatedProducts) => setProducts(updatedProducts)} />
              <Button
                variant="outline"
                size="sm"
                className="ml-2 bg-white shadow-sm border-lacapke-charcoal/20 flex items-center gap-1"
                onClick={forceResetProducts}
                disabled={isResetting}
              >
                <RefreshCw className={`h-4 w-4 ${isResetting ? "animate-spin" : ""}`} />
                Forzar actualización
              </Button>
            </div>
          </>
        )}

        {/* Categories Carousel */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Este div está vacío pero mantiene el espaciado */}
        </motion.div>

        {/* Usar el componente StickyCategoryCarousel */}
        <StickyCategoryCarousel
          categories={[
            { id: "brunch", name: "Brunchear" },
            { id: "breakfast", name: "Desayuno & Merienda" },
            { id: "lunch", name: "Almorzar & Cenar" },
            { id: "desserts", name: "Postres" },
            { id: "bakery", name: "Pastelería & Panadería" },
            { id: "coffee", name: "Cafetería" },
          ]}
          activeCategory={activeCategory}
          onCategoryChange={scrollToCategory}
          rightIcon={
            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 0 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={{ x: [0, 5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <path
                d="M13 17L18 12L13 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 17L11 12L6 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          }
        />

        {/* Sección Brunchear (ahora primero) */}
        <div ref={brunchRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("brunch")}
            </h2>
          </div>
          {renderBrunchContent()}
        </div>

        {/* Sección Desayuno y Merienda (ahora segundo) */}
        <div ref={breakfastRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("breakfast")}
            </h2>
          </div>
          {renderBreakfastContent()}
        </div>

        {/* Sección Almorzar y Cenar */}
        <div ref={lunchRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("lunch")}
            </h2>
          </div>
          {renderLunchContent()}
        </div>

        {/* Sección Postres */}
        <div ref={dessertsRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("desserts")}
            </h2>
          </div>
          {renderDessertsContent()}
        </div>

        {/* Sección Pastelería y Panadería */}
        <div ref={bakeryRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("bakery")}
            </h2>
          </div>
          <div className="bg-white/50 p-8 rounded-lg text-center">
            <p className="text-lacapke-charcoal/70">Próximamente productos de pastelería y panadería</p>
          </div>
        </div>

        {/* Sección Cafetería */}
        <div ref={coffeeRef} className="mb-16 scroll-mt-24">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("coffee")}
            </h2>
          </div>
          <div className="bg-white/50 p-8 rounded-lg text-center">
            <p className="text-lacapke-charcoal/70">Próximamente bebidas de cafetería</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Solo visible en móvil */}
      <div>
        <BottomNavigation cartItemCount={cartItemCount} />
      </div>

      {/* Modal de edición de producto */}
      {showEditModal && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => {
            setShowEditModal(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Modal de edición de categoría */}
      {showCategoryModal && (
        <CategoryEditModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false)
            setEditingCategory(null)
          }}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {/* Botón para volver arriba */}
      <ScrollToTopButton />

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  )
}
