import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, refreshSession, logoutSession } from '../services/auth.service'
import { setAccessToken, setUnauthorizedHandler } from '../services/api'

const AuthContext = createContext(null)
const TOKEN_STORAGE_KEY = 'auth_token'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const isMockAuth = import.meta.env.VITE_MOCK_AUTH === 'true'

  const persistToken = (nextToken) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken)
      return
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  const clearAuthState = () => {
    setUser(null)
    setToken(null)
    setAccessToken(null)
    persistToken(null)
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
        if (storedToken) {
          setToken(storedToken)
          setAccessToken(storedToken)
        }

        if (!storedToken && isMockAuth) {
          setIsLoading(false)
          return
        }

        const session = await refreshSession()
        const nextToken = session?.token || storedToken
        if (!nextToken) {
          clearAuthState()
          return
        }

        setToken(nextToken)
        setAccessToken(nextToken)
        persistToken(nextToken)

        const currentUser = session?.user || (await getMe())
        setUser(currentUser || null)
      } catch (error) {
        clearAuthState()
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [isMockAuth])

  const login = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser)
    if (nextToken) {
      setToken(nextToken)
      setAccessToken(nextToken)
      persistToken(nextToken)
    }
  }

  const updateUser = (nextUser) => {
    setUser(nextUser)
  }

  const logout = () => {
    clearAuthState()
    logoutSession().catch(() => {})
  }

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      updateUser,
      logout,
    }),
    [user, token, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
