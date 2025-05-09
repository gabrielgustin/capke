"use client"

import { useState } from "react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const colors = ["#f8f5d7", "#e0ebe5", "#f8d7d7", "#d1a054", "#e0f0e9", "#ffffff", "#000000"]

  return (
    <div>
      <div
        className="h-8 w-8 rounded-md border border-lacapke-charcoal/20 cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setIsPickerOpen(!isPickerOpen)}
      />

      {isPickerOpen && (
        <div className="absolute z-50 bg-white rounded-md shadow-md p-2">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((c) => (
              <div
                key={c}
                className="h-6 w-6 rounded-md cursor-pointer"
                style={{ backgroundColor: c }}
                onClick={() => {
                  onChange(c)
                  setIsPickerOpen(false)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
