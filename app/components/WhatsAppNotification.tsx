'use client'

import { useState } from 'react'

type WhatsAppNotificationProps = {
  orderNumber: string
  phone: string
  status: string
  total: number
  items: any[]
  customerAddress?: string
}

export default function WhatsAppNotification({ 
  orderNumber, 
  phone, 
  status, 
  total, 
  items,
  customerAddress 
}: WhatsAppNotificationProps) {
  const [isSending, setIsSending] = useState(false)

  const getStatusMessage = (status: string) => {
    const messages = {
      'pending': '⏳ Pendiente de confirmación',
      'confirmed': '✅ Confirmado - ¡Tu pedido está en preparación!',
      'preparing': '👨‍🍳 Estamos preparando tu pedido',
      'ready': '📦 ¡Tu pedido está listo para entregar!',
      'delivered': '🚚 Pedido entregado - ¡Disfruta tu comida!',
      'cancelled': '❌ Pedido cancelado'
    }
    return messages[status as keyof typeof messages] || status
  }

  const sendNotification = () => {
    setIsSending(true)
    
    const message = `
🥙 *Arepas Mixtas La Bívora*
📋 *Pedido #${orderNumber}*
📌 *Estado:* ${getStatusMessage(status)}
💰 *Total:* $${total.toLocaleString('es-CO')}

${items.map((item: any) => `  • ${item.quantity}x ${item.product.name}`).join('\n')}

📍 *Dirección:* ${customerAddress || 'No especificada'}

📱 Cualquier duda: 312 6621391
    `.trim()

    const cleanPhone = phone.replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(message)
    const whatsappLink = `https://wa.me/57${cleanPhone}?text=${encodedMessage}`
    
    window.open(whatsappLink, '_blank')
    setIsSending(false)
  }

  return (
    <button
      onClick={sendNotification}
      disabled={isSending}
      className="bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2 py-1 rounded transition-colors"
    >
      {isSending ? '⏳' : '💬 WhatsApp'}
    </button>
  )
} 
