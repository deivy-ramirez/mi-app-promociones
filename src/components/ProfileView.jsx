import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ProfileView() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      /*const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found, redirecting to login')
        router.push('/login')
        return
      }
      */
      try {
        const response = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          const errorData = await response.json()
          setError(errorData.message || 'Error al cargar el perfil')
          if (response.status === 401) {
            console.log('Unauthorized, redirecting to login')
            router.push('/login')
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  if (loading) return <div className="text-center">Cargando...</div>

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!user) return <div className="text-center">No se pudo cargar el perfil del usuario.</div>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <div className="space-y-2">
        <p><strong className="text-gray-700">Nombre de usuario:</strong> {user.username}</p>
        <p><strong className="text-gray-700">Email:</strong> {user.email}</p>
        <p><strong className="text-gray-700">Ciudad:</strong> {user.city}</p>
        <p><strong className="text-gray-700">Fecha de nacimiento:</strong> {new Date(user.dateOfBirth).toLocaleDateString()}</p>
      </div>
      <button
        onClick={() => router.push('/promotions')}
        className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Ver Promociones
      </button>
    </div>
  )
}