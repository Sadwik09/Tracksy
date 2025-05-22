"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { Transaction, User, Category } from "@/lib/types"
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"
import { formatIndianCurrency } from "@/lib/utils-indian-currency"

export default function ReportsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month")
  const [reportType, setReportType] = useState<"income-vs-expense" | "category" | "trend">("income-vs-expense")

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
      setTransactions(JSON.parse(transactionsData))
    }

    setIsLoading(false)
  }, [router])

  // Filter transactions based on time range
  const getFilteredTransactions = () => {
    const now = new Date()
    const startDate = new Date()

    if (timeRange === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (timeRange === "quarter") {
      startDate.setMonth(now.getMonth() - 3)
    } else if (timeRange === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    return transactions.filter((t) => new Date(t.date) >= startDate)
  }

  // Prepare data for Income vs Expense chart
  const prepareIncomeVsExpenseData = () => {
    const filteredTransactions = getFilteredTransactions()
    const groupedByDate: Record<string, { income: number; expense: number }> = {}

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      let dateKey

      if (timeRange === "month") {
        dateKey = date.toLocaleDateString("en-US", { day: "2-digit" })
      } else if (timeRange === "quarter") {
        dateKey = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      } else {
        dateKey = date.toLocaleDateString("en-US", { month: "short" })
      }

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        groupedByDate[dateKey].income += transaction.amount
      } else {
        groupedByDate[dateKey].expense += transaction.amount
      }
    })

    return Object.entries(groupedByDate).map(([date, values]) => ({
      name: date,
      income: values.income,
      expense: values.expense,
    }))
  }

  // Prepare data for Category breakdown
  const prepareCategoryData = () => {
    const filteredTransactions = getFilteredTransactions()
    const expensesByCategory: Record<string, number> = {}

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        if (!expensesByCategory[transaction.categoryId]) {
          expensesByCategory[transaction.categoryId] = 0
        }
        expensesByCategory[transaction.categoryId] += transaction.amount
      }
    })

    return Object.entries(expensesByCategory)
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId)
        return {
          name: category ? category.name : "Uncategorized",
          value: amount,
          color: category ? category.color : "#999999",
        }
      })
      .sort((a, b) => b.value - a.value)
  }

  // Prepare data for Trend analysis
  const prepareTrendData = () => {
    const filteredTransactions = getFilteredTransactions()
    const groupedByDate: Record<string, { total: number }> = {}

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      let dateKey

      if (timeRange === "month") {
        dateKey = date.toLocaleDateString("en-US", { day: "2-digit" })
      } else if (timeRange === "quarter") {
        dateKey = date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      } else {
        dateKey = date.toLocaleDateString("en-US", { month: "short" })
      }

      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = { total: 0 }
      }

      if (transaction.type === "income") {
        groupedByDate[dateKey].total += transaction.amount
      } else {
        groupedByDate[dateKey].total -= transaction.amount
      }
    })

    return Object.entries(groupedByDate).map(([date, values]) => ({
      name: date,
      balance: values.total,
    }))
  }

  // Calculate summary statistics
  const calculateSummary = () => {
    const filteredTransactions = getFilteredTransactions()

    const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0

    return { totalIncome, totalExpenses, balance, savingsRate }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your reports...</p>
        </div>
      </div>
    )
  }

  const summary = calculateSummary()

  return (
    <DashboardShell>
      <DashboardHeader heading="Financial Reports" text="Analyze your financial data">
        <div className="flex items-center space-x-2">
          <Label htmlFor="time-range" className="sr-only">
            Time Range
          </Label>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger id="time-range" className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-green-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              <IndianCurrencyDisplay amount={summary.totalIncome} />
            </div>
            <p className="text-xs text-gray-500">For the selected period</p>
          </CardContent>
        </Card>
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
              <IndianCurrencyDisplay amount={summary.totalExpenses} />
            </div>
            <p className="text-xs text-gray-500">For the selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-blue-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              <IndianCurrencyDisplay amount={summary.balance} />
            </div>
            <p className="text-xs text-gray-500">Income minus expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-yellow-600"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500">Percentage of income saved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={reportType} onValueChange={(value) => setReportType(value as any)} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income-vs-expense">Income vs Expense</TabsTrigger>
          <TabsTrigger value="category">Category Breakdown</TabsTrigger>
          <TabsTrigger value="trend">Balance Trend</TabsTrigger>
        </TabsList>

        <TabsContent value="income-vs-expense">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expense</CardTitle>
              <CardDescription>Compare your income and expenses over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareIncomeVsExpenseData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4CAF50" />
                    <Bar dataKey="expense" name="Expense" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <Card>
            <CardHeader>
              <CardTitle>Expense Categories</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareCategoryData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
              <CardDescription>Track your net balance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareTrendData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatIndianCurrency(value as number)} />
                    <Legend />
                    <Line type="monotone" dataKey="balance" name="Net Balance" stroke="#2196F3" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
