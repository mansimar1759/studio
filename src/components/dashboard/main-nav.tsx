"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()
  const isStudentDashboard = pathname.startsWith("/dashboard/student");
  const isTeacherDashboard = pathname.startsWith("/dashboard/teacher");

  // Don't render the nav if we're on a sub-page like /profile
  if (!isStudentDashboard && !isTeacherDashboard) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {isStudentDashboard && (
        <span
          className="text-sm font-medium text-primary"
        >
          Student
        </span>
      )}
      {isTeacherDashboard && (
         <span
          className="text-sm font-medium text-primary"
        >
          Teacher
        </span>
      )}
    </nav>
  )
}
