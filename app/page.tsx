"use client"

import { useState, useEffect } from "react"
import { LocationCard } from "@/components/location-card"
import Image from "next/image"
import { DesktopNavigation } from "@/components/desktop-navigation"
import { getAuthState, type User } from "@/lib/auth"
import { getFeaturedProducts } from "@/lib/products"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const authUser = getAuthState()
    if (authUser) {
      setUser(authUser)
    }

    // Load featured products
    setFeaturedProducts(getFeaturedProducts())
  }, [])

  const handleLoginSuccess = () => {
    const authUser = getAuthState()
    setUser(authUser)
  }

  const locations = [
    {
      name: "Güemes",
      address: "Fructuoso Rivera 260",
      image: "/location-guemes.jpg",
    },
    {
      name: "Gral Paz",
      address: "Jacinto Ríos 126",
      image: "/gral-paz-location.png",
    },
    {
      name: "Villa Allende",
      address: "Río de Janeiro 121",
      image: "/villa-allende-location.png",
    },
    {
      name: "Manantiales",
      address: "San Antonio 4400",
      image: "/manantiales-location.png",
    },
  ]

  return (
    <div className="bg-lacapke-background min-h-screen">
      {/* Desktop Navigation */}
      <DesktopNavigation user={user} onLoginSuccess={handleLoginSuccess} />

      <div className="container-app pt-4 pb-8">
        {/* Header */}
        <header className="pt-4 pb-6 flex flex-col items-center">
          <div className="relative h-24 w-64 mb-3 lg:hidden">
            <Image src="/finall.png" alt="La Capke" fill className="object-contain" priority />
          </div>
        </header>

        {/* Locations Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-lacapke-charcoal text-center mb-6">Selecciona una sucursal</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {locations.map((location) => (
              <LocationCard
                key={location.name}
                name={location.name}
                address={location.address}
                image={location.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
