"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Transaction, Category } from "@/lib/types"
// Import the new currency display component
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"
import { formatIndianCurrency } from "@/lib/utils-indian-currency"

interface BudgetOverviewProps {
  transactions: Transaction[]
}

// Define budget limits for each category (in a real app, this would be user-configurable)
const BUDGET_LIMITS: Record<string, number> = {
  "1": 500, // Groceries
  "2": 1200, // Rent
  "3": 300, // Utilities
  "4": 200, // Entertainment
}

export function BudgetOverview({ transactions }: BudgetOverviewProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [budgetData, setBudgetData] = useState<
    Array<{
      id: string
      name: string
      spent: number
      limit: number
      percentage: number
      color: string
    }>
  >([])

  useEffect(() => {
    // Load categories from localStorage
    const categoriesData = localStorage.getItem("tracksyCategories")
    if (categoriesData) {
      setCategories(JSON.parse(categoriesData))
    }
  }, [])

  useEffect(() => {
    if (!categories.length) return

    // Get current month's transactions
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === "expense"
    })

    // Calculate spending by category
    const spendingByCategory = thisMonthTransactions.reduce((acc: Record<string, number>, transaction) => {
      const { categoryId, amount } = transaction
      if (!acc[categoryId]) {
        acc[categoryId] = 0
      }
      acc[categoryId] += amount
      return acc
    }, {})

    // Prepare data for display
    const data = categories
      .filter((category) => category.type === "expense")
      .map((category) => {
        const spent = spendingByCategory[category.id] || 0
        const limit = BUDGET_LIMITS[category.id] || 1000 // Default budget if not specified
        const percentage = Math.min(Math.round((spent / limit) * 100), 100)

        return {
          id: category.id,
          name: category.name,
          spent,
          limit,
          percentage,
          color: category.color,
        }
      })

    setBudgetData(data)
  }, [categories, transactions])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <IndianCurrencyDisplay
                amount={Object.values(BUDGET_LIMITS).reduce((sum, limit) => sum + limit, 0)}
                useShortFormat={true}
              />
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
              <IndianCurrencyDisplay
                amount={budgetData.reduce((sum, item) => sum + item.spent, 0)}
                useShortFormat={true}
              />
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
              <IndianCurrencyDisplay
                amount={
                  Object.values(BUDGET_LIMITS).reduce((sum, limit) => sum + limit, 0) -
                  budgetData.reduce((sum, item) => sum + item.spent, 0)
                }
                useShortFormat={true}
              />
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
              {Math.round(
                (budgetData.reduce((sum, item) => sum + item.spent, 0) /
                  Object.values(BUDGET_LIMITS).reduce((sum, limit) => sum + limit, 0)) *
                  100,
              )}
              %
            </div>
            <p className="text-xs text-gray-500">Of total budget used</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Your spending by category for the current month</CardDescription>
        </CardHeader>
        <CardContent>
          {budgetData.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-sm text-gray-500">No spending data available for this month</p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgetData.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatIndianCurrency(item.spent)} / {formatIndianCurrency(item.limit)}
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
    </div>
  )
}
