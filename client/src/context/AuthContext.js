"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { authAPI } from "../utils/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("tracksyUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)
      localStorage.setItem("tracksyUser", JSON.stringify(data))
      setUser(data)
      return data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData)
      localStorage.setItem("tracksyUser", JSON.stringify(data))
      setUser(data)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("tracksyUser")
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
