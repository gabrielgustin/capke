// Tipos
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category?: ProductCategory
  isVegetarian?: boolean
  isNew?: boolean
  isFeatured?: boolean
  size?: "small" | "medium" | "large"
  variants?: ProductVariant[]
}

export interface ProductVariant {
  name: string
  price: number
}

export type ProductCategory = "breakfast" | "brunch" | "lunch" | "desserts" | "bakery" | "coffee"

// También actualizar la función getValidImageUrl para eliminar las referencias a los productos eliminados

export function getValidImageUrl(image?: string): string {
  if (!image) return "/default-product-icon.png"

  // Manejar casos específicos por ID de producto
  if (image.includes("croissant-con-helado")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/croissant-con-helado-new-gyMAjojOB3VX5ONzNrvhI7qKT6LcvR.png" // URL de blob para croissant con helado
  }

  // Lista de imágenes válidas conocidas
  const validImages = [
    "/querido-bowl.png",
    "/querido-bowl.jpg",
    "/pop-cake.png",
    "/pop-cake.jpg",
    "/me-lo-merezco.png",
    "/me-lo-merezco.jpg",
    "/chipa-prensado.jpg",
    "/chipa-prensado.png",
    "/fosforito-la-capke.png",
    "/fosforito-clasico.png",
    "/sandwich-mediterraneo.jpg",
    "/club-sandwich.jpg",
    "/tosti-madre.jpg",
    "/toston-de-palta.jpg",
    "/el-benedictino.jpg",
    "/tosti-espinaca-champis.jpg",
    "/tosti-espinaca-champis-new.png",
    "/burrito-champis.png",
    "/chicken-pasta.png",
    "/ensalada-salmon.png",
    "/fiery-noodle-feast.png",
    "/savory-shrimp-pasta.png",
    "/porcion-papas.png",
    "/fried-plantain.png",
    "/milanesa-berenjena-new.jpg",
    "/milanesa-berenjena.png",
    "/milanesa-papas-new.jpg",
    "/milanesa-papas.png",
    "/wrap-pollo.png",
    "/vegetable-curry.png",
    "/default-product-icon.png",
    "/placeholder.svg",
  ]

  // Verificar si la URL está en la lista de imágenes válidas
  if (validImages.includes(image)) {
    return image
  }

  // Si la URL comienza con http o https, asumimos que es una URL externa válida
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image
  }

  // Si no es una URL válida, devolver la imagen por defecto
  return "/default-product-icon.png"
}

// Función para obtener todos los productos
export function getProducts(): Product[] {
  let storedProducts
  if (typeof localStorage !== "undefined") {
    storedProducts = localStorage.getItem("products")
  }

  // Versión actualizada: Forzar el uso de defaultProducts en producción
  // o si la versión almacenada es antigua
  const forceReset = process.env.NODE_ENV === "production" || true

  if (storedProducts && !forceReset) {
    try {
      return JSON.parse(storedProducts)
    } catch (error) {
      console.error("Error parsing stored products:", error)
      return defaultProducts
    }
  } else {
    // Guardar los productos predeterminados en localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("products", JSON.stringify(defaultProducts))
    }
    return defaultProducts
  }
}

// Función para obtener productos destacados
export function getFeaturedProducts(): Product[] {
  const products = getProducts()
  return products.filter((product) => product.isFeatured)
}

// Función para actualizar un producto
export function updateProduct(updatedProduct: Product): Product[] {
  const products = getProducts()
  const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }
  return updatedProducts
}

// Función para eliminar un producto
export function deleteProduct(productId: string): Product[] {
  const products = getProducts()
  const updatedProducts = products.filter((product) => product.id !== productId)
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }
  return updatedProducts
}

// Función para añadir un producto
export function addProduct(newProduct: Product): Product[] {
  const products = getProducts()
  const updatedProducts = [...products, newProduct]
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }
  return updatedProducts
}

// Función para restablecer los productos a los valores originales
export function resetProducts(): Product[] {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("products", JSON.stringify(defaultProducts))
  }
  return defaultProducts
}

export function getDefaultCategory(productId: string, productName: string): ProductCategory {
  if (productId.includes("sandwich") || productId.includes("tosti")) {
    return "brunch"
  } else if (productId.includes("cafe") || productId.includes("latte")) {
    return "coffee"
  } else if (productId.includes("torta") || productId.includes("postre")) {
    return "desserts"
  } else if (productId.includes("pan") || productId.includes("croissant")) {
    return "bakery"
  } else if (productId.includes("milanesa") || productId.includes("ensalada")) {
    return "lunch"
  } else {
    return "breakfast"
  }
}

