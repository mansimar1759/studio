"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { getUserProfile } from '@/lib/user';
import { Loader2 } from 'lucide-react';

export default function DashboardRouterPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) {
      // Wait until user state is loaded
      return;
    }

    if (!user) {
      // If no user, redirect to login
      router.replace('/login');
      return;
    }

    // User is logged in, check for their profile
    getUserProfile(user.uid)
      .then(profile => {
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
      })
      .catch(error => {
        console.error("Error fetching user profile:", error);
        // On error, maybe send to login
        router.replace('/login');
      });

  }, [user, isUserLoading, router]);

  return (
    <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}

    