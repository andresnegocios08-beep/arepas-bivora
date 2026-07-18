'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from './CartStore'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <>
      <nav className="bg-orange-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🥙</span>
              <span className="font-bold text-lg hidden sm:block">Arepas La Bívora</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-orange-200 transition-colors">
                🏠 Inicio
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-orange-700 hover:bg-orange-800 rounded-full p-2 transition-colors"
              >
                🛒
                {totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}