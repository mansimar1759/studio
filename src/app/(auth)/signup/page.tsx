"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Role = "student" | "teacher";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("student");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    // For this demo, we'll just redirect.
    if (role === "student") {
      router.push("/dashboard/student");
    } else {
      router.push("/dashboard/teacher");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
        <CardDescription>
          Join EduEase AI and start your journey to smarter learning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup
              defaultValue="student"
              onValueChange={(value: Role) => setRole(value)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem value="student" id="student" className="peer sr-only" />
                <Label
                  htmlFor="student"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Student
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="teacher"
                  id="teacher"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="teacher"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Teacher
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="id">Your ID</Label>
            <Input id="id" placeholder="Create a unique ID" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          
          {role === 'student' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Select>
                  <SelectTrigger id="batch"><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024a">Batch A 2024</SelectItem>
                    <SelectItem value="2024b">Batch B 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Select>
                  <SelectTrigger id="year"><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {role === 'teacher' && (
             <>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                 <Select>
                  <SelectTrigger id="subject"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-batch">Batch</Label>
                <Select>
                  <SelectTrigger id="teacher-batch"><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024a">Batch A 2024</SelectItem>
                    <SelectItem value="2024b">Batch B 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-4">
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
