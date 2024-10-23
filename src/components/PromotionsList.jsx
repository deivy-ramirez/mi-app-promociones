import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function PromotionsList() {
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPromotion, setSelectedPromotion] = useState(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPromotions = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/promotions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const promotionsData = await response.json()
          setPromotions(promotionsData)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Error al cargar las promociones')
        }
      } catch (error) {
        console.error('Error fetching promotions:', error)
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ promotionId: selectedPromotion._id, code })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Error al verificar el código')
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
    }
  }

  if (loading) return <div className="text-center">Cargando promociones...</div>

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Promociones Disponibles</h1>
      {promotions.length === 0 ? (
        <p className="text-gray-600">No hay promociones disponibles en este momento.</p>
      ) : (
        <div className="space-y-6">
          {promotions.map((promotion) => (
            <div key={promotion._id} className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold">{promotion.name}</h2>
              <p className="text-gray-600 mt-2">{promotion.description}</p>
              <p className="mt-2"><strong className="text-gray-700">Premio:</strong> {promotion.prize}</p>
              <button
                onClick={() => setSelectedPromotion(promotion)}
                className="mt-2 py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Participar
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPromotion && (
        <div className="mt-6 p-4 border rounded-md">
          <h3 className="text-lg font-semibold mb-2">Participar en: {selectedPromotion.name}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Ingresa tu código
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verificar Código
            </button>
          </form>
        </div>
      )}

      {result && (
        <div className={`mt-6 p-4 rounded-md ${result.isWinner ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          <p className="font-bold">{result.isWinner ? '¡Felicidades! Has ganado.' : 'Lo siento, no has ganado esta vez.'}</p>
          <p>{result.message}</p>
        </div>
      )}

      <button
        onClick={() => router.push('/winners')}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ver Ganadores
      </button>
    </div>
  )
}