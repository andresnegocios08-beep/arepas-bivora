'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WhatsAppNotification from '../components/WhatsAppNotification'

type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string | null
  status: string
  total: number
  createdAt: string
  items: {
    id: string
    quantity: number
    product: {
      name: string
    }
  }[]
}

type Product = {
  id: string
  name: string
  price: number
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin-data')
        const data = await response.json()
        setOrders(data.orders)
        setProducts(data.products)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Cambiar estado de un pedido
  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/update-status?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Actualizar la lista local
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        ))
        alert('✅ Estado actualizado correctamente')
      } else {
        const error = await response.json()
        alert(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      alert('❌ Error al actualizar el estado')
    }
  }

  // Calcular estadísticas
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todayOrders = orders.filter(
    order => new Date(order.createdAt) >= today
  )
  
  const totalToday = todayOrders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter(order => order.status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 Panel de Administración
        </h1>

        {/* Tarjetas con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pedidos</p>
                <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pedidos Hoy</p>
                <p className="text-2xl font-bold text-gray-800">{todayOrders.length}</p>
              </div>
              <span className="text-3xl">📅</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${totalToday.toLocaleString('es-CO')}
                </p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendientes</p>
                <p className="text-2xl font-bold text-red-600">{pendingOrders}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">📋 Pedidos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-orange-600">{order.orderNumber}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleString('es-CO')}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      {order.customerAddress && (
                        <div className="text-xs text-gray-400">{order.customerAddress}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {order.items.map((item, index) => (
                          <div key={index}>
                            {item.quantity}x {item.product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      ${order.total.toLocaleString('es-CO')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        order.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'pending' ? '⏳ Pendiente' :
                         order.status === 'confirmed' ? '✅ Confirmado' :
                         order.status === 'preparing' ? '👨‍🍳 Preparando' :
                         order.status === 'ready' ? '📦 Listo' :
                         order.status === 'delivered' ? '🚚 Entregado' :
                         '❌ Cancelado'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <select
                          className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                        >
                          <option value="pending">⏳ Pendiente</option>
                          <option value="confirmed">✅ Confirmado</option>
                          <option value="preparing">👨‍🍳 Preparando</option>
                          <option value="ready">📦 Listo</option>
                          <option value="delivered">🚚 Entregado</option>
                          <option value="cancelled">❌ Cancelado</option>
                        </select>
                        
                        <WhatsAppNotification 
                          orderNumber={order.orderNumber}
                          phone={order.customerPhone}
                          status={order.status}
                          total={order.total}
                          items={order.items}
                          customerAddress={order.customerAddress || undefined}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}