"use client";

import { doc, getDoc, setDoc, serverTimestamp, DocumentData, Firestore } from "firebase/firestore";

export const createUserProfile = async (firestore: Firestore, uid: string, data: Partial<DocumentData>) => {
    const userDocRef = doc(firestore, "users", uid);
    
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
        const studentProfileRef = doc(firestore, `users/${uid}/studentProfile`, uid);
        await setDoc(studentProfileRef, {
            id: uid,
            userId: uid,
            batchId: data.batchId,
            academicYear: data.academicYear,
        });
    } else if (data.role === 'teacher') {
        const teacherProfileRef = doc(firestore, `users/${uid}/teacherProfile`, uid);
        await setDoc(teacherProfileRef, {
            id: uid,
            userId: uid,
            subjectIds: data.subjectIds || [],
            batchIds: data.batchIds || [],
        });
    }
};

export const getUserProfile = async (firestore: Firestore, uid: string) => {
    const userDocRef = doc(firestore, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
};
