import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Take control of your <span className="text-green-600">finances</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Tracksy helps you monitor your income, expenses, and savings all in one place. Start your journey to
                  financial freedom today.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Financial dashboard illustration"
                  width={400}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="mx-auto mt-4 max-w-[600px] text-gray-500 md:text-xl">
                Everything you need to manage your personal finances effectively.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {[
                {
                  title: "Expense Tracking",
                  description: "Log and categorize your expenses to understand your spending habits.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                      <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                      <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                      <path d="M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" />
                    </svg>
                  ),
                },
                {
                  title: "Income Management",
                  description: "Track all your income sources in one place for better financial planning.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <line x1="12" x2="12" y1="2" y2="22" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                },
                {
                  title: "Budget Planning",
                  description: "Create and manage budgets to help you stay on track with your financial goals.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                  ),
                },
                {
                  title: "Financial Reports",
                  description: "Generate detailed reports and visualizations to gain insights into your finances.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <path d="M3 3v18h18" />
                      <path d="m19 9-5 5-4-4-3 3" />
                    </svg>
                  ),
                },
                {
                  title: "Savings Goals",
                  description: "Set and track savings goals to achieve your financial milestones.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
                      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                      <path d="M16 11h0" />
                    </svg>
                  ),
                },
                {
                  title: "Secure & Private",
                  description: "Your financial data is encrypted and never shared with third parties.",
                  icon: (
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
                      className="h-10 w-10 text-green-600"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center rounded-lg border p-6 text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50 py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
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
          </div>
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Tracksy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
