'use client'

import { useState, useEffect, useCallback } from 'react'
import { getProducts } from '@/supabase/products'
import type { Product } from '@/types/products'
import { toast } from 'sonner'
import { Search } from 'lucide-react'

import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import EmptyProducts from '../ui/EmptyProducts'
import { Button } from '../ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

export default function ProductsComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Memoize the fetcher to prevent re-renders
  const fetchData = useCallback(
    async (currentSearch: string, currentPage: number) => {
      setLoading(true)
      try {
        const { products, totalPages } = await getProducts(
          currentSearch,
          currentPage,
        )
        setProducts(products)
        setTotalPages(totalPages)
      } catch (error: any) {
        toast.error(error.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Single Source of Truth for Data Fetching
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(search, page)
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [search, page, fetchData])

  // Handle Search Input (resets to page 1)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  // Pagination Helper (Extracted for readability)
  const visiblePages = (current: number, total: number) => {
    const delta = 1
    const range: number[] = []
    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }
    if (current - delta > 2) range.unshift(-1)
    if (current + delta < total - 1) range.push(-2)
    return [1, ...range, total].filter(
      (v, i, arr) => total > 0 && arr.indexOf(v) === i,
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Simplified Search Bar */}
      <div className="mb-6 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-card border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        />
      </div>

      {products.length === 0 && !loading && <EmptyProducts />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      {/* Pagination Logic */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {visiblePages(page, totalPages).map((p, idx) => (
                <PaginationItem key={idx}>
                  {p < 0 ? (
                    <PaginationEllipsis />
                  ) : (
                    <Button
                      size="sm"
                      variant={page === p ? 'default' : 'ghost'}
                      className="w-10 h-10"
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
