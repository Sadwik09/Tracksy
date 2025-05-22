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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll use a simple check
      if (email === "demo@example.com" && password === "password") {
        // Store user info in localStorage for demo purposes
        localStorage.setItem(
          "tracksyUser",
          JSON.stringify({
            id: "1",
            email: "demo@example.com",
            name: "Demo User",
            isLoggedIn: true,
          }),
        )

        router.push("/dashboard")
      } else {
        // For demo, allow any credentials with validation
        if (email && password.length >= 6) {
          localStorage.setItem(
            "tracksyUser",
            JSON.stringify({
              id: Math.random().toString(36).substring(2, 9),
              email: email,
              name: email.split("@")[0],
              isLoggedIn: true,
            }),
          )

          router.push("/dashboard")
        } else {
          setError(
            "Invalid credentials. For demo, use any valid email and password (min 6 chars) or demo@example.com / password",
          )
        }
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
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
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm font-medium text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-green-600 hover:text-green-700">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
