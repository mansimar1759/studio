
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function DashboardRouterPage() {
  const { user, profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      // Wait until user and profile state is loaded
      return;
    }

    if (!user) {
      // If no user, redirect to login
      router.replace('/login');
      return;
    }

    // User is logged in, check for their profile
    if (profile) {
      // Profile exists, redirect based on role
      if (profile.role === 'student') {
        router.replace('/dashboard/student');
      } else if (profile.role === 'teacher') {
        router.replace('/dashboard/teacher');
      } else {
        // Role not defined, send to complete profile
        router.replace('/signup');
      }
    } else {
      // No profile found, user needs to complete it
      router.replace('/signup');
    }

  }, [user, profile, isLoading, router]);

  return (
    <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}

    