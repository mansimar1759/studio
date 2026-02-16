"use client";

import { 
    Auth,
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const handleGoogleSignIn = async (auth: Auth) => {
    return await signInWithPopup(auth, googleProvider);
};

export const handleEmailSignUp = async (auth: Auth, email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const handleEmailSignIn = async (auth: Auth, email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}
