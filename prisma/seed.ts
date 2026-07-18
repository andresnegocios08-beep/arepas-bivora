import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpiar datos existentes
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customization.deleteMany()
  await prisma.product.deleteMany()

  // Crear productos
  const products = [
    // Arepas Clásicas
    {
      name: "La Bívora",
      description: "La arepa que le da nombre al local. Queso costeño, chicharrón crujiente, carne desmechada y hogao.",
      price: 18000,
      category: "arepas-clasicas",
      ingredients: ["Queso costeño", "Chicharrón", "Carne desmechada", "Hogao", "Salsa de ajo"]
    },
    {
      name: "La Tradicional",
      description: "Carne desmechada jugosa con queso y hogao. La reina de las arepas.",
      price: 15000,
      category: "arepas-clasicas",
      ingredients: ["Carne desmechada", "Queso costeño", "Hogao"]
    },
    {
      name: "La Campesina",
      description: "Pollo suave con queso derretido y maíz tierno. Un clásico reconfortante.",
      price: 14000,
      category: "arepas-clasicas",
      ingredients: ["Pechuga de pollo desmechada", "Queso mozzarella", "Maíz tierno"]
    },
    // Arepas Especiales
    {
      name: "La Costeña",
      description: "Arepa suave y cremosa, perfecta para los amantes del queso.",
      price: 16000,
      category: "arepas-especiales",
      ingredients: ["Queso costeño", "Queso doble crema", "Suero costeño", "Mantequilla"]
    },
    {
      name: "La BBQ",
      description: "Estilo americano con un toque colombiano. Cerdo desmechado en salsa BBQ.",
      price: 19000,
      category: "arepas-especiales",
      ingredients: ["Cerdo desmechado en salsa BBQ", "Queso cheddar", "Aros de cebolla crujientes"]
    },
    {
      name: "La Vegana",
      description: "Opción 100% vegetariana llena de sabor y nutrientes.",
      price: 13000,
      category: "arepas-especiales",
      ingredients: ["Frijoles refritos", "Aguacate", "Tomate", "Lechuga", "Maíz"]
    },
    // Acompañantes
    {
      name: "Porción de Chicharrón",
      description: "Chicharrón de cerdo perfectamente frito, crujiente por fuera y suave por dentro.",
      price: 8000,
      category: "acompanantes",
      ingredients: ["Chicharrón de cerdo"]
    },
    {
      name: "Porción de Yuca Frita",
      description: "Yuca crujiente acompañada de salsa de ajo y hogao.",
      price: 7000,
      category: "acompanantes",
      ingredients: ["Yuca", "Salsa de ajo", "Hogao"]
    },
    {
      name: "Tajada de Maduro con Queso",
      description: "Maduro dulce frito cubierto con queso costeño rallado.",
      price: 6000,
      category: "acompanantes",
      ingredients: ["Maduro", "Queso costeño"]
    },
    // Bebidas
    {
      name: "Limonada de Coco",
      description: "Refrescante limonada con un toque de coco.",
      price: 6000,
      category: "bebidas",
      ingredients: ["Limón", "Coco", "Agua", "Azúcar"]
    },
    {
      name: "Jugo de Lulo",
      description: "Jugo natural de lulo, dulce y ácido.",
      price: 5000,
      category: "bebidas",
      ingredients: ["Lulo", "Agua", "Azúcar"]
    },
    {
      name: "Jugo de Maracuyá",
      description: "Jugo natural de maracuyá, refrescante y tropical.",
      price: 5000,
      category: "bebidas",
      ingredients: ["Maracuyá", "Agua", "Azúcar"]
    },
    {
      name: "Gaseosa Personal",
      description: "Coca-Cola, Sprite o Pepsi.",
      price: 4000,
      category: "bebidas",
      ingredients: ["Gaseosa"]
    },
    {
      name: "Cerveza Águila o Club Colombia",
      description: "Cerveza fría para acompañar tu arepa.",
      price: 5000,
      category: "bebidas",
      ingredients: ["Cerveza"]
    }
  ]

  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData
    })

    // Agregar personalizaciones para arepas
    if (productData.category.includes('arepas')) {
      await prisma.customization.create({
        data: {
          productId: product.id,
          name: "Tipo de arepa",
          options: ["Maíz blanco", "Maíz amarillo"],
          isRequired: false
        }
      })
    }

    // Personalización especial para La BBQ
    if (productData.name === "La BBQ") {
      await prisma.customization.create({
        data: {
          productId: product.id,
          name: "Salsa BBQ",
          options: ["Dulce", "Picante"],
          isRequired: false
        }
      })
    }

    // Personalización especial para La Tradicional
    if (productData.name === "La Tradicional") {
      await prisma.customization.create({
        data: {
          productId: product.id,
          name: "Tipo de carne",
          options: ["Res", "Cerdo"],
          isRequired: false
        }
      })
    }
  }

  console.log('✅ Menú creado exitosamente!')
  console.log(`📦 ${products.length} productos agregados`)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
