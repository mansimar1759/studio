
"use client";

import { 
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

export const handleEmailSignUp = async (auth: Auth, email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const handleEmailSignIn = async (auth: Auth, email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}
