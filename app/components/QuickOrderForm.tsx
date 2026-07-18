'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  name: string
  price: number
}

type QuickOrderFormProps = {
  products: Product[]
}

export default function QuickOrderForm({ products }: QuickOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Datos del cliente
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  
  // Productos seleccionados
  const [selectedItems, setSelectedItems] = useState<{
    productId: string
    quantity: number
  }[]>([])

  // Producto que estamos agregando ahora
  const [currentProduct, setCurrentProduct] = useState('')
  const [currentQuantity, setCurrentQuantity] = useState(1)

  // Agregar un producto a la lista
  const handleAddItem = () => {
    if (!currentProduct) return
    
    setSelectedItems([
      ...selectedItems,
      {
        productId: currentProduct,
        quantity: currentQuantity
      }
    ])

    setCurrentProduct('')
    setCurrentQuantity(1)
  }

  // Quitar un producto de la lista
  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  // Guardar el pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerName || !customerPhone || selectedItems.length === 0) {
      alert('❌ Por favor completa todos los campos y agrega al menos un producto')
      return
    }

    setLoading(true)

    try {
      // Calcular el total
      const total = selectedItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId)
        return sum + (product?.price || 0) * item.quantity
      }, 0)

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products.find(p => p.id === item.productId)?.price || 0
          })),
          customerName,
          customerPhone,
          customerAddress,
          total
        })
      })

      if (response.ok) {
        alert('✅ Pedido creado exitosamente!')
        setCustomerName('')
        setCustomerPhone('')
        setCustomerAddress('')
        setSelectedItems([])
        setIsOpen(false)
        router.refresh()
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      alert('❌ Error al crear el pedido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Botón que abre el formulario */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
      >
        <span className="text-xl">➕</span>
        Nuevo Pedido
      </button>

      {/* El formulario en una ventana flotante */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">📝 Registrar Pedido</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Datos del cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del cliente *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Ej: 3126621391"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección (opcional)
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>

              {/* Agregar productos */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agregar productos
                </label>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={currentProduct}
                    onChange={(e) => setCurrentProduct(e.target.value)}
                    className="flex-1 min-w-[150px] border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price.toLocaleString('es-CO')}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={currentQuantity}
                    onChange={(e) => setCurrentQuantity(Number(e.target.value))}
                    className="w-20 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                    placeholder="Cant"
                  />

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    ➕ Agregar
                  </button>
                </div>

                {/* Lista de productos agregados */}
                {selectedItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedItems.map((item, index) => {
                      const product = products.find(p => p.id === item.productId)
                      return (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                          <div>
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              x{item.quantity} = ${((product?.price || 0) * item.quantity).toLocaleString('es-CO')}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Total y botón de guardar */}
              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-green-600 ml-2">
                    ${selectedItems.reduce((sum, item) => {
                      const product = products.find(p => p.id === item.productId)
                      return sum + ((product?.price || 0) * item.quantity)
                    }, 0).toLocaleString('es-CO')}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? '⏳ Guardando...' : '💾 Guardar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
} 
