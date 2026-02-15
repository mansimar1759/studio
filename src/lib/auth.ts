"use client";

import { initializeFirebase } from "@/firebase";
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

const { auth } = initializeFirebase();
const googleProvider = new GoogleAuthProvider();

export const handleGoogleSignIn = async () => {
    return await signInWithPopup(auth, googleProvider);
};

export const handleEmailSignUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const handleEmailSignIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

    