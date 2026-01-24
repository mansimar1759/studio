import type { Task } from "./types";

export const mockTasks: Task[] = [
  { name: "Physics Lab Report", deadline: "2024-09-15", subject: "Physics", weightage: 20, difficulty: "Hard" },
  { name: "Calculus Problem Set 5", deadline: "2024-09-10", subject: "Mathematics", weightage: 15, difficulty: "Medium" },
  { name: "History Essay on WWII", deadline: "2024-09-20", subject: "History", weightage: 25, difficulty: "Medium" },
  { name: "Chemistry Titration Exp.", deadline: "2024-09-12", subject: "Chemistry", weightage: 10, difficulty: "Easy" },
  { name: "English Literature Review", deadline: "2024-09-25", subject: "English", weightage: 15, difficulty: "Easy" },
  { name: "Computer Science Project", deadline: "2024-09-30", subject: "CS", weightage: 30, difficulty: "Hard" },
];

export const mockStudentData = [
    { id: 'S001', name: 'Alice', marks: 85 },
    { id: 'S002', name: 'Bob', marks: 92 },
    { id: 'S003', name: 'Charlie', marks: 78 },
    { id: 'S004', name: 'Diana', marks: 88 },
    { id: 'S005', name: 'Eve', marks: 95 },
];

export const subjectDistributionData = [
  { subject: 'Physics', tasks: 5, fill: 'var(--color-physics)' },
  { subject: 'Math', tasks: 8, fill: 'var(--color-math)' },
  { subject: 'History', tasks: 3, fill: 'var(--color-history)' },
  { subject: 'Chemistry', tasks: 4, fill: 'var(--color-chemistry)' },
  { subject: 'English', tasks: 6, fill: 'var(--color-english)' },
  { subject: 'CS', tasks: 2, fill: 'var(--color-cs)' },
  { subject: 'Mathematics', tasks: 0, fill: 'var(--color-math)'}
];
