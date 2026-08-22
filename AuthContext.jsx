import { createContext, useContext, useState } from 'react'
import { loginRequest } from '../api/client'

const AuthContext = createContext(null)

// Roles allowed into this Admin/HR frontend.
// Anyone logging in with role "employee" is refused access here.
const ALLOWED_ROLES = ['admin', 'hr']

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_user')
    return saved ? JSON.parse(saved) : null
  })

  async function login(email, password) {
    const res = await loginRequest(email, password)

    // Expected shape from backend: { token, user: { id, name, email, role } }
    // Adjust this destructuring if your teammate's backend returns a different shape.
    const { token, user: loggedInUser } = res.data

    if (!ALLOWED_ROLES.includes(loggedInUser.role)) {
      throw new Error('This account does not have HR/Admin access.')
    }

    localStorage.setItem('dayflow_token', token)
    localStorage.setItem('dayflow_user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
    return loggedInUser
  }

  function logout() {
    localStorage.removeItem('dayflow_token')
    localStorage.removeItem('dayflow_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