// Versión actualizada: Añadir una marca de tiempo para forzar la actualización
export const PRODUCTS_VERSION = "2023-05-01-001"

// Modificar el array defaultProducts para eliminar los productos mencionados
// Eliminar también "mafalda-prensada"

const defaultProducts: Product[] = [
  {
    id: "me-lo-merezco",
    name: "Me lo merezco",
    description: "Brunch completo para disfrutar. • Incluye porción de torta y muffin inglés con huevo.",
    price: 3500,
    image: "/me-lo-merezco-brunch.jpg",
    category: "brunch",
    isVegetarian: false,
    isFeatured: true,
    size: "large",
  },
  {
    id: "querido-bowl",
    name: "Querido Bowl",
    description: "Bowl de yogurt natural con granola casera y frutas de estación.",
    price: 2200,
    image: "/querido-bowl.jpg",
    category: "breakfast",
    isVegetarian: true,
    isFeatured: false,
    size: "medium",
  },
  {
    id: "croissant-con-helado",
    name: "Croissant con Helado",
    description: "Croissant de manteca con helado de crema americana y frutas.",
    price: 2800,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/croissant-con-helado-new-gyMAjojOB3VX5ONzNrvhI7qKT6LcvR.png",
    category: "breakfast",
    isVegetarian: true,
    isNew: true,
    isFeatured: false,
    size: "medium",
  },
  {
    id: "tosti-espinaca-champis",
    name: "Tosti de Espinaca y Champiñones",
    description: "Tostada de pan de masa madre con espinaca, champiñones y queso muzzarella.",
    price: 2700,
    image: "/tosti-espinaca-champis-new.png",
    category: "breakfast",
    isVegetarian: true,
    isFeatured: true,
    size: "medium",
  },
  {
    id: "milanesa-berenjena",
    name: "Milanesa de Berenjena",
    description: "Milanesa de berenjena con ensalada fresca.",
    price: 3200,
    image: "/milanesa-berenjena-new.jpg",
    category: "lunch",
    isVegetarian: true,
    isFeatured: false,
    size: "large",
  },
  {
    id: "milanesa-papas",
    name: "Milanesa con Papas",
    description: "Milanesa de carne con papas fritas.",
    price: 3500,
    image: "/milanesa-papas-new.jpg",
    category: "lunch",
    isVegetarian: false,
    isFeatured: false,
    size: "large",
  },
  {
    id: "wrap-pollo",
    name: "Wrap de Pollo",
    description: "Wrap de pollo con vegetales frescos y aderezo especial.",
    price: 2900,
    image: "/wrap-pollo.png",
    category: "lunch",
    isVegetarian: false,
    isFeatured: true,
    size: "medium",
  },
  {
    id: "sandwich-mediterraneo",
    name: "Sandwich Mediterráneo",
    description: "Sandwich con vegetales asados, queso de cabra y pesto.",
    price: 2800,
    image: "/sandwich-mediterraneo.jpg",
    category: "lunch",
    isVegetarian: true,
    isFeatured: false,
    size: "medium",
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    description: "Sandwich triple con pollo, panceta, huevo, lechuga y tomate.",
    price: 3100,
    image: "/club-sandwich.jpg",
    category: "lunch",
    isVegetarian: false,
    isFeatured: false,
    size: "large",
  },
  {
    id: "ensalada-salmon",
    name: "Ensalada de Salmón",
    description: "Ensalada fresca con salmón ahumado, aguacate y aderezo cítrico.",
    price: 3300,
    image: "/ensalada-salmon.png",
    category: "lunch",
    isVegetarian: false,
    isFeatured: false,
    size: "medium",
  },
  {
    id: "porcion-papas",
    name: "Porción de Papas",
    description: "Papas fritas con alioli casero.",
    price: 1800,
    image: "/porcion-papas.png",
    category: "lunch",
    isVegetarian: true,
    isFeatured: false,
    size: "small",
  },
  {
    id: "pop-cake",
    name: "Pop Cake",
    description: "Torta en palito bañada en chocolate.",
    price: 1500,
    image: "/pop-cake.png",
    category: "breakfast",
    isVegetarian: true,
    isFeatured: true,
    size: "small",
  },
]
