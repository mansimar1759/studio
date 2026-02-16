"use client";

import { initializeFirebase } from "@/firebase";
import { 
    Auth,
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

let auth: Auth;
function getAuthInstance() {
    if (!auth) {
        auth = initializeFirebase().auth;
    }
    return auth;
}

const googleProvider = new GoogleAuthProvider();

export const handleGoogleSignIn = async () => {
    return await signInWithPopup(getAuthInstance(), googleProvider);
};

export const handleEmailSignUp = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(getAuthInstance(), email, password);
}

export const handleEmailSignIn = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(getAuthInstance(), email, password);
}