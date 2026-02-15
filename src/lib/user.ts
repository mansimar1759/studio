"use client";

import { initializeFirebase } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const { firestore } = initializeFirebase();

export const createUserProfile = async (uid: string, data: any) => {
    const userDocRef = doc(firestore, "users", uid);
    return await setDoc(userDocRef, {
        uid,
        ...data,
        createdAt: serverTimestamp(),
    });
};

export const getUserProfile = async (uid: string) => {
    const userDocRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};

    