import { PrismaClient } from '@prisma/client'
import Navbar from './components/Navbar'
import AddToCartButton from './components/AddToCartButton'

const prisma = new PrismaClient()

export default async function Home() {
  const products = await prisma.product.findMany()
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-orange-500 text-white py-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">🥙 Arepas Mixtas La Bívora</h1>
          <p className="text-xl mt-2">Las mejores arepas rellenas de Amalfi</p>
          <p className="text-sm mt-1">📍 Entrada a La, Amalfi, Antioquia</p>
          <p className="text-sm">📱 312 6621391</p>
        </div>

        {/* Menú */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center mb-8">Nuestro Menú</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {product.ingredients.map((ingredient: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                      {ingredient}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    ${product.price.toLocaleString('es-CO')}
                  </span>
                  <AddToCartButton 
                    productId={product.id}
                    name={product.name}
                    price={product.price}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-orange-600 text-white text-center py-4 text-sm">
          <p>📍 Entrada a La, Amalfi, Antioquia</p>
          <p>📱 312 6621391</p>
          <p className="text-xs mt-1">© 2024 Arepas Mixtas La Bívora</p>
        </footer>
      </div>
    </>
  )
}