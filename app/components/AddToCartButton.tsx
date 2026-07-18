'use client'

import { useCart } from './CartStore'

type AddToCartButtonProps = {
  productId: string
  name: string
  price: number
}

export default function AddToCartButton({ productId, name, price }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      id: `${productId}-${Date.now()}`,
      productId,
      name,
      price,
      quantity: 1
    })
    alert(`✅ ${name} agregado al carrito`)
  }

  return (
    <button
      onClick={handleAdd}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      🛒 Agregar
    </button>
  )
}