"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { transactionsAPI } from "../utils/api"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await transactionsAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-green-600"
            >
              <path d="M18 7c0-5.333-8-5.333-8 0" />
              <path d="M10 7v14" />
              <path d="M6 21h12" />
              <path d="M6 13h10" />
            </svg>
            <span className="text-xl font-bold">Tracksy</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.user?.name || user?.user?.email}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Income</h3>
              <p className="text-3xl font-bold text-green-600">₹{stats?.totalIncome?.toLocaleString() || "0"}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">₹{stats?.totalExpenses?.toLocaleString() || "0"}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Balance</h3>
              <p className="text-3xl font-bold text-blue-600">
                ₹{((stats?.totalIncome || 0) - (stats?.totalExpenses || 0)).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a
              href="/transactions"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-medium">Transactions</h3>
              <p className="text-sm text-gray-600 mt-1">View all transactions</p>
            </a>
            <a
              href="/income"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-medium">Income</h3>
              <p className="text-sm text-gray-600 mt-1">Manage income sources</p>
            </a>
            <a
              href="/expenses"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-medium">Expenses</h3>
              <p className="text-sm text-gray-600 mt-1">Track your expenses</p>
            </a>
            <a
              href="/budget"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
            >
              <h3 className="font-medium">Budget</h3>
              <p className="text-sm text-gray-600 mt-1">Plan your budget</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
