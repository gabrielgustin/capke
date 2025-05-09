import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Star } from "lucide-react"
import Link from "next/link"

interface NearbyDishProps {
  title: string
  image: string
  price: number
  rating: number
  restaurants: number
}

export function NearbyDish({ title, image, price, rating, restaurants }: NearbyDishProps) {
  const id = title.toLowerCase().replace(/\s+/g, "-")

  return (
    <Link href={`/product/${id}`} className="block">
      <Card className="overflow-hidden border-none shadow-sm mb-3 bg-lacapke-mint">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-base text-lacapke-charcoal">{title}</h3>
              <p className="text-xs text-lacapke-charcoal/70 mb-1">Found in {restaurants} nearby restaurants</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lacapke-charcoal">
                  ${price.toFixed(2)} <span className="text-xs font-normal text-lacapke-charcoal/70">/person</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-lacapke-charcoal">{rating}</span>
                  <Star className="h-4 w-4 fill-lacapke-accent text-lacapke-accent" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
