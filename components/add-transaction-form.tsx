"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Transaction, Category } from "@/lib/types"

interface AddTransactionFormProps {
  onAdd: (transaction: Transaction) => void
  onCancel: () => void
  defaultType?: "income" | "expense"
}

export function AddTransactionForm({ onAdd, onCancel, defaultType = "expense" }: AddTransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">(defaultType)
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Load categories from localStorage
    const categoriesData = localStorage.getItem("tracksyCategories")
    if (categoriesData) {
      const allCategories = JSON.parse(categoriesData)
      setCategories(allCategories)

      // Set default category based on type
      const defaultCategory = allCategories.find((c: Category) => c.type === type)
      if (defaultCategory) {
        setCategoryId(defaultCategory.id)
      }
    }
  }, [type])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !description || !categoryId) {
      return
    }

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      amount: Number.parseFloat(amount),
      description,
      date: date.toISOString(),
      categoryId,
      notes,
      createdAt: new Date().toISOString(),
    }

    onAdd(newTransaction)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Transaction</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => setType(value as "income" | "expense")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">
                  Income
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((category) => category.type === type)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Add Transaction
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
