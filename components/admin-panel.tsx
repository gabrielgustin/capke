"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductEditModal } from "@/components/product-edit-modal"
import type { Product } from "@/lib/products"

// Actualizar la interfaz AdminPanelProps para incluir los nuevos handlers
interface AdminPanelProps {
  products: Product[]
  onAddProduct: (product: Product) => void
  onUpdateProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
  onResetProducts: () => void
  onAddCategory?: () => void
}

// Actualizar la función AdminPanel para incluir el nuevo botón
export function AdminPanel({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  onAddCategory,
}: AdminPanelProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleAddProduct = () => {
    // Crear un nuevo producto con valores predeterminados
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: "Nuevo Producto",
      description: "",
      price: 0,
      isVegetarian: false,
      variants: [],
    }
    setSelectedProduct(newProduct)
    setShowModal(true)
  }

  const handleSaveProduct = (product: Product) => {
    // Verificar si es un producto nuevo o existente
    const isNewProduct = !products.some((p) => p.id === product.id)

    if (isNewProduct) {
      onAddProduct(product)
    } else {
      onUpdateProduct(product)
    }

    setShowModal(false)
    setSelectedProduct(null)
  }

  const handleResetProducts = () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los productos a sus valores originales?")) {
      onResetProducts()
    }
  }

  return (
    <div className="mb-8">
      <Card className="border-lacapke-charcoal/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-lacapke-charcoal">Panel de Administración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-[#f8e1e1] hover:bg-[#f5d4d4] text-lacapke-charcoal font-medium"
              onClick={handleAddProduct}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Producto
            </Button>

            <Button
              className="bg-[#e0ebe5] hover:bg-[#d3e8df] text-lacapke-charcoal font-medium"
              onClick={onAddCategory}
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Categoría
            </Button>
          </div>
          <p className="text-sm text-lacapke-charcoal/70 mt-3">
            Como administrador, puedes añadir, editar o eliminar productos y categorías. Los cambios se guardarán
            automáticamente durante tu sesión.
          </p>
        </CardContent>
      </Card>

      {showModal && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false)
            setSelectedProduct(null)
          }}
          onSave={handleSaveProduct}
          onDelete={onDeleteProduct}
        />
      )}
    </div>
  )
}
