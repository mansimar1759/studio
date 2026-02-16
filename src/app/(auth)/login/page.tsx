'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Button} from '@/components/ui/button';
import { handleEmailSignIn, handleGoogleSignIn } from '@/lib/auth';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {FirebaseError} from 'firebase/app';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { GoogleIcon } from '@/components/icons/google';

export default function LoginPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { user, isLoading } = useUserProfile();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // This effect handles redirection based on auth state.
    if (isLoading) {
      return; // Wait until user auth state is loaded.
    }

    if (user) {
      // User is logged in, redirect to the dashboard router.
      // The dashboard will handle whether to show the dashboard or profile completion.
      router.replace('/dashboard');
    }
    // If no user, do nothing and show the login page.
  }, [user, isLoading, router]);

  const onGoogleSignIn = async () => {
    try {
        await handleGoogleSignIn(auth);
        // The useEffect hook will handle the redirect once the user state is updated.
    } catch (error) {
        if (error instanceof FirebaseError && error.code !== 'auth/popup-closed-by-user') {
            toast({
                variant: 'destructive',
                title: 'Sign-in Failed',
                description: 'Could not sign in with Google. Please try again.',
            });
        }
    }
  }

  const onEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleEmailSignIn(auth, email, password);
      // The useEffect hook will handle the redirect once the user state is updated.
    } catch (error) {
      console.error(error);
      let title = 'An error occurred.';
      let description = 'Please try again.';

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential') {
          title = 'Login Failed';
          description =
            'The email or password you entered is incorrect. Please try again.';
        }
      }

      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
    }
  };

  if (isLoading && !user) { // Show loader only on initial page load
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="font-headline text-3xl">Welcome Back!</CardTitle>
        <CardDescription>
          Sign in to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form onSubmit={onEmailSignIn} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign in with Email'}
          </Button>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                    Or
                </span>
            </div>
        </div>

        <Button variant="outline" onClick={onGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
            Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
}
