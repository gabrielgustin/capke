"use client"

import { useState, useEffect, useRef } from "react"
import { Edit, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/bottom-navigation"
import { MenuItemCard } from "@/components/menu-item-card"
import { AdminPanel } from "@/components/admin-panel"
import { ProductEditModal } from "@/components/product-edit-modal"
import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { getAuthState, type User } from "@/lib/auth"
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
import { motion } from "framer-motion"

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

export default function MenuPage() {
  const [user, setUser] = useState<User | null>(null)
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

  // Función para manejar el inicio de sesión exitoso
  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
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

  // Función para hacer scroll a la categoría seleccionada
  const scrollToCategory = (category: ProductCategory) => {
    setActiveCategory(category)

    // Solo hacer scroll si es una interacción manual del usuario
    if (document.activeElement && document.activeElement.tagName === "BUTTON") {
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
        <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full flex flex-col p-2 sm:p-3 relative">
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
      {/* Nuevo Header con el estilo de la imagen de referencia */}
      <Header />

      {/* Desktop Navigation con contador de carrito */}
      <DesktopNavigation user={user} onLoginSuccess={handleLoginSuccess} cartItemCount={cartItemCount} />

      {/* Main Content */}
      <main className="container-app lg:pb-10 pb-20">
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
        <div ref={brunchRef} className="mb-16 scroll-mt-24" data-category="brunch">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("brunch")}
            </h2>
          </div>
          {renderBrunchContent()}
        </div>

        {/* Sección Desayuno y Merienda (ahora segundo) */}
        <div ref={breakfastRef} className="mb-16 scroll-mt-24" data-category="breakfast">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("breakfast")}
            </h2>
          </div>
          {renderBreakfastContent()}
        </div>

        {/* Sección Almorzar y Cenar */}
        <div ref={lunchRef} className="mb-16 scroll-mt-24" data-category="lunch">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("lunch")}
            </h2>
          </div>
          {renderLunchContent()}
        </div>

        {/* Sección Postres */}
        <div ref={dessertsRef} className="mb-16 scroll-mt-24" data-category="desserts">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("desserts")}
            </h2>
          </div>
          {renderDessertsContent()}
        </div>

        {/* Sección Pastelería y Panadería */}
        <div ref={bakeryRef} className="mb-16 scroll-mt-24" data-category="bakery">
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
        <div ref={coffeeRef} className="mb-16 scroll-mt-24" data-category="coffee">
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

      {/* Toaster para notificaciones */}
      <Toaster />
    </div>
  )
}
