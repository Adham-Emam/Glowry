'use client'

import Link from 'next/link'
import { useAuth } from '@/supabase/hooks/useAuth'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
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
    name: 'Categories',
    href: '/categories',
    protected: false,
  },
  {
    name: 'Offers',
    href: '/offers',
    protected: false,
  },
  {
    name: 'Orders',
    href: '/orders',
    protected: true,
  },
  {
    name: 'Wishlist',
    href: '/wishlist',
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
              <Link href="/cart">
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
        <Sheet>
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
                      className={`block hover:bg-primary/50 px-4 py-4 overflow-y-auto duration-200 ${
                        pathname === link.href
                          ? 'bg-primary text-white hover:bg-primary!'
                          : ''
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
                  className={`block hover:bg-primary/50 px-4 py-4 overflow-y-auto duration-200 ${
                    pathname === '/cart'
                      ? 'bg-primary text-white hover:bg-primary!'
                      : ''
                  }`}
                >
                  Shopping Cart
                </Link>
              )}
            </nav>
            <SheetFooter>
              {isAuthenticated ? (
                <Button
                  variant="destructive"
                  className="w-full border border-ring hover:bg-destructive hover:text-white"
                  asChild
                >
                  <Link href="/logout">Sign Out</Link>
                </Button>
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
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
