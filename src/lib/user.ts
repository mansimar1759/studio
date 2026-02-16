
"use client";

import { doc, getDoc, setDoc, serverTimestamp, DocumentData } from "firebase/firestore";
import { firestore } from "@/firebase";

export const createUserProfile = async (uid: string, data: Partial<DocumentData>) => {
    
    if (data.role === 'student') {
        const studentDocRef = doc(firestore, "students", uid);
        const studentData = {
            id: uid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            batchId: data.batchId,
            enrollmentYear: data.academicYear,
            dateJoined: serverTimestamp(),
            role: 'student',
        };
        await setDoc(studentDocRef, studentData);
    } else if (data.role === 'teacher') {
        const teacherDocRef = doc(firestore, "teachers", uid);
        const teacherData = {
            id: uid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            subjectIds: data.subjectIds || [],
            batchIds: data.batchIds || [],
            dateJoined: serverTimestamp(),
            role: 'teacher'
        };
        await setDoc(teacherDocRef, teacherData);
    }
};

export const getUserProfile = async (uid: string) => {
    // Try to get from 'students' collection first
    const studentDocRef = doc(firestore, "students", uid);
    const studentDocSnap = await getDoc(studentDocRef);
    if (studentDocSnap.exists()) {
        return studentDocSnap.data();
    }

    // If not found in students, try 'teachers'
    const teacherDocRef = doc(firestore, "teachers", uid);
    const teacherDocSnap = await getDoc(teacherDocRef);
    if (teacherDocSnap.exists()) {
        return teacherDocSnap.data();
    }

    // User profile not found in either collection
    return null;
};
