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
  notes?: string
  createdAt: string
}
