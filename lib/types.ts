export interface User {
  id: string
  name: string
  email: string
  isLoggedIn: boolean
}

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
  categoryId: string
  notes?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
  color: string
}
