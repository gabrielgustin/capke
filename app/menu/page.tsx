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
import { useSearchParams } from "next/navigation"
import { RefreshDataButton } from "@/components/refresh-data-button"
import { motion } from "framer-motion"
import { StickyCategoryCarousel } from "@/components/sticky-category-carousel"
import { CategoryEditModal, type Category } from "@/components/category-edit-modal"
import { CroissantHeladoCard } from "@/components/featured-cards/croissant-helado-card"
import { TostiEspinacaCard } from "@/components/featured-cards/tosti-espinaca-card"

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
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("brunch")
  const [cartItemCount, setCartItemCount] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const searchParams = useSearchParams()
  const editProductId = searchParams.get("edit")

  // Referencias para las secciones de categorías
  const categoryRefs = useRef<Record<ProductCategory, HTMLDivElement | null>>({
    breakfast: null,
    brunch: null,
    lunch: null,
    desserts: null,
    bakery: null,
    coffee: null,
  })

  // Bandera para evitar conflictos entre scroll manual y programático
  const isScrollingProgrammatically = useRef(false)

  const forceResetProducts = () => {
    setIsResetting(true)
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("products")
    }
    const defaultProducts = resetProducts()
    setProducts(defaultProducts)

    setTimeout(() => {
      setIsResetting(false)
    }, 1000)
  }

  useEffect(() => {
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
    }

    const storedVersion = localStorage.getItem("products_version")

    if (storedVersion !== PRODUCTS_VERSION) {
      forceResetProducts()
      localStorage.setItem("products_version", PRODUCTS_VERSION)
    } else {
      const loadedProducts = getProducts()
      setProducts(loadedProducts)
    }
  }, [])

  useEffect(() => {
    if (editProductId && isAdmin) {
      const productToEdit = products.find((p) => p.id === editProductId)
      if (productToEdit) {
        setEditingProduct(productToEdit)
        setShowEditModal(true)
      }
    }
  }, [editProductId, products])

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

  useEffect(() => {
    const carousel = document.getElementById("categories-carousel")
    if (carousel) {
      setTimeout(() => {
        carousel.scrollLeft = 0
      }, 500)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    })
  }, [])

  // Detección automática de la categoría visible durante el scroll
  useEffect(() => {
    const detectCategoryInView = () => {
      if (isScrollingProgrammatically.current) return

      const scrollPosition = window.scrollY + 200 // Offset para mejor detección

      const categories: ProductCategory[] = ["brunch", "breakfast", "lunch", "desserts", "bakery", "coffee"]

      for (let i = categories.length - 1; i >= 0; i--) {
        const category = categories[i]
        const element = categoryRefs.current[category]

        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY

          if (scrollPosition >= elementTop - 100) {
            if (activeCategory !== category) {
              setActiveCategory(category)
            }
            break
          }
        }
      }
    }

    const handleScroll = () => {
      requestAnimationFrame(detectCategoryInView)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    // Detectar categoría inicial
    setTimeout(detectCategoryInView, 300)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [activeCategory])

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -150, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 150, behavior: "smooth" })
    }
  }

  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
  }

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find((p) => p.id === productId)
    if (productToEdit) {
      setEditingProduct(productToEdit)
      setShowEditModal(true)
    } else {
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

  const handleSaveProduct = (updatedProduct: Product) => {
    const updatedProducts = updateProduct(updatedProduct)
    setProducts(updatedProducts)
    setShowEditModal(false)
    setEditingProduct(null)

    if (updatedProduct.category && updatedProduct.category !== activeCategory) {
      setActiveCategory(updatedProduct.category)
      scrollToCategory(updatedProduct.category)
    }

    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados correctamente",
      duration: 3000,
    })
  }

  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = addProduct(newProduct)
    setProducts(updatedProducts)

    toast({
      title: "Producto añadido",
      description: "El nuevo producto ha sido añadido correctamente",
      duration: 3000,
    })
  }

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = deleteProduct(productId)
    setProducts(updatedProducts)
    setShowEditModal(false)
    setEditingProduct(null)

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado correctamente",
      duration: 3000,
    })
  }

  const handleResetProducts = () => {
    forceResetProducts()
  }

  const handleAddCategory = () => {
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

  const handleSaveCategory = (category: Category) => {
    console.log("Categoría guardada:", category)
    setShowCategoryModal(false)
    setEditingCategory(null)

    toast({
      title: "Categoría guardada",
      description: "La categoría ha sido guardada correctamente",
      duration: 3000,
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    console.log("Categoría eliminada:", categoryId)
    setShowCategoryModal(false)
    setEditingCategory(null)

    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada correctamente",
      duration: 3000,
    })
  }

  const scrollToCategory = (category: ProductCategory) => {
    setActiveCategory(category)
    isScrollingProgrammatically.current = true

    const element = categoryRefs.current[category]

    if (element) {
      const yOffset = -120
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: "smooth" })

      // Resetear la bandera después de que termine el scroll
      setTimeout(() => {
        isScrollingProgrammatically.current = false
      }, 1000)
    }
  }

  const isAdmin = user?.username === "Admin1"

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

  const breakfastProducts = products.filter((product) => product.category === "breakfast")
  const brunchProducts = products.filter((product) => product.category === "brunch")
  const lunchProducts = products.filter((product) => product.category === "lunch")
  const dessertProducts = products.filter((product) => product.category === "desserts")

  const renderBrunchContent = () => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

        <div className="col-span-1">
          <TostiEspinacaCard isAdmin={isAdmin} onEdit={handleEditProduct} />
        </div>
      </div>
    )
  }

  const renderLunchContent = () => {
    return (
      <div className="bg-white/50 p-8 rounded-lg text-center">
        <p className="text-lacapke-charcoal/70">No hay productos disponibles en esta categoría actualmente</p>
      </div>
    )
  }

  const renderDessertsContent = () => {
    return (
      <div className="bg-white/50 p-8 rounded-lg text-center">
        <p className="text-lacapke-charcoal/70">No hay productos disponibles en esta categoría actualmente</p>
      </div>
    )
  }

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
      <Header />

      <DesktopNavigation user={user} onLoginSuccess={handleLoginSuccess} cartItemCount={cartItemCount} />

      <main className="container-app lg:pb-10 pb-20">
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

        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        ></motion.div>

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
        />

        <div ref={(el) => (categoryRefs.current.brunch = el)} className="mb-16 scroll-mt-24" data-category="brunch">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("brunch")}
            </h2>
          </div>
          {renderBrunchContent()}
        </div>

        <div
          ref={(el) => (categoryRefs.current.breakfast = el)}
          className="mb-16 scroll-mt-24"
          data-category="breakfast"
        >
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("breakfast")}
            </h2>
          </div>
          {renderBreakfastContent()}
        </div>

        <div ref={(el) => (categoryRefs.current.lunch = el)} className="mb-16 scroll-mt-24" data-category="lunch">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("lunch")}
            </h2>
          </div>
          {renderLunchContent()}
        </div>

        <div ref={(el) => (categoryRefs.current.desserts = el)} className="mb-16 scroll-mt-24" data-category="desserts">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("desserts")}
            </h2>
          </div>
          {renderDessertsContent()}
        </div>

        <div ref={(el) => (categoryRefs.current.bakery = el)} className="mb-16 scroll-mt-24" data-category="bakery">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-xl font-bold text-lacapke-charcoal uppercase tracking-wide mb-2">
              {getCategoryTitle("bakery")}
            </h2>
          </div>
          <div className="bg-white/50 p-8 rounded-lg text-center">
            <p className="text-lacapke-charcoal/70">Próximamente productos de pastelería y panadería</p>
          </div>
        </div>

        <div ref={(el) => (categoryRefs.current.coffee = el)} className="mb-16 scroll-mt-24" data-category="coffee">
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

      <div>
        <BottomNavigation cartItemCount={cartItemCount} />
      </div>

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

      <Toaster />
    </div>
  )
}
