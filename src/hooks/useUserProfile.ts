
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
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
  const [profile, setProfile] = useState<DocumentData | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // If auth state is still loading, we wait. Profile loading is already true by default.
    if (isAuthLoading) {
      return;
    }

    if (user) {
      // User is authenticated, now fetch their profile.
      setProfileLoading(true);
      fetchUserProfile(user.uid)
        .then(userProfile => {
          setProfile(userProfile);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    } else {
      // No user, so we are not loading a profile.
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user, isAuthLoading]);

  return { user, profile, isLoading: isAuthLoading || isProfileLoading };
};

    