"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      // In a real app, this would be an API call to register the user
      // For demo purposes, we'll just store in localStorage
      localStorage.setItem(
        "tracksyUser",
        JSON.stringify({
          id: Math.random().toString(36).substring(2, 9),
          name,
          email,
          isLoggedIn: true,
        }),
      )

      // Initialize empty data for the new user
      localStorage.setItem("tracksyTransactions", JSON.stringify([]))
      localStorage.setItem(
        "tracksyCategories",
        JSON.stringify([
          { id: "1", name: "Groceries", type: "expense", color: "#4CAF50" },
          { id: "2", name: "Rent", type: "expense", color: "#F44336" },
          { id: "3", name: "Utilities", type: "expense", color: "#2196F3" },
          { id: "4", name: "Entertainment", type: "expense", color: "#9C27B0" },
          { id: "5", name: "Salary", type: "income", color: "#4CAF50" },
          { id: "6", name: "Freelance", type: "income", color: "#2196F3" },
          { id: "7", name: "Investments", type: "income", color: "#FF9800" },
        ]),
      )

      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred during signup. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600"
              >
                <path d="M18 7c0-5.333-8-5.333-8 0" />
                <path d="M10 7v14" />
                <path d="M6 21h12" />
                <path d="M6 13h10" />
              </svg>
              <span className="text-xl font-bold">Tracksy</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to get started with Tracksy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-700">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
