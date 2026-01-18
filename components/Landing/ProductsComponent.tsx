'use client'

import { useState, useEffect } from 'react'
import supabase from '@/supabase/client'
import type { Product } from '@/types/products'
import { Formik, Form, Field } from 'formik'
import ProductCard from './ProductCard'
import { Button } from '../ui/button'
import ProductCardSkeleton from './ProductCardSkeleton'
import EmptyProducts from '../ui/EmptyProducts'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination'

import { toast } from 'sonner'
import { Search } from 'lucide-react'

const PAGE_SIZE = 12

export default function ProductsComponent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getProducts = async (query = '', currentPage = 1) => {
    setLoading(true)

    const from = (currentPage - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let supabaseQuery = supabase
      .from('products')
      .select('*, product_images(*)', { count: 'exact' })

      .eq('is_active', true)
      .range(from, to)

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`,
      )
    }

    const { data, count, error } = await supabaseQuery

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    setProducts(data || [])
    setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE))

    setLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1)
      getProducts(search, 1)
    }, 400) // debounce delay

    return () => clearTimeout(timeout)
  }, [search])

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
    getProducts(search, p)
  }

  const getVisiblePages = (current: number, total: number) => {
    const delta = 1
    const range: number[] = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) range.unshift(-1) // left ellipsis
    if (current + delta < total - 1) range.push(-2) // right ellipsis

    return [1, ...range, total].filter((v, i, arr) => arr.indexOf(v) === i)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Formik
        initialValues={{
          search: '',
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange }) => (
          <Form className="mb-6 border flex items-center px-4 rounded-2xl duration-300 focus-within:border-primary">
            <Field
              type="text"
              name="search"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e)
                setSearch(e.target.value)
              }}
              value={values.search}
              placeholder="Search products"
              className="w-full px-4 py-3 focus:outline-none disabled:cursor-not-allowed"
            />
            <Button
              type="submit"
              disabled={loading}
              size="icon"
              className="rounded-full disabled:cursor-not-allowed"
            >
              <Search />
            </Button>
          </Form>
        )}
      </Formik>
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => goToPage(page - 1)}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {getVisiblePages(page, totalPages).map((p, index) => (
                <PaginationItem key={index}>
                  {p === -1 || p === -2 ? (
                    <PaginationEllipsis />
                  ) : (
                    <Button
                      size="sm"
                      variant={page === p ? 'default' : 'outline'}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </Button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => goToPage(page + 1)}
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
