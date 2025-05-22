"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Transaction } from "@/lib/types"

// Import the Indian currency utilities
import { formatIndianCurrency } from "@/lib/utils-indian-currency"

interface OverviewProps {
  transactions: Transaction[]
}

export function Overview({ transactions }: OverviewProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [period, setPeriod] = useState<"week" | "month" | "year">("month")

  useEffect(() => {
    if (!transactions.length) {
      setChartData([])
      return
    }

    // Filter transactions based on selected period
    const now = new Date()
    const filtered = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      if (period === "week") {
        const oneWeekAgo = new Date(now)
        oneWeekAgo.setDate(now.getDate() - 7)
        return transactionDate >= oneWeekAgo
      } else if (period === "month") {
        const oneMonthAgo = new Date(now)
        oneMonthAgo.setMonth(now.getMonth() - 1)
        return transactionDate >= oneMonthAgo
      } else if (period === "year") {
        const oneYearAgo = new Date(now)
        oneYearAgo.setFullYear(now.getFullYear() - 1)
        return transactionDate >= oneYearAgo
      }
      return true
    })

    // Group by date for chart
    const groupedByDate = filtered.reduce((acc: Record<string, { income: number; expense: number }>, transaction) => {
      const date = new Date(transaction.date)
      let dateKey

      if (period === "week") {
        dateKey = date.toLocaleDateString("en-US", { weekday: "short" })
      } else if (period === "month") {
        dateKey = date.toLocaleDateString("en-US", { day: "2-digit" })
      } else {
        dateKey = date.toLocaleDateString("en-US", { month: "short" })
      }

      if (!acc[dateKey]) {
        acc[dateKey] = { income: 0, expense: 0 }
      }

      if (transaction.type === "income") {
        acc[dateKey].income += transaction.amount
      } else {
        acc[dateKey].expense += transaction.amount
      }

      return acc
    }, {})

    // Convert to chart data format
    const data = Object.entries(groupedByDate).map(([date, values]) => ({
      name: date,
      income: values.income,
      expense: values.expense,
    }))

    // Sort data by date
    if (period === "week") {
      const weekdayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      data.sort((a, b) => weekdayOrder.indexOf(a.name) - weekdayOrder.indexOf(b.name))
    } else if (period === "month") {
      data.sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
    } else {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      data.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name))
    }

    setChartData(data)
  }, [transactions, period])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            Your {period === "week" ? "weekly" : period === "month" ? "monthly" : "yearly"} income and expenses
          </CardDescription>
        </div>
        <Tabs defaultValue={period} onValueChange={(value) => setPeriod(value as "week" | "month" | "year")}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-gray-500">No data available for the selected period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              {/* Update the tooltip formatter to use the Indian currency format */}
              <Tooltip
                formatter={(value: number) => [formatIndianCurrency(value), ""]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="income" name="Income" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#F44336" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
