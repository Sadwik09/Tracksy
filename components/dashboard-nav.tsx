"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, CreditCard, DollarSign, PieChart, Settings, Target } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Income",
      href: "/dashboard/income",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
    },
    {
      title: "Expenses",
      href: "/dashboard/expenses",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Transactions",
      href: "/dashboard?tab=transactions",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Budget",
      href: "/dashboard?tab=budget",
      icon: <Target className="mr-2 h-4 w-4" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <PieChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (pathname === "/dashboard" &&
            item.href.includes("?tab=") &&
            pathname + item.href.substring(item.href.indexOf("?")) === item.href) ||
          (pathname.startsWith(item.href) && item.href !== "/dashboard")

        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "transparent",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
