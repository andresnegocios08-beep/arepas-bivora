import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Traer todos los pedidos con sus productos
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Traer todos los productos
    const products = await prisma.product.findMany({
      where: { isAvailable: true }
    })

    return NextResponse.json({ orders, products })
  } catch (error) {
    console.error('Error en admin-data:', error)
    return NextResponse.json(
      { error: 'Error al cargar datos' },
      { status: 500 }
    )
  }
} 
