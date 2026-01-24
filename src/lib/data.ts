import type { Task } from "./types";

export const mockTasks: Task[] = [
  { name: "Lab Report 1", deadline: "2026-09-15", subject: "Applied Physics", weightage: 20, difficulty: "Hard" },
  { name: "Vector Calculus Assignment", deadline: "2026-09-10", subject: "Applied Mathematics", weightage: 15, difficulty: "Medium" },
  { name: "Essay on Thermodynamics", deadline: "2026-09-20", subject: "Applied Chemistry", weightage: 25, difficulty: "Medium" },
  { name: "Circuit Analysis Problems", deadline: "2026-09-12", subject: "Electrical science", weightage: 10, difficulty: "Easy" },
  { name: "Workshop Practice", deadline: "2026-09-25", subject: "Manufacturing Process", weightage: 15, difficulty: "Easy" },
  { name: "Lab Report 2", deadline: "2026-09-30", subject: "Applied Physics", weightage: 30, difficulty: "Hard" },
];

export const mockStudentData = [
    { id: 'S001', name: 'Alice', marks: 85 },
    { id: 'S002', name: 'Bob', marks: 92 },
    { id: 'S003', name: 'Charlie', marks: 78 },
    { id: 'S004', name: 'Diana', marks: 88 },
    { id: 'S005', name: 'Eve', marks: 95 },
];

export const subjectDistributionData = [
  { subject: 'physics', tasks: 5, fill: 'var(--color-physics)' },
  { subject: 'math', tasks: 8, fill: 'var(--color-math)' },
  { subject: 'chemistry', tasks: 4, fill: 'var(--color-chemistry)' },
  { subject: 'electrical', tasks: 6, fill: 'var(--color-electrical)' },
  { subject: 'manufacturing', tasks: 2, fill: 'var(--color-manufacturing)' },
];
