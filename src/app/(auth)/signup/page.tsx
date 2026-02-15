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
import { useUser } from "@/firebase";
import { createUserProfile, getUserProfile } from "@/lib/user";
import { handleEmailSignUp, handleGoogleSignIn } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { FirebaseError } from "firebase/app";
import { GoogleIcon } from "@/components/icons/google";
import { Separator } from "@/components/ui/separator";

type Role = "student" | "teacher";

export default function SignupPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [batch, setBatch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [teacherBatch, setTeacherBatch] = useState("");

  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      // User is logged in, check if they have a profile
      getUserProfile(user.uid).then(profile => {
        // A complete profile must have a role.
        if (profile && profile.role) {
          // They have a complete profile, send them to the dashboard
          router.push('/dashboard');
        } else {
          // No profile, or incomplete profile (no role). They need to complete it.
          setIsCompletingProfile(true);
          setEmail(user.email || "");
        }
      });
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const profileData = {
      role,
      email: isCompletingProfile ? user?.email : email,
      displayName: isCompletingProfile ? user?.displayName : email,
      batch: role === 'student' ? batch : teacherBatch,
      semester: role === 'student' ? semester : '',
      subject: role === 'teacher' ? subject : '',
    };

    try {
      if (isCompletingProfile && user) {
        // Just create the profile for the existing Google user
        await createUserProfile(user.uid, profileData);
      } else {
        // Create a new email/password user and then their profile
        const userCredential = await handleEmailSignUp(email, password);
        await createUserProfile(userCredential.user.uid, profileData);
      }
      toast({
        title: "Success!",
        description: "Your account has been created.",
      });
      router.push("/dashboard");
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
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await handleGoogleSignIn();
      // The useEffect will handle redirection
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: "Could not sign in with Google. Please try again.",
      });
    }
  };
  
  if (isUserLoading || (user && !isCompletingProfile)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-headline">
          {isCompletingProfile ? "Complete Your Profile" : "Create an Account"}
        </CardTitle>
        <CardDescription>
          {isCompletingProfile ? "Please provide a few more details to get started." : "Join EduEase AI and start your journey to smarter learning."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          {!isCompletingProfile && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="id">Your ID</Label>
                <Input id="id" placeholder="Create a unique ID" required value={id} onChange={(e) => setId(e.target.value)} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </>
          )}

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
          
          {role === 'student' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Select onValueChange={setBatch} required>
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
                <Label htmlFor="semester">Semester</Label>
                <Select onValueChange={setSemester} required>
                  <SelectTrigger id="semester"><SelectValue placeholder="Select semester" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {role === 'teacher' && (
             <>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                 <Select onValueChange={setSubject} required>
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
                <Select onValueChange={setTeacherBatch} required>
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

          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Saving..." : (isCompletingProfile ? "Save Profile" : "Sign Up")}
          </Button>
        </form>

        {!isCompletingProfile && (
           <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={onGoogleSignIn}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
           </>
        )}

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline font-medium text-accent hover:text-primary">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
