"use client";

import { initializeFirebase } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp, DocumentData, Firestore } from "firebase/firestore";

let firestore: Firestore;
function getFirestoreInstance() {
    if (!firestore) {
        firestore = initializeFirebase().firestore;
    }
    return firestore;
}

export const createUserProfile = async (uid: string, data: Partial<DocumentData>) => {
    const db = getFirestoreInstance();
    const userDocRef = doc(db, "users", uid);
    
    const profileData = {
        id: uid,
        externalAuthId: data.externalAuthId || uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        createdAt: serverTimestamp(),
    };
    
    await setDoc(userDocRef, profileData);

    if (data.role === 'student') {
        const studentProfileRef = doc(db, `users/${uid}/studentProfile`, uid);
        await setDoc(studentProfileRef, {
            id: uid,
            userId: uid,
            batchId: data.batchId,
            academicYear: data.academicYear,
        });
    } else if (data.role === 'teacher') {
        const teacherProfileRef = doc(db, `users/${uid}/teacherProfile`, uid);
        await setDoc(teacherProfileRef, {
            id: uid,
            userId: uid,
            subjectIds: data.subjectIds || [],
            batchIds: data.batchIds || [],
        });
    }
};

export const getUserProfile = async (uid: string) => {
    const db = getFirestoreInstance();
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};