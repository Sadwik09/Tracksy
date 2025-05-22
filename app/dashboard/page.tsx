"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { TransactionsList } from "@/components/transactions-list"
import { BudgetOverview } from "@/components/budget-overview"
import { PlusCircle } from "lucide-react"
import type { Transaction, User } from "@/lib/types"
// Import the new currency display component
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
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

    // Load transactions
    const transactionsData = localStorage.getItem("tracksyTransactions")
    if (transactionsData) {
      setTransactions(JSON.parse(transactionsData))
    }

    setIsLoading(false)
  }, [router])

  const handleAddTransaction = (newTransaction: Transaction) => {
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem("tracksyTransactions", JSON.stringify(updatedTransactions))
    setIsAddingTransaction(false)
  }

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    localStorage.setItem("tracksyTransactions", JSON.stringify(updatedTransactions))
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Calculate financial summary
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text={`Welcome back, ${user?.name || "User"}!`}>
        <Button onClick={() => setIsAddingTransaction(true)} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DashboardHeader>

      {isAddingTransaction && (
        <AddTransactionForm onAdd={handleAddTransaction} onCancel={() => setIsAddingTransaction(false)} />
      )}

      <div className="grid gap-4 md:grid-cols-3">
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
            {/* Replace the currency displays with the new component */}
            <div className="text-2xl font-bold text-green-600">
              <IndianCurrencyDisplay amount={totalIncome} />
            </div>
            <p className="text-xs text-gray-500">
              {transactions.filter((t) => t.type === "income").length} income transactions
            </p>
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
            {/* Replace the currency displays with the new component */}
            <div className="text-2xl font-bold text-red-600">
              <IndianCurrencyDisplay amount={totalExpenses} />
            </div>
            <p className="text-xs text-gray-500">
              {transactions.filter((t) => t.type === "expense").length} expense transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
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
            {/* Replace the currency displays with the new component */}
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              <IndianCurrencyDisplay amount={balance} />
            </div>
            <p className="text-xs text-gray-500">
              {balance >= 0 ? "You are saving money!" : "You are spending more than you earn"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview transactions={transactions} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentTransactions transactions={transactions.slice(0, 5)} onDelete={handleDeleteTransaction} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A complete history of your financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsList transactions={transactions} onDelete={handleDeleteTransaction} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Track your spending against your budget</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetOverview transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
