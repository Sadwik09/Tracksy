"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import type { Transaction } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Import the new currency display component
import { IndianCurrencyDisplay } from "@/components/indian-currency-display"

interface TransactionsListProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

export function TransactionsList({ transactions, onDelete }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions)
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")

  // Apply filters whenever dependencies change
  useState(() => {
    // Apply filters
    let result = [...transactions]

    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter((t) => t.type === typeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (t) => t.description.toLowerCase().includes(term) || (t.notes && t.notes.toLowerCase().includes(term)),
      )
    }

    setFilteredTransactions(result)
  })

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={typeFilter === "all"} onCheckedChange={() => setTypeFilter("all")}>
              All Transactions
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={typeFilter === "income"} onCheckedChange={() => setTypeFilter("income")}>
              Income Only
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={typeFilter === "expense"}
              onCheckedChange={() => setTypeFilter("expense")}
            >
              Expenses Only
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      <IndianCurrencyDisplay amount={transaction.amount} />
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
