"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Download, Trash2 } from "lucide-react"
import type { User } from "@/lib/types"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Preferences state
  const [showCurrencySymbol, setShowCurrencySymbol] = useState(true)
  const [useShortFormat, setUseShortFormat] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("tracksyUser")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setName(parsedUser.name || "")
    setEmail(parsedUser.email || "")

    // Load preferences
    const preferencesData = localStorage.getItem("tracksyPreferences")
    if (preferencesData) {
      const preferences = JSON.parse(preferencesData)
      setShowCurrencySymbol(preferences.showCurrencySymbol ?? true)
      setUseShortFormat(preferences.useShortFormat ?? false)
      setDarkMode(preferences.darkMode ?? false)
    }

    setIsLoading(false)
  }, [router])

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      if (!user) return

      const updatedUser = {
        ...user,
        name,
        email,
      }

      localStorage.setItem("tracksyUser", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSuccessMessage("Profile updated successfully")
    } catch (error) {
      setErrorMessage("Failed to update profile")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // In a real app, this would validate the current password against the stored password
      // For demo purposes, we'll just check if it's not empty
      if (!currentPassword) {
        setErrorMessage("Current password is required")
        setIsSaving(false)
        return
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage("New passwords do not match")
        setIsSaving(false)
        return
      }

      if (newPassword.length < 6) {
        setErrorMessage("New password must be at least 6 characters")
        setIsSaving(false)
        return
      }

      // In a real app, this would update the password in the database
      // For demo purposes, we'll just show a success message
      setSuccessMessage("Password changed successfully")
    } catch (error) {
      setErrorMessage("Failed to change password")
      console.error(error)
    } finally {
      setIsSaving(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const handleUpdatePreferences = () => {
    setIsSaving(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      const preferences = {
        showCurrencySymbol,
        useShortFormat,
        darkMode,
      }

      localStorage.setItem("tracksyPreferences", JSON.stringify(preferences))
      setSuccessMessage("Preferences updated successfully")

      // In a real app, you would apply the dark mode here
      // For demo purposes, we'll just save the preference
    } catch (error) {
      setErrorMessage("Failed to update preferences")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = () => {
    setIsExporting(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Get all data from localStorage
      const userData = localStorage.getItem("tracksyUser")
      const transactionsData = localStorage.getItem("tracksyTransactions")
      const preferencesData = localStorage.getItem("tracksyPreferences")
      const budgetsData = localStorage.getItem("tracksyBudgets")

      // Combine all data into a single object
      const exportData = {
        user: userData ? JSON.parse(userData) : null,
        transactions: transactionsData ? JSON.parse(transactionsData) : [],
        preferences: preferencesData ? JSON.parse(preferencesData) : {},
        budgets: budgetsData ? JSON.parse(budgetsData) : [],
        exportDate: new Date().toISOString(),
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2)

      // Create a blob and download link
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tracksy-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccessMessage("Data exported successfully")
    } catch (error) {
      setErrorMessage("Failed to export data")
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Clear all data from localStorage
        localStorage.removeItem("tracksyUser")
        localStorage.removeItem("tracksyTransactions")
        localStorage.removeItem("tracksyPreferences")
        localStorage.removeItem("tracksyBudgets")

        // Redirect to login page
        router.push("/login")
      } catch (error) {
        setErrorMessage("Failed to delete account")
        console.error(error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your account settings and preferences" />

      {successMessage && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  {isSaving ? "Changing..." : "Change Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Currency Display</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-currency-symbol">Show Currency Symbol (₹)</Label>
                    <p className="text-sm text-gray-500">Display the Rupee symbol before amounts</p>
                  </div>
                  <Switch
                    id="show-currency-symbol"
                    checked={showCurrencySymbol}
                    onCheckedChange={setShowCurrencySymbol}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="use-short-format">Use Short Format</Label>
                    <p className="text-sm text-gray-500">Display large amounts as 10K, 1.5L, 2Cr</p>
                  </div>
                  <Switch id="use-short-format" checked={useShortFormat} onCheckedChange={setUseShortFormat} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                  </div>
                  <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdatePreferences} className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export or delete your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Export Data</h3>
                <p className="text-sm text-gray-500">
                  Download all your financial data as a JSON file. You can use this file to backup your data or import
                  it into another system.
                </p>
                <Button
                  onClick={handleExportData}
                  variant="outline"
                  className="flex items-center"
                  disabled={isExporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export All Data"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delete Account</h3>
                <p className="text-sm text-gray-500">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="flex items-center bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}
