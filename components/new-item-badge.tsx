import { cn } from "@/lib/utils"

interface NewItemBadgeProps {
  className?: string
}

export function NewItemBadge({ className }: NewItemBadgeProps) {
  return (
    <div
      className={cn(
        "bg-[#ff6b6b] text-white text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wide",
        className,
      )}
    >
      Nuevo
    </div>
  )
}
