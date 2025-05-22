"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Edit2 } from "lucide-react"
import type { Transaction, User } from "@/lib/types"
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"
import { formatIndianCurrency } from "@/lib/utils-indian-currency"

interface BudgetItem {
  id: string
  name: string
  limit: number
}

export default function BudgetPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<BudgetItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingBudget, setIsAddingBudget] = useState(false)
  const [newBudgetName, setNewBudgetName] = useState("")
  const [newBudgetLimit, setNewBudgetLimit] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("tracksyUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load transactions
    const transactionsData = localStorage.getItem("tracksyTransactions")
    if (transactionsData) {
      setTransactions(JSON.parse(transactionsData))
    }

    // Load budgets
    const budgetsData = localStorage.getItem("tracksyBudgets")
    if (budgetsData) {
      setBudgets(JSON.parse(budgetsData))
    } else {
      // Set default budgets if none exist
      const defaultBudgets = [
        { id: "1", name: "Groceries", limit: 5000 },
        { id: "2", name: "Rent", limit: 15000 },
        { id: "3", name: "Utilities", limit: 3000 },
        { id: "4", name: "Entertainment", limit: 2000 },
      ]
      setBudgets(defaultBudgets)
      localStorage.setItem("tracksyBudgets", JSON.stringify(defaultBudgets))
    }

    setIsLoading(false)
  }, [router])

  const handleAddBudget = () => {
    if (!newBudgetName || !newBudgetLimit) return

    const newBudget: BudgetItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newBudgetName,
      limit: Number(newBudgetLimit),
    }

    const updatedBudgets = [...budgets, newBudget]
    setBudgets(updatedBudgets)
    localStorage.setItem("tracksyBudgets", JSON.stringify(updatedBudgets))

    // Reset form
    setNewBudgetName("")
    setNewBudgetLimit("")
    setIsAddingBudget(false)
  }

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter((b) => b.id !== id)
    setBudgets(updatedBudgets)
    localStorage.setItem("tracksyBudgets", JSON.stringify(updatedBudgets))
  }

  // Get current month's expenses
  const getCurrentMonthExpenses = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === "expense"
    })
  }

  // Calculate total spent for each budget
  const calculateBudgetSpending = () => {
    const thisMonthExpenses = getCurrentMonthExpenses()
    const totalExpenses = thisMonthExpenses.reduce((sum, t) => sum + t.amount, 0)

    // For simplicity, we'll just divide the expenses proportionally among budgets
    // In a real app, you'd categorize expenses and track them against specific budgets
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)

    return budgets.map((budget) => {
      const proportion = budget.limit / totalBudget
      const spent = totalExpenses * proportion
      const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100)

      return {
        ...budget,
        spent,
        percentage,
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your budget data...</p>
        </div>
      </div>
    )
  }

  const budgetData = calculateBudgetSpending()
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgetData.reduce((sum, b) => sum + (b.spent || 0), 0)
  const remaining = totalBudget - totalSpent

  return (
    <DashboardShell>
      <DashboardHeader heading="Budget" text="Track your spending against your budget">
        <Button onClick={() => setIsAddingBudget(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </DashboardHeader>

      {isAddingBudget && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget-name">Budget Name</Label>
                <Input
                  id="budget-name"
                  placeholder="e.g., Groceries"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-limit">Monthly Limit (₹)</Label>
                <Input
                  id="budget-limit"
                  type="number"
                  placeholder="5000"
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingBudget(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBudget} className="bg-green-600 hover:bg-green-700">
                  Add Budget
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <IndianCurrencyDisplay amount={totalBudget} useShortFormat={true} />
            </div>
            <p className="text-xs text-gray-500">Monthly budget limit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <IndianCurrencyDisplay amount={totalSpent} useShortFormat={true} />
            </div>
            <p className="text-xs text-gray-500">This month's expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <IndianCurrencyDisplay amount={remaining} useShortFormat={true} />
            </div>
            <p className="text-xs text-gray-500">Left to spend this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-500">Of total budget used</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Budget Breakdown</CardTitle>
          <CardDescription>Your spending by budget category for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetData.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-gray-500">No budget data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgetData.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">
                        {formatIndianCurrency(item.spent || 0)} / {formatIndianCurrency(item.limit)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeleteBudget(item.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit Budget</span>
                      </Button>
                    </div>
                  </div>
                  <Progress
                    value={item.percentage}
                    className={`h-2 ${
                      item.percentage > 90 ? "bg-red-200" : item.percentage > 75 ? "bg-yellow-200" : "bg-gray-200"
                    }`}
                    indicatorClassName={`${
                      item.percentage > 90 ? "bg-red-600" : item.percentage > 75 ? "bg-yellow-600" : "bg-green-600"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
