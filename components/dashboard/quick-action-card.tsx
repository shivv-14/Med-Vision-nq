"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconBg?: string
  onClick?: () => void
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  iconBg = "bg-primary/10 text-primary",
  onClick,
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
      </div>
    </button>
  )
}
