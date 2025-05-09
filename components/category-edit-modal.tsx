"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Category {
  id: string
  name: string
  backgroundColor?: string
  textColor?: string
  icon?: string
}

interface CategoryEditModalProps {
  category: Category | null
  onClose: () => void
  onSave: (category: Category) => void
  onDelete?: (categoryId: string) => void
}

export function CategoryEditModal({ category, onClose, onSave, onDelete }: CategoryEditModalProps) {
  const [editedCategory, setEditedCategory] = useState<Category>({
    id: "",
    name: "",
    backgroundColor: "#f8f5d7",
    textColor: "#4a4a4a",
    icon: "coffee",
  })

  // Cargar los datos de la categoría cuando se abre el modal
  useEffect(() => {
    if (category) {
      setEditedCategory({
        ...category,
      })
    }
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedCategory((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleColorChange = (colorType: "backgroundColor" | "textColor", color: string) => {
    setEditedCategory((prev) => ({
      ...prev,
      [colorType]: color,
    }))
  }

  const handleIconChange = (icon: string) => {
    setEditedCategory((prev) => ({
      ...prev,
      icon,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que los campos requeridos estén completos
    if (!editedCategory.name) {
      alert("Por favor completa el nombre de la categoría")
      return
    }

    // Si no hay ID, generar uno basado en el nombre
    if (!editedCategory.id) {
      const id = editedCategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")

      editedCategory.id = id
    }

    // Guardar la categoría
    onSave(editedCategory)
  }

  const handleDelete = () => {
    if (onDelete && category && confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      onDelete(category.id)
    }
  }

  if (!category) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-lacapke-charcoal">
                {category.id ? "Editar Categoría" : "Nueva Categoría"}
              </CardTitle>
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
                  value={editedCategory.name}
                  onChange={handleChange}
                  className="border-lacapke-charcoal/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-lacapke-charcoal">Color de Fondo</Label>
                  <div
                    className="h-10 rounded-md border border-lacapke-charcoal/20 cursor-pointer"
                    style={{ backgroundColor: editedCategory.backgroundColor }}
                    onClick={() => {
                      // Aquí iría la lógica para abrir un selector de color
                      // Por simplicidad, usamos un conjunto predefinido de colores
                      const colors = ["#f8f5d7", "#e0ebe5", "#f8d7d7", "#d1a054", "#e0f0e9"]
                      const currentIndex = colors.indexOf(editedCategory.backgroundColor || "#f8f5d7")
                      const nextIndex = (currentIndex + 1) % colors.length
                      handleColorChange("backgroundColor", colors[nextIndex])
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-lacapke-charcoal">Color de Texto</Label>
                  <div
                    className="h-10 rounded-md border border-lacapke-charcoal/20 cursor-pointer"
                    style={{ backgroundColor: editedCategory.textColor }}
                    onClick={() => {
                      // Selector simple de color de texto
                      const colors = ["#4a4a4a", "#ffffff", "#000000", "#d1a054"]
                      const currentIndex = colors.indexOf(editedCategory.textColor || "#4a4a4a")
                      const nextIndex = (currentIndex + 1) % colors.length
                      handleColorChange("textColor", colors[nextIndex])
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lacapke-charcoal">Icono</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["coffee", "utensils", "sandwich", "cake", "croissant"].map((icon) => (
                    <div
                      key={icon}
                      className={`h-12 flex items-center justify-center rounded-md cursor-pointer ${
                        editedCategory.icon === icon
                          ? "bg-lacapke-cream border-2 border-lacapke-accent"
                          : "bg-white border border-lacapke-charcoal/20"
                      }`}
                      onClick={() => handleIconChange(icon)}
                    >
                      <span className="text-lacapke-charcoal capitalize text-xs">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                {onDelete && category.id && (
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
