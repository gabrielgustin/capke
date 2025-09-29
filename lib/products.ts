// Tipos
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: ProductCategory
  isVegetarian?: boolean
  isNew?: boolean
  variants?: ProductVariant[]
  optional?: string
  hasDoubleVegetarian?: boolean
}

export interface ProductVariant {
  name: string
  price: number
}

export type ProductCategory = "breakfast" | "brunch" | "lunch" | "desserts" | "bakery" | "coffee"

// Función para obtener URL de imagen válida
export function getValidImageUrl(image?: string): string {
  if (!image) return "/default-product-icon.png"

  // Manejar casos específicos por ID de producto
  if (image.includes("croissant-con-helado")) {
    return "/croissant-con-helado-new.png"
  }

  // Lista de imágenes válidas conocidas
  const validImages = [
    "/sandwich-mediterraneo.jpg",
    "/club-sandwich.jpg",
    "/tosti-madre.jpg",
    "/toston-de-palta.jpg",
    "/el-benedictino.jpg",
    "/tosti-espinaca-champis-new.png",
    "/croissant-con-helado-new.png",
    "/me-lo-merezco.jpg",
    "/querido-bowl.jpg",
    "/chipa-prensado.jpg",
    "/fosforito-la-capke.png",
    "/fosforito-clasico.png",
    "/burrito-champis.png",
    "/chicken-pasta.png",
    "/ensalada-salmon.png",
    "/fiery-noodle-feast.png",
    "/savory-shrimp-pasta.png",
    "/porcion-papas.png",
    "/fried-plantain.png",
    "/milanesa-berenjena-new.jpg",
    "/milanesa-papas-new.jpg",
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

// Función para obtener todos los productos con información completa
export function getProducts(): Product[] {
  const savedProducts = typeof localStorage !== "undefined" ? localStorage.getItem("products") : null

  if (savedProducts) {
    try {
      return JSON.parse(savedProducts)
    } catch (e) {
      console.error("Error parsing saved products", e)
    }
  }

  // Productos por defecto con información completa
  return [
    // BRUNCH
    {
      id: "sandwich-mediterraneo",
      name: "Sándwich Mediterráneo",
      description: "Ciabatta de pan de masa madre, cheesecream, queso pategrás, jamón crudo, tomates asados y rúcula.",
      price: 13300,
      image: "/sandwich-mediterraneo.jpg",
      category: "brunch",
    },
    {
      id: "club-sandwich",
      name: "Club Sándwich",
      description:
        "Pollo asado, rúcula, tomates asados, panceta, mostaneza, jamón natural, queso danbo y queso pategrás.",
      price: 13800,
      image: "/club-sandwich.jpg",
      category: "brunch",
    },
    {
      id: "tosti-madre",
      name: "Tosti Madre",
      description:
        "Sándwich en pan de masa madre relleno de jamón natural a la plancha, queso danbo y pategrás, con un toque de mostaza.",
      price: 8200,
      image: "/tosti-madre.jpg",
      category: "brunch",
    },
    {
      id: "toston-de-palta",
      name: "Tostón de Palta",
      description: "Tostada de pan de masa madre, hummus cremoso de garbanzo, champiñones salteados y palta.",
      price: 7900,
      image: "/toston-de-palta.jpg",
      category: "brunch",
      isVegetarian: true,
    },
    {
      id: "el-benedictino",
      name: "El Benedictino",
      description:
        "Dos esponjosos muffins inglés, cheesecream, espinaca salteada, salmón ahumado, huevo media cocción y salsa holandesa cítrica.",
      price: 8700,
      image: "/el-benedictino.jpg",
      category: "brunch",
    },
    {
      id: "croissant-con-helado",
      name: "Croissant con Helado",
      description:
        "Croissant tibio y crujiente acompañado de una generosa porción de helado artesanal. Una combinación perfecta entre lo cálido y lo fresco.",
      price: 6900,
      image: "/croissant-con-helado-new.png",
      category: "brunch",
      isVegetarian: true,
    },
    {
      id: "tosti-espinaca-champis",
      name: "Tosti de Espinaca y Champis",
      description:
        "Tostada de pan de masa madre con espinaca fresca salteada, champiñones dorados y queso derretido. Una opción saludable y deliciosa.",
      price: 8200,
      image: "/tosti-espinaca-champis-new.png",
      category: "brunch",
      isVegetarian: true,
    },

    // BREAKFAST
    {
      id: "me-lo-merezco",
      name: "Me lo Merezco",
      description:
        "Torre de tres platos para compartir entre 2 personas. Incluye una porción de torta a elección, mafalda prensada de jamón natural y queso danbo, y muffin inglés con queso danbo, panceta, cheesecream y huevo frito.",
      price: 22000,
      image: "/me-lo-merezco.jpg",
      category: "breakfast",
    },
    {
      id: "querido-bowl",
      name: "Querido Bowl",
      description:
        "Bowl nutritivo con base de quinoa, vegetales frescos de estación, palta, semillas y aderezo casero. Una opción completa y saludable.",
      price: 9800,
      image: "/querido-bowl.jpg",
      category: "breakfast",
      isVegetarian: true,
    },
    {
      id: "chipa-prensado",
      name: "Chipá Prensado",
      description:
        "Chipá tradicional cordobés prensado y tostado, relleno con jamón y queso. Servido caliente y crujiente.",
      price: 3500,
      image: "/chipa-prensado.jpg",
      category: "breakfast",
    },
    {
      id: "fosforito-la-capke",
      name: "Fosforito La Capke",
      description:
        "Nuestra versión especial del clásico fosforito cordobés, con ingredientes premium y el toque distintivo de La Capke.",
      price: 4200,
      image: "/fosforito-la-capke.png",
      category: "breakfast",
    },
    {
      id: "fosforito-clasico",
      name: "Fosforito Clásico",
      description: "El tradicional fosforito cordobés en su versión más auténtica. Simple, delicioso y nostálgico.",
      price: 3800,
      image: "/fosforito-clasico.png",
      category: "breakfast",
    },

    // LUNCH
    {
      id: "burrito-champis",
      name: "Burrito de Champiñones",
      description:
        "Tortilla de trigo rellena con champiñones salteados, arroz, frijoles negros, queso, palta y salsa criolla. Una explosión de sabores.",
      price: 11500,
      image: "/burrito-champis.png",
      category: "lunch",
      isVegetarian: true,
    },
    {
      id: "chicken-pasta",
      name: "Pasta con Pollo",
      description:
        "Pasta fresca con trozos de pollo grillado, vegetales de estación y salsa cremosa. Acompañada con queso parmesano.",
      price: 13200,
      image: "/chicken-pasta.png",
      category: "lunch",
    },
    {
      id: "ensalada-salmon",
      name: "Ensalada de Salmón",
      description:
        "Mix de hojas verdes, salmón ahumado, palta, tomates cherry, pepino y aderezo cítrico. Fresca y nutritiva.",
      price: 14800,
      image: "/ensalada-salmon.png",
      category: "lunch",
    },
    {
      id: "fiery-noodle-feast",
      name: "Fideos Picantes",
      description:
        "Fideos asiáticos con vegetales salteados y salsa picante. Un plato con personalidad para los amantes del picante.",
      price: 10900,
      image: "/fiery-noodle-feast.png",
      category: "lunch",
      isVegetarian: true,
    },
    {
      id: "savory-shrimp-pasta",
      name: "Pasta con Camarones",
      description: "Pasta con camarones frescos, ajo, perejil y aceite de oliva. Un clásico de la cocina mediterránea.",
      price: 16500,
      image: "/savory-shrimp-pasta.png",
      category: "lunch",
    },
    {
      id: "porcion-papas",
      name: "Porción de Papas",
      description: "Papas fritas caseras, doradas y crujientes. Perfectas como acompañamiento o para compartir.",
      price: 4500,
      image: "/porcion-papas.png",
      category: "lunch",
      isVegetarian: true,
    },
    {
      id: "fried-plantain",
      name: "Plátano Frito",
      description: "Plátano maduro frito hasta lograr el punto perfecto de caramelización. Dulce y reconfortante.",
      price: 3800,
      image: "/fried-plantain.png",
      category: "lunch",
      isVegetarian: true,
    },
    {
      id: "milanesa-berenjena",
      name: "Milanesa de Berenjena",
      description: "Milanesa de berenjena empanada y dorada, acompañada con puré de papas casero y ensalada fresca.",
      price: 12800,
      image: "/milanesa-berenjena-new.jpg",
      category: "lunch",
      isVegetarian: true,
      variants: [
        { name: "Adulto", price: 12800 },
        { name: "Niños", price: 8500 },
      ],
    },
    {
      id: "milanesa-papas",
      name: "Milanesa con Papas",
      description: "Clásica milanesa de carne empanada y frita, acompañada con papas fritas caseras y ensalada mixta.",
      price: 14200,
      image: "/milanesa-papas-new.jpg",
      category: "lunch",
      variants: [
        { name: "Adulto", price: 14200 },
        { name: "Niños", price: 9800 },
      ],
    },
    {
      id: "wrap-pollo",
      name: "Wrap de Pollo",
      description:
        "Tortilla de wrap con mix de verdes, pollo marinado horneado, champiñones, cilantro, panceta, tomates asados, queso danbo, queso pategrás y aderezo de yogurt y pepino.",
      price: 12500,
      image: "/wrap-pollo.png",
      category: "lunch",
      isNew: true,
    },
    {
      id: "vegetable-curry",
      name: "Curry de Vegetales",
      description:
        "Curry aromático con brócoli, zanahorias, coliflor, arvejas y pimientos, servido con arroz basmati. Opción vegana disponible.",
      price: 11800,
      image: "/vegetable-curry.png",
      category: "lunch",
      isVegetarian: true,
      isNew: true,
    },
  ]
}

// Función para obtener productos destacados
export function getFeaturedProducts(): Product[] {
  const products = getProducts()
  return products.filter(
    (product) => product.isNew || product.id === "me-lo-merezco" || product.id === "tosti-espinaca-champis",
  )
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
  const defaultProducts = getProducts()
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem("products")
  }
  return defaultProducts
}

export function getDefaultCategory(productId: string, productName: string): ProductCategory {
  if (
    productId.includes("sandwich") ||
    productId.includes("tosti") ||
    productId.includes("club") ||
    productId.includes("benedictino") ||
    productId.includes("croissant")
  ) {
    return "brunch"
  } else if (productId.includes("cafe") || productId.includes("latte")) {
    return "coffee"
  } else if (productId.includes("torta") || productId.includes("postre")) {
    return "desserts"
  } else if (productId.includes("pan") || productId.includes("croissant")) {
    return "bakery"
  } else if (
    productId.includes("milanesa") ||
    productId.includes("ensalada") ||
    productId.includes("pasta") ||
    productId.includes("wrap") ||
    productId.includes("curry") ||
    productId.includes("burrito")
  ) {
    return "lunch"
  } else {
    return "breakfast"
  }
}

// Versión actualizada
export const PRODUCTS_VERSION = "2024-01-15-002"
