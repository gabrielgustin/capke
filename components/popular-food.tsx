import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"
import Link from "next/link"

interface PopularFoodProps {
  title: string
  image: string
  rating: number
  restaurants: number
}

export function PopularFood({ title, image, rating, restaurants }: PopularFoodProps) {
  const id = title.toLowerCase().replace(/\s+/g, "-")

  return (
    <Link href={`/product/${id}`} className="block">
      <Card className="overflow-hidden border-none shadow-sm">
        <div className="relative h-36 w-full bg-white/50">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        <CardContent className="p-3 bg-lacapke-cream">
          <div className="flex items-center gap-1 mb-1">
            <span className="font-medium text-lacapke-charcoal">{rating}</span>
            <Star className="h-4 w-4 fill-lacapke-accent text-lacapke-accent" />
          </div>
          <h3 className="font-medium text-sm mb-0.5 text-lacapke-charcoal">{title}</h3>
          <p className="text-xs text-lacapke-charcoal/70">Found in {restaurants} Restaurants</p>
        </CardContent>
      </Card>
    </Link>
  )
}
