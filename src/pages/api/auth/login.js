import clientPromise from '../../../lib/mongodb'
import { verifyPassword, createToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const { username, password } = req.body

  try {
    console.log('Iniciando proceso de login para:', username)
    const client = await clientPromise
    const db = client.db('myFirstDatabase')

    console.log('Conexión a la base de datos myFirstDatabase establecida')
    console.log('Verificando colecciones en la base de datos:')
    const collections = await db.listCollections().toArray()
    console.log('Colecciones encontradas:', collections.map(c => c.name))

    if (!collections.some(c => c.name === 'users')) {
      console.error('La colección "usuarios" no existe en la base de datos')
      return res.status(500).json({ message: 'Error de configuración de la base de datos' })
    }

    console.log('Buscando usuario en la colección "usuarios"')
    const user = await db.collection('users').findOne({ username })

    if (!user) {
      console.log('Usuario no encontrado:', username)
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    console.log('Usuario encontrado, verificando contraseña')
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      console.log('Contraseña inválida para:', username)
      return res.status(401).json({ message: 'Credenciales inválidas' })
    }

    console.log('Contraseña válida, creando token para:', username)
    const token = createToken({ userId: user._id.toString(), username: user.username })

    console.log('Login exitoso para:', username)
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ message: 'Error interno del servidor', error: error.toString() })
  }
}