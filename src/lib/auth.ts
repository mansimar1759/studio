
"use client";

import { 
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

export const handleEmailSignUp = async (auth: Auth, email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export const handleEmailSignIn = async (auth: Auth, email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
}

export const handleGoogleSignIn = async (auth: Auth) => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return await signInWithPopup(auth, provider);
}
