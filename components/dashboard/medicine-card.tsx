"use client"

import { ExternalLink, Pill, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MedicineCardProps {
  name: string
  price: number
  image: string | undefined
  source: string
  url: string
  manufacturer?: string
}

export function MedicineCard({ name, price, image, source, url, manufacturer }: MedicineCardProps) {
  // Don't render the card if price is 0 or invalid
  if (!price || price <= 0) return null

  // Ensure price is a number
  const numericPrice = Number(price)
  if (isNaN(numericPrice)) return null

  const sourceColors: Record<string, string> = {
    'PharmEasy': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    '1mg': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Apollo': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }

  return (
    <div className="group bg-card rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-border overflow-hidden">
      {/* Source Badge */}
      <div className="flex items-center justify-between p-4 bg-secondary/50">
        <span className={cn(
          "text-sm font-medium px-3 py-1 rounded-full transition-colors",
          sourceColors[source] || 'bg-muted text-muted-foreground'
        )}>
          {source}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative p-6 flex-shrink-0 h-48 group-hover:scale-105 transition-transform duration-300 bg-white">
        <img
          src={image || 'https://via.placeholder.com/150?text=Medicine'}
          alt={name}
          className="w-full h-full object-contain rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-grow p-6 pt-2">
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
          <Pill size={16} className="inline-block mr-2 text-primary" />
          {name}
        </h3>
        {manufacturer && (
          <p className="text-sm text-muted-foreground mb-3 flex items-center">
            <Building2 size={14} className="mr-1" />
            {manufacturer}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Price</p>
            <p className="text-2xl font-bold text-primary">
              ₹{numericPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* External Link Button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transform hover:-translate-y-0.5 transition-transform duration-200"
          )}
        >
          <span>View Details</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  )
}
