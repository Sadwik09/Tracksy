"use client"

import { format } from "date-fns"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Transaction } from "@/lib/types"
import { useEffect, useState } from "react"
import type { Category } from "@/lib/types"
// Import the new currency display component
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"

interface RecentTransactionsProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function RecentTransactions({ transactions, onDelete }: RecentTransactionsProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Load categories from localStorage
    const categoriesData = localStorage.getItem("tracksyCategories")
    if (categoriesData) {
      setCategories(JSON.parse(categoriesData))
    }
  }, [])

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-gray-500">No transactions yet</p>
        <p className="text-xs text-gray-400">Add your first transaction to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center space-x-4">
            <div className={`rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className={`h-4 w-4 ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
              >
                {transaction.type === "income" ? (
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                ) : (
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                )}
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">{transaction.description}</p>
              <p className="text-xs text-gray-500">
                {getCategoryName(transaction.categoryId)} • {format(new Date(transaction.date), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Replace the currency display with the new component */}
            <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
              {transaction.type === "income" ? "+" : "-"}
              <IndianCurrencyDisplay amount={transaction.amount} />
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(transaction.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
