"use client"

import { useState } from 'react'
import { MedicineCard } from './medicine-card'
import { Filter, SortAsc, SortDesc, Package } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  name?: string
  brand_name?: string
  price?: number
  discounted_price?: number
  image?: string
  cropped_image?: string
  url?: string
  manufacturer?: string
  label?: string
}

interface ResultsGridProps {
  results: {
    pharmEasy?: { products: Product[] }
    oneMg?: { products: Product[] }
    apollo?: { products: Product[] }
  }
}

interface NormalizedProduct {
  name: string
  price: number
  image: string
  manufacturer: string
  url: string
  source: string
}

export function MedicineResultsGrid({ results }: ResultsGridProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])

  const normalizeProduct = (product: Product, source: string): NormalizedProduct | null => {
    const price = product.price || product.discounted_price || 0
    // Only return the product if it has a valid price
    if (price <= 0) return null

    return {
      name: product.name || product.brand_name || product.label || '',
      price,
      image: product.image || product.cropped_image || '',
      manufacturer: product.manufacturer || '',
      url: product.url || '',
      source
    }
  }

  const allProducts: NormalizedProduct[] = [
    ...(results.pharmEasy?.products.map(p => normalizeProduct(p, 'PharmEasy')).filter((p): p is NormalizedProduct => p !== null) || []),
    ...(results.oneMg?.products.map(p => normalizeProduct(p, '1mg')).filter((p): p is NormalizedProduct => p !== null) || []),
    ...(results.apollo?.products.map(p => normalizeProduct(p, 'Apollo')).filter((p): p is NormalizedProduct => p !== null) || [])
  ]

  const filteredProducts = allProducts
    .filter(product =>
      (selectedSource === 'all' || product.source === selectedSource) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    )
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    })

  const sourceStats = {
    all: allProducts.length,
    PharmEasy: allProducts.filter(p => p.source === 'PharmEasy').length,
    '1mg': allProducts.filter(p => p.source === '1mg').length,
    Apollo: allProducts.filter(p => p.source === 'Apollo').length
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="bg-card p-4 rounded-xl shadow-sm border border-border">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Source Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <select
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="all">All Sources ({sourceStats.all})</option>
              <option value="PharmEasy">PharmEasy ({sourceStats.PharmEasy})</option>
              <option value="1mg">1mg ({sourceStats['1mg']})</option>
              <option value="Apollo">Apollo ({sourceStats.Apollo})</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Price:</label>
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-20 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              "bg-secondary hover:bg-secondary/80 text-foreground"
            )}
          >
            {sortOrder === 'asc' ? (
              <SortAsc size={18} className="text-primary" />
            ) : (
              <SortDesc size={18} className="text-primary" />
            )}
            <span className="text-sm font-medium">Price</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package size={16} />
        <span>Showing {filteredProducts.length} products</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <MedicineCard key={`${product.source}-${idx}`} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products found matching your criteria</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
