
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { getUserProfile as fetchUserProfile } from '@/lib/user';
import { DocumentData } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface UserProfileState {
    user: User | null;
    profile: DocumentData | null;
    isLoading: boolean;
}

export const useUserProfile = (): UserProfileState => {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // If auth state is still loading, we wait.
    if (isAuthLoading) {
      setProfileLoading(true); // Ensure profile is marked as loading
      return;
    }

    if (user) {
      // User is authenticated, now fetch their profile.
      setProfileLoading(true);
      fetchUserProfile(firestore, user.uid)
        .then(userProfile => {
          setProfile(userProfile);
        })
        .catch(error => {
          console.error("Failed to fetch user profile:", error);
          setProfile(null); // On error, assume no profile exists.
        })
        .finally(() => {
          setProfileLoading(false);
        });
    } else {
      // No user, so we are not loading a profile.
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user, isAuthLoading, firestore]);

  return { user, profile, isLoading: isAuthLoading || isProfileLoading };
};

    
