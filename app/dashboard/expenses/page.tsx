"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PlusCircle } from "lucide-react"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { TransactionsList } from "@/components/transactions-list"
import type { Transaction, User, Category } from "@/lib/types"
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function ExpensesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("tracksyUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load categories
    const categoriesData = localStorage.getItem("tracksyCategories")
    if (categoriesData) {
      setCategories(JSON.parse(categoriesData))
    }

    // Load transactions
    const transactionsData = localStorage.getItem("tracksyTransactions")
    if (transactionsData) {
      // Filter only expense transactions
      const allTransactions = JSON.parse(transactionsData)
      setTransactions(allTransactions.filter((t: Transaction) => t.type === "expense"))
    }

    setIsLoading(false)
  }, [router])

  const handleAddTransaction = (newTransaction: Transaction) => {
    // Only add if it's an expense transaction
    if (newTransaction.type !== "expense") {
      newTransaction.type = "expense" // Force expense type
    }

    // Get all transactions first
    const transactionsData = localStorage.getItem("tracksyTransactions")
    let allTransactions = []
    if (transactionsData) {
      allTransactions = JSON.parse(transactionsData)
    }

    // Add the new transaction
    const updatedAllTransactions = [newTransaction, ...allTransactions]
    localStorage.setItem("tracksyTransactions", JSON.stringify(updatedAllTransactions))

    // Update the filtered list
    const updatedExpenseTransactions = [newTransaction, ...transactions]
    setTransactions(updatedExpenseTransactions)

    setIsAddingTransaction(false)
  }

  const handleDeleteTransaction = (id: string) => {
    // Get all transactions first
    const transactionsData = localStorage.getItem("tracksyTransactions")
    if (transactionsData) {
      const allTransactions = JSON.parse(transactionsData)
      const updatedAllTransactions = allTransactions.filter((t: Transaction) => t.id !== id)
      localStorage.setItem("tracksyTransactions", JSON.stringify(updatedAllTransactions))
    }

    // Update the filtered list
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
  }

  // Calculate expenses by category for pie chart
  const expensesByCategory = transactions.reduce((acc: Record<string, number>, transaction) => {
    const { categoryId, amount } = transaction
    if (!acc[categoryId]) {
      acc[categoryId] = 0
    }
    acc[categoryId] += amount
    return acc
  }, {})

  const pieChartData = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        name: category ? category.name : "Uncategorized",
        value: amount,
        color: category ? category.color : "#999999",
      }
    })
    .sort((a, b) => b.value - a.value)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your expense data...</p>
        </div>
      </div>
    )
  }

  // Calculate total expenses
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <DashboardShell>
      <DashboardHeader heading="Expenses" text="Track and manage your spending">
        <Button onClick={() => setIsAddingTransaction(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DashboardHeader>

      {isAddingTransaction && (
        <AddTransactionForm
          onAdd={handleAddTransaction}
          onCancel={() => setIsAddingTransaction(false)}
          defaultType="expense"
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-red-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              <IndianCurrencyDisplay amount={totalExpenses} />
            </div>
            <p className="text-xs text-gray-500">{transactions.length} expense transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-red-600"
            >
              <path d="M16 16v-8M12 16v-4M8 16v-2M4 16v-1" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              <IndianCurrencyDisplay amount={transactions.length > 0 ? totalExpenses / 12 : 0} />
            </div>
            <p className="text-xs text-gray-500">Estimated monthly average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 mt-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            {pieChartData.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">No expense data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Top Expenses</CardTitle>
            <CardDescription>Your largest expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-gray-500">No expense data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((transaction) => {
                    const category = categories.find((c) => c.id === transaction.categoryId)
                    return (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category?.color || "#999999" }}
                          />
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{category?.name || "Uncategorized"}</p>
                          </div>
                        </div>
                        <div className="font-medium text-red-600">
                          <IndianCurrencyDisplay amount={transaction.amount} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Expense Transactions</CardTitle>
          <CardDescription>A complete history of your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsList transactions={transactions} onDelete={handleDeleteTransaction} />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
