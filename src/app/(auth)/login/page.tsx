import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Your ID</Label>
            <Input id="id" placeholder="e.g. S12345 or T98765" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="flex flex-col space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link href="/dashboard/student">Login as Student</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
               <Link href="/dashboard/teacher">Login as Teacher</Link>
            </Button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline font-medium text-primary hover:text-primary/80">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
