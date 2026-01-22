'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/supabase/hooks/useAuth'
import { useSelector } from 'react-redux'
import { selectCartUniqueItems } from '@/redux/slices/cartSlice'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ShoppingCart, Menu, LogOut } from 'lucide-react'
import { Separator } from './ui/separator'

const navLinks = [
  {
    name: 'Shop',
    href: '/',
    protected: false,
  },
  {
    name: 'Offers',
    href: '/offers',
    protected: false,
  },
  {
    name: 'Wishlist',
    href: '/wishlist',
    protected: true,
  },
  {
    name: 'Orders',
    href: '/orders',
    protected: true,
  },
  {
    name: 'Profile',
    href: '/profile',
    protected: true,
  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const totalItems = useSelector(selectCartUniqueItems)

  return (
    <header className="container py-6 flex items-center justify-between">
      <Link href="/" className="font-bold text-3xl text-primary">
        Glowry
      </Link>

      <nav className="hidden lg:flex items-center justify-center gap-2">
        {navLinks
          .filter((link) => !link.protected || isAuthenticated)
          .map((link, index) => (
            <div key={index}>
              <Link
                href={link.href}
                className={`hover:bg-primary/50 px-4 py-2 rounded-lg duration-200 ${
                  pathname === link.href
                    ? 'bg-primary text-white hover:bg-primary!'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            </div>
          ))}
      </nav>

      <div className="hidden lg:flex items-center justify-center gap-4">
        {isAuthenticated ? (
          <>
            <Button size="icon" asChild>
              <Link className="relative" href="/cart">
                {totalItems > 0 && (
                  <div className="absolute -top-1/2 -left-1/2 bg-accent text-accent-foreground border font-bold p-1 rounded-full w-8 h-8 flex items-center justify-center">
                    {totalItems}
                  </div>
                )}
                <ShoppingCart />
              </Link>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              asChild
              className="border border-ring hover:bg-destructive hover:text-white"
            >
              <Link href="/logout">
                <LogOut />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="border">
              <Link href="/register">Register</Link>
            </Button>
            <Button>
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
      </div>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="font-bold text-2xl">Glowry</SheetTitle>
            </SheetHeader>
            <nav className="px-2 py-4 overflow-y-auto">
              {navLinks
                .filter((link) => !link.protected || isAuthenticated)
                .map((link, index) => (
                  <div key={index} className=" w-full">
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block hover:bg-primary/50 px-4 py-4 duration-200 ${
                        pathname === link.href ? 'bg-primary text-white' : ''
                      }`}
                    >
                      {link.name}
                    </Link>
                    <Separator className="my-2" />
                  </div>
                ))}

              {isAuthenticated && (
                <Link
                  href="/cart"
                  onClick={() => setOpen(false)}
                  className={`block hover:bg-primary/50 px-4 py-4 duration-200 ${
                    pathname === '/cart' ? 'bg-primary text-white' : ''
                  }`}
                >
                  Shopping Cart
                </Link>
              )}
            </nav>

            <SheetFooter className="flex-col gap-2">
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href="/logout">Sign Out</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <Button
                    variant="secondary"
                    className="border"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
