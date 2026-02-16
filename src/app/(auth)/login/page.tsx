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
import {GoogleIcon} from '@/components/icons/google';
import {handleGoogleSignIn, handleEmailSignIn} from '@/lib/auth';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {FirebaseError} from 'firebase/app';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const {toast} = useToast();
  const { user, profile, isLoading } = useUserProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    setEmailLoading(true);
    try {
      await handleEmailSignIn(email, password);
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
    } finally {
      setEmailLoading(false);
    }
  };

  const onGoogleSignIn = () => {
    setGoogleLoading(true);
    // Don't 'await'. Let the onAuthStateChanged listener and useEffect handle the rest.
    handleGoogleSignIn().catch((error) => {
      if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') {
        console.log("Google Sign-In popup closed by user. This is an expected behavior.");
      } else {
        console.error("An unexpected error occurred during Google Sign-In:", error);
        toast({
          variant: 'destructive',
          title: 'Sign-In Failed',
          description: 'Could not complete sign-in with Google. Please try again.',
        });
      }
    }).finally(() => {
        setGoogleLoading(false);
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isFormDisabled = emailLoading || googleLoading;

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
              disabled={isFormDisabled}
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
              disabled={isFormDisabled}
            />
          </div>
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              {emailLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign in with google
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isFormDisabled}>
          {googleLoading ? (
            'Signing in...'
          ) : (
            <>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
