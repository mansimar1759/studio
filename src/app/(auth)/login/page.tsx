'use client';

import Link from 'next/link';
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
import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {FirebaseError} from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const {toast} = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleEmailSignIn(email, password);
      router.push('/dashboard');
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
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    try {
      await handleGoogleSignIn();
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      let title = 'Google Sign-In Failed';
      let description = 'An unknown error occurred. Please try again.';

      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request'
        ) {
          title = 'Sign-In Canceled';
          description =
            'The Google Sign-In window was closed before completion.';
        } else {
          description = `Could not sign in with Google. Please try again. (${error.code})`;
        }
      }

      toast({
        variant: 'destructive',
        title: title,
        description: description,
      });
    }
  };

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
            />
          </div>
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign in with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={onGoogleSignIn}>
          <GoogleIcon className="mr-2 h-4 w-4" />
          Sign in with google
        </Button>
      </CardContent>
    </Card>
  );
}
