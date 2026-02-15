import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 relative">
       <div className="absolute top-4 left-4 md:left-8">
        <Link href="/" className="flex items-center space-x-2 text-primary transition-opacity hover:opacity-80">
          <BookOpenCheck className="h-6 w-6" />
          <span className="font-bold font-headline text-lg">EduEase</span>
        </Link>
      </div>
      <div className="absolute top-4 right-4 md:right-8">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
