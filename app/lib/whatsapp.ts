export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/57${cleanPhone}?text=${encodedMessage}`
}

export function generateStatusMessage(order: any): string {
  const statusMessages = {
    'pending': '⏳ Pendiente de confirmación',
    'confirmed': '✅ Confirmado - ¡Tu pedido está en preparación!',
    'preparing': '👨‍🍳 Estamos preparando tu pedido',
    'ready': '📦 ¡Tu pedido está listo para entregar!',
    'delivered': '🚚 Pedido entregado - ¡Disfruta tu comida!',
    'cancelled': '❌ Pedido cancelado'
  }

  const statusText = statusMessages[order.status as keyof typeof statusMessages] || order.status

  return `
🥙 *Arepas Mixtas La Bívora*
📋 *Pedido #${order.orderNumber}*
📌 *Estado:* ${statusText}
💰 *Total:* $${order.total.toLocaleString('es-CO')}

${order.items.map((item: any) => `  • ${item.quantity}x ${item.product.name}`).join('\n')}

📍 *Dirección:* ${order.customerAddress || 'No especificada'}

📱 Cualquier duda: 312 6621391
  `.trim()
}