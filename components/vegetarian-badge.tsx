import Image from "next/image"

interface VegetarianBadgeProps {
  className?: string
  size?: number
}

export function VegetarianBadge({ className, size = 16 }: VegetarianBadgeProps) {
  return (
    <div className={className} style={{ width: size, height: size, position: "relative" }}>
      <Image src="/flor.png" alt="Vegetariano" fill className="object-contain" />
    </div>
  )
}
