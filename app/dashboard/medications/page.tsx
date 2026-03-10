"use client"

import { useState } from 'react'
import { 
  Search, 
  Pill, 
  AlertCircle, 
  ShoppingBag, 
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Brain,
  MessageCircle,
  Calendar
} from 'lucide-react'
import { MedicineResultsGrid } from '@/components/dashboard/medicine-results-grid'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SearchResults {
  pharmEasy?: { products: Array<Record<string, unknown>> }
  oneMg?: { products: Array<Record<string, unknown>> }
  apollo?: { products: Array<Record<string, unknown>> }
}

export default function MedicationsPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResults | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      // Use internal API proxy instead of external API directly
      const response = await fetch(
        `/api/medicine-search?query=${encodeURIComponent(query.trim())}`
      )
      const data = await response.json()

      if (!data.success) {
        // Show user-friendly error messages based on error code
        const errorMessages: Record<string, string> = {
          'AUTH_ERROR': 'Medicine service temporarily unavailable. Please try again later.',
          'TIMEOUT': 'Unable to connect to pharmacy providers. Please try again.',
          'NETWORK_ERROR': 'Unable to connect to pharmacy providers. Please check your connection.',
          'UNKNOWN_ERROR': 'Medicine service temporarily unavailable. Please try again later.'
        }
        throw new Error(errorMessages[data.code] || data.error || 'Failed to fetch results')
      }

      // Check if we have any results
      const hasResults = data.data && (
        (data.data.pharmEasy?.products?.length > 0) ||
        (data.data.oneMg?.products?.length > 0) ||
        (data.data.apollo?.products?.length > 0)
      )

      if (!hasResults) {
        setError(null)
        setResults(null)
      } else {
        setResults(data.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching results'
      // Show user-friendly message instead of technical error
      if (errorMessage.toLowerCase().includes('failed to fetch') || errorMessage.toLowerCase().includes('network')) {
        setError('Unable to connect to pharmacy providers. Please check your connection and try again.')
      } else {
        setError(errorMessage)
      }
      setResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const popularSearches = [
    'Paracetamol',
    'Cetirizine',
    'Omeprazole',
    'Metformin',
    'Amoxicillin',
    'Ibuprofen'
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Price Comparison',
      description: 'Compare prices across multiple pharmacies instantly'
    },
    {
      icon: Shield,
      title: 'Verified Sources',
      description: 'All medicines from licensed pharmacies'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Latest prices and availability information'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl w-fit">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Medication Intelligence</h1>
              <p className="text-muted-foreground mt-1">Find the best prices across PharmEasy, 1mg, and Apollo</p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for medicines... (e.g., Paracetamol, Cetirizine)"
                className={cn(
                  "w-full px-4 py-3.5 pl-12 rounded-xl border border-input bg-background",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "transition-all duration-200"
                )}
                disabled={isLoading}
                suppressHydrationWarning
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2",
                  "px-5 py-2 bg-primary text-primary-foreground rounded-lg",
                  "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "font-medium transition-all duration-200"
                )}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          {!hasSearched && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                    }}
                    className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 text-foreground rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center text-destructive mb-6">
            <AlertCircle className="mr-3 flex-shrink-0" size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin">
                <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">Searching Pharmacies</p>
              <p className="text-sm text-muted-foreground mt-1">Finding the best prices for you...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Available Options</h2>
            </div>
            <MedicineResultsGrid results={results} />
          </div>
        )}

        {/* Empty State / Features */}
        {!results && !isLoading && !error && !hasSearched && (
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* How It Works */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Search</h3>
                  <p className="text-sm text-muted-foreground">Enter the medicine name you're looking for</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Compare</h3>
                  <p className="text-sm text-muted-foreground">View prices from multiple pharmacies</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-medium text-foreground mb-2">Purchase</h3>
                  <p className="text-sm text-muted-foreground">Click to visit the pharmacy and buy</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Explore MedVision AI</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/dashboard/screening"
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">AI Screening</h3>
                    <p className="text-sm text-muted-foreground">Get health assessments</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="/dashboard/therapy-assistant"
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Therapy Assistant</h3>
                    <p className="text-sm text-muted-foreground">Chat with AI therapist</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Progress Tracker</h3>
                    <p className="text-sm text-muted-foreground">Track your recovery</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* No Results State */}
        {hasSearched && !results && !isLoading && !error && (
          <div className="bg-card rounded-2xl border border-border p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No Results Found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any medicines matching "{query}". Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
