
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
    if (isAuthLoading) {
        setProfileLoading(true);
        return; 
    }

    if (user) {
      setProfileLoading(true);
      fetchUserProfile(user.uid)
        .then(userProfile => {
          setProfile(userProfile);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [user, isAuthLoading]);

  return { user, profile, isLoading: isAuthLoading || isProfileLoading };
};

    