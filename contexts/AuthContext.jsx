import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('wilderbots_user')
    const storedToken = localStorage.getItem('wilderbots_token')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('wilderbots_user', JSON.stringify(data.user))
      localStorage.setItem('wilderbots_token', data.token)
      setUser(data.user)
      return { user: data.user, token: data.token }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      // After successful signup, automatically log in
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginResponse.json()

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Auto-login failed')
      }

      localStorage.setItem('wilderbots_user', JSON.stringify(loginData.user))
      localStorage.setItem('wilderbots_token', loginData.token)
      setUser(loginData.user)
      return { user: loginData.user, token: loginData.token }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const updateUser = (updatedUser) => {
    localStorage.setItem('wilderbots_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const logout = () => {
    localStorage.removeItem('wilderbots_user')
    localStorage.removeItem('wilderbots_token')
    localStorage.removeItem('wilderbots_orders')
    setUser(null)
  }

  const getOrders = () => {
    const orders = localStorage.getItem('wilderbots_orders')
    return orders ? JSON.parse(orders) : []
  }

  const addOrder = (orderData) => {
    const orders = getOrders()
    const newOrder = {
      id: 'ORD-' + Date.now(),
      ...orderData,
      userId: user?.id,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      trackingNumber: 'WB' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }
    orders.push(newOrder)
    localStorage.setItem('wilderbots_orders', JSON.stringify(orders))
    return newOrder
  }

  const getOrderById = (orderId) => {
    const orders = getOrders()
    return orders.find(order => order.id === orderId)
  }

  const getUserOrders = () => {
    if (!user) return []
    const orders = getOrders()
    return orders.filter(order => order.userId === user.id)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateUser,
      addOrder,
      getOrderById,
      getUserOrders
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

