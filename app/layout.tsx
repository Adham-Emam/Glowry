import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import StoreProvider from '@/components/StoreProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Glowry | Shop Premium Cosmetics, Skincare & Beauty Products',
  description:
    'Shop premium cosmetics, skincare, and beauty essentials at Glowry. Enjoy personalized recommendations, exclusive offers, secure payments, and fast delivery. Discover the perfect products for your skin and beauty routine.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
      >
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster className="z-50" position="bottom-right" />
        </StoreProvider>
      </body>
    </html>
  )
}
