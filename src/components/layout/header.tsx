import Link from "next/link"
import { BookOpenCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpenCheck className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl">EduEase AI</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <Button asChild variant="outline" className="shadow-[0_0_15px] shadow-primary/50 transition-shadow hover:shadow-primary/70 dark:shadow-accent/50 dark:hover:shadow-accent/70">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
