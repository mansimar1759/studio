"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard/student"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/student" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Student
      </Link>
      <Link
        href="/dashboard/teacher"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/teacher" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Teacher
      </Link>
    </nav>
  )
}
