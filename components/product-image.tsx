"use client"

import { useState } from "react"
import Image from "next/image"
import { getValidImageUrl } from "@/lib/products"

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

export function ProductImage({
  src,
  alt,
  className = "object-cover",
  fill = true,
  width,
  height,
  priority = false,
  sizes,
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const validSrc = error ? "/default-product-icon.png" : getValidImageUrl(src)

  const handleError = () => {
    console.log(`Error loading image: ${src}`)
    setError(true)
  }

  return fill ? (
    <Image
      src={validSrc || "/placeholder.svg"}
      alt={alt}
      fill
      className={className}
      onError={handleError}
      priority={priority}
      sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
    />
  ) : (
    <Image
      src={validSrc || "/placeholder.svg"}
      alt={alt}
      width={width || 300}
      height={height || 300}
      className={className}
      onError={handleError}
      priority={priority}
      sizes={sizes}
    />
  )
}
