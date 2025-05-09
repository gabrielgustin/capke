"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, ProductCategory } from "@/lib/products"

interface ProductEditModalProps {
  product: Product | null
  onClose: () => void
  onSave: (product: Product) => void
  onDelete?: (productId: string) => void
}

export function ProductEditModal({ product, onClose, onSave, onDelete }: ProductEditModalProps) {
  const [editedProduct, setEditedProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    isVegetarian: false,
    variants: [],
    category: null,
  })

  // Cargar los datos del producto cuando se abre el modal
  useEffect(() => {
    if (product) {
      // Asegurarse de que la categoría esté definida
      const category =
        product.category ||
        (product.id.includes("sandwich") || product.id.includes("tosti")
          ? "brunch"
          : product.id.includes("cafe") || product.id.includes("latte")
            ? "coffee"
            : product.id.includes("torta") || product.id.includes("postre")
              ? "desserts"
              : product.id.includes("pan") || product.id.includes("croissant")
                ? "bakery"
                : product.id.includes("milanesa") || product.id.includes("ensalada")
                  ? "lunch"
                  : "breakfast")

      setEditedProduct({
        ...product,
        variants: product.variants || [],
        category: category,
      })
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleVegetarianChange = (checked: boolean) => {
    setEditedProduct((prev) => ({
      ...prev,
      isVegetarian: checked,
    }))
  }

  const handleCategoryChange = (value: string) => {
    setEditedProduct((prev) => ({
      ...prev,
      category: value as ProductCategory,
    }))
  }

  const handleVariantChange = (index: number, field: "name" | "price", value: string) => {
    setEditedProduct((prev) => {
      const updatedVariants = [...(prev.variants || [])]
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: field === "price" ? Number.parseFloat(value) || 0 : value,
      }
      return {
        ...prev,
        variants: updatedVariants,
      }
    })
  }

  const addVariant = () => {
    setEditedProduct((prev) => ({
      ...prev,
      variants: [...(prev.variants || []), { name: "", price: 0 }],
    }))
  }

  const removeVariant = (index: number) => {
    setEditedProduct((prev) => {
      const updatedVariants = [...(prev.variants || [])]
      updatedVariants.splice(index, 1)
      return {
        ...prev,
        variants: updatedVariants,
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que los campos requeridos estén completos
    if (!editedProduct.name || editedProduct.price <= 0) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    // Guardar el producto
    onSave(editedProduct)
  }

  const handleDelete = () => {
    if (onDelete && product && confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      onDelete(product.id)
    }
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-lacapke-charcoal">Editar Producto</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-lacapke-charcoal rounded-full"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lacapke-charcoal">
                  Nombre
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleChange}
                  className="border-lacapke-charcoal/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-lacapke-charcoal">
                  Categoría
                </Label>
                <Select
                  value={editedProduct.category || ""}
                  onValueChange={handleCategoryChange}
                  defaultValue={editedProduct.category || ""}
                >
                  <SelectTrigger className="border-lacapke-charcoal/20 rounded-xl">
                    <SelectValue
                      placeholder={
                        editedProduct.category === "breakfast"
                          ? "Desayuno & Merienda"
                          : editedProduct.category === "brunch"
                            ? "Brunchear"
                            : editedProduct.category === "lunch"
                              ? "Almuerzo & Cena"
                              : editedProduct.category === "desserts"
                                ? "Postres"
                                : editedProduct.category === "bakery"
                                  ? "Pastelería & Panadería"
                                  : editedProduct.category === "coffee"
                                    ? "Cafetería"
                                    : "Selecciona una categoría"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="breakfast">Desayuno & Merienda</SelectItem>
                    <SelectItem value="brunch">Brunchear</SelectItem>
                    <SelectItem value="lunch">Almuerzo & Cena</SelectItem>
                    <SelectItem value="desserts">Postres</SelectItem>
                    <SelectItem value="bakery">Pastelería & Panadería</SelectItem>
                    <SelectItem value="coffee">Cafetería</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lacapke-charcoal">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={editedProduct.description}
                  onChange={handleChange}
                  className="border-lacapke-charcoal/20 min-h-[80px] rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-lacapke-charcoal">
                  Precio
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editedProduct.price}
                  onChange={handleChange}
                  className="border-lacapke-charcoal/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-lacapke-charcoal">
                  URL de la imagen
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={editedProduct.image || ""}
                  onChange={handleChange}
                  className="border-lacapke-charcoal/20"
                  placeholder="/placeholder.svg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVegetarian"
                  checked={editedProduct.isVegetarian || false}
                  onCheckedChange={handleVegetarianChange}
                />
                <Label htmlFor="isVegetarian" className="text-lacapke-charcoal">
                  Vegetariano
                </Label>
              </div>

              {/* Variantes */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lacapke-charcoal font-medium">Variantes</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-lacapke-charcoal/20 rounded-xl"
                    onClick={addVariant}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Añadir variante
                  </Button>
                </div>

                {editedProduct.variants && editedProduct.variants.length > 0 ? (
                  <div className="space-y-3">
                    {editedProduct.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 border p-2 rounded-xl border-lacapke-charcoal/20"
                      >
                        <div className="flex-1">
                          <Input
                            value={variant.name}
                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                            className="border-lacapke-charcoal/20 mb-1"
                            placeholder="Nombre de la variante"
                          />
                          <Input
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            className="border-lacapke-charcoal/20"
                            placeholder="Precio"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 rounded-full"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-lacapke-charcoal/70 italic">No hay variantes</p>
                )}
              </div>

              <div className="flex justify-between pt-4">
                {onDelete && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50 rounded-xl"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-lacapke-charcoal/20 rounded-xl"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#f8e1e1] hover:bg-[#f5d4d4] text-lacapke-charcoal font-medium rounded-xl"
                  >
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
