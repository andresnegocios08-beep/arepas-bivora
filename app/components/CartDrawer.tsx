'use client'

import { useState } from 'react'
import { useCart } from './CartStore'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const handleCheckout = async () => {
    if (!customerData.name || !customerData.phone) {
      alert('📝 Por favor ingresa tu nombre y teléfono')
      return
    }

    if (items.length === 0) {
      alert('🛒 El carrito está vacío')
      return
    }

    setIsCheckingOut(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          customerName: customerData.name,
          customerPhone: customerData.phone,
          customerAddress: customerData.address,
          total: totalPrice()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al procesar el pedido')
      }

      const order = await response.json()
      
      clearCart()
      onClose()
      
      alert(`✅ ¡Pedido #${order.orderNumber} creado exitosamente!\n\n📱 Recibirás un mensaje de confirmación.`)
      
    } catch (error: any) {
      alert(`❌ ${error.message}`)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-orange-50">
            <h2 className="text-xl font-bold">
              🛒 Carrito <span className="text-sm font-normal text-gray-500">({totalItems()} items)</span>
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ✕
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-2">🛒</p>
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400 mt-1">¡Agrega tus arepas favoritas!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 border-b pb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-sm font-bold text-orange-600">
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 ml-2 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout */}
          {items.length > 0 && (
            <div className="border-t p-4 bg-gray-50">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span className="text-orange-600 text-xl">${totalPrice().toLocaleString('es-CO')}</span>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="👤 Tu nombre *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="📱 Tu teléfono *"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="📍 Dirección de entrega (opcional)"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isCheckingOut ? '⏳ Procesando...' : '✅ Confirmar Pedido'}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                💰 Pago en efectivo al recibir tu pedido
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}