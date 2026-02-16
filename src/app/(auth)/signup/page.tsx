
"use client";

import { useState, useEffect } from "react";
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
import { createUserProfile } from "@/lib/user";
import { handleEmailSignUp, handleGoogleSignIn } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";
import { GoogleIcon } from "@/components/icons/google";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Loader2 } from "lucide-react";

type Role = "student" | "teacher";

export default function SignupPage() {
  const { user, profile, isLoading } = useUserProfile();
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [batch, setBatch] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherBatch, setTeacherBatch] = useState("");

  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  useEffect(() => {
    if (isLoading) {
      return; // Wait for user and profile to load
    }

    if (user && profile) {
      // User and profile exist, they are fully signed up.
      router.push('/dashboard');
    } else if (user && !profile) {
      // User exists but has no profile, show the completion form.
      setIsCompletingProfile(true);
      setEmail(user.email || "");
      const nameParts = user.displayName?.split(' ') || [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(' ') || "");
    } else {
      // No user, show the standard signup form.
      setIsCompletingProfile(false);
    }
  }, [user, profile, isLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please select a role (Student or Teacher).",
        });
        return;
    }
    setFormLoading(true);

    const profileData = {
      role,
      email: isCompletingProfile ? user?.email : email,
      firstName,
      lastName,
      batchId: role === 'student' ? batch : teacherBatch,
      academicYear: role === 'student' ? parseInt(academicYear) : undefined,
      subjectIds: role === 'teacher' ? [subject] : [],
      batchIds: role === 'teacher' ? [teacherBatch] : [],
    };

    try {
      let userId;
      if (isCompletingProfile && user) {
        // User signed in with Google and is now completing their profile.
        userId = user.uid;
      } else {
        // A new user is signing up with email and password.
        const userCredential = await handleEmailSignUp(email, password);
        userId = userCredential.user.uid;
      }
      
      await createUserProfile(userId, {
        ...profileData,
        id: userId,
        externalAuthId: userId
      });

      // The useEffect will handle redirecting to the dashboard after the user state updates.
    } catch (error) {
      console.error(error);
      let title = "An error occurred.";
      let description = "Please try again.";

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          title = "Sign-up Failed";
          description = "This email is already in use. Please sign in or use a different email.";
        }
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setFormLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await handleGoogleSignIn();
      // The useEffect hook will handle showing the profile form or redirecting.
    } catch (error) {
      console.error(error);
       if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
          // Don't show a toast for this specific error, as it's a common user action.
          return;
      }
      toast({
        variant: 'destructive',
        title: 'Sign-In Failed',
        description: 'Could not complete sign-in with Google. Please try again.',
      });
    } finally {
        setGoogleLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isFormDisabled = formLoading || googleLoading;

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-headline">
          {isCompletingProfile ? "Complete Your Profile" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {isCompletingProfile ? "Please provide a few more details to get started." : "Join EduEase and start your journey to smarter learning."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isCompletingProfile && (
           <>
            <div className="grid gap-4">
              <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isFormDisabled}>
                {googleLoading ? "Redirecting..." : (
                  <>
                    <GoogleIcon className="mr-2 h-4 w-4" />
                    Continue with Google
                  </>
                )}
              </Button>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign up with email
                </span>
              </div>
            </div>
           </>
        )}

        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={isFormDisabled} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isFormDisabled} />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isCompletingProfile || isFormDisabled} />
          </div>

          {!isCompletingProfile && (
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isFormDisabled} />
            </div>
          )}

          <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup
              value={role}
              onValueChange={(value: Role) => setRole(value)}
              className="grid grid-cols-2 gap-4"
              disabled={isFormDisabled}
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
          
          {role === 'student' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Select onValueChange={setBatch} required disabled={isFormDisabled}>
                  <SelectTrigger id="batch"><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse-aiml">CSE-AIML</SelectItem>
                    <SelectItem value="cse-ds">CSE-DS</SelectItem>
                    <SelectItem value="cse-batch-1">CSE Batch 1</SelectItem>
                    <SelectItem value="cse-batch-2">CSE Batch 2</SelectItem>
                    <SelectItem value="cse-batch-3">CSE Batch 3</SelectItem>
                    <SelectItem value="cse-eve">CSE Eve</SelectItem>
                    <SelectItem value="it-1">IT 1</SelectItem>
                    <SelectItem value="it-2">IT 2</SelectItem>
                    <SelectItem value="it-eve">IT Eve</SelectItem>
                    <SelectItem value="ece">ECE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select onValueChange={setAcademicYear} required disabled={isFormDisabled}>
                  <SelectTrigger id="academicYear"><SelectValue placeholder="Select year" /></SelectTrigger>
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
                 <Select onValueChange={setSubject} required disabled={isFormDisabled}>
                  <SelectTrigger id="subject"><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied-physics">Applied Physics</SelectItem>
                    <SelectItem value="applied-mathematics">Applied Mathematics</SelectItem>
                    <SelectItem value="applied-chemistry">Applied Chemistry</SelectItem>
                    <SelectItem value="electrical-science">Electrical science</SelectItem>
                    <SelectItem value="manufacturing-process">Manufacturing Process</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-batch">Batch</Label>
                <Select onValueChange={setTeacherBatch} required disabled={isFormDisabled}>
                  <SelectTrigger id="teacher-batch"><SelectValue placeholder="Select batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse-aiml">CSE-AIML</SelectItem>
                    <SelectItem value="cse-ds">CSE-DS</SelectItem>
                    <SelectItem value="cse-batch-1">CSE Batch 1</SelectItem>
                    <SelectItem value="cse-batch-2">CSE Batch 2</SelectItem>
                    <SelectItem value="cse-batch-3">CSE Batch 3</SelectItem>
                    <SelectItem value="cse-eve">CSE Eve</SelectItem>
                    <SelectItem value="it-1">IT 1</SelectItem>
                    <SelectItem value="it-2">IT 2</SelectItem>
                    <SelectItem value="it-eve">IT Eve</SelectItem>
                    <SelectItem value="ece">ECE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-4" disabled={isFormDisabled}>
            {formLoading ? "Saving..." : (isCompletingProfile ? "Save Profile" : "Sign Up")}
          </Button>
        </form>

        {!isCompletingProfile && (
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline font-medium text-accent hover:text-primary">
              Sign in
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    