
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
import {handleEmailSignIn} from '@/lib/auth';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {FirebaseError} from 'firebase/app';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { user, profile, isLoading } = useUserProfile();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // This effect handles redirection based on auth state.
    if (isLoading) {
      return; // Wait until user and profile are loaded.
    }

    if (user) {
      if (profile) {
        // User is logged in and has a profile, send to dashboard.
        router.replace('/dashboard');
      } else {
        // User is logged in but has no profile, send to sign-up to complete it.
        router.replace('/signup');
      }
    }
    // If no user, do nothing and show the login page.
  }, [user, profile, isLoading, router]);

  const onSignIn = async (e: React.FormEvent) => {
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
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSignIn} className="grid gap-4">
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
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
