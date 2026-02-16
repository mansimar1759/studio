
"use client";

import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth } from "@/firebase";

export const handleEmailSignUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const handleEmailSignIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

export const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
}
