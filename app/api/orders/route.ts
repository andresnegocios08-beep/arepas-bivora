import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `BIV-${timestamp}${random}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerName, customerPhone, customerAddress, total } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      )
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son obligatorios' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerPhone,
        customerAddress: customerAddress || null,
        total,
        status: 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error al crear pedido:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
} 
