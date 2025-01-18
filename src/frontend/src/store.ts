// src/store.ts
import { create } from 'zustand';
import { Student, StudentTransactionSummary } from './lib/types'; // Assuming this is where your Student type is defined

interface StudentState {
    selectedStudent: Student | null;
    setSelectedStudent: (student: Student | null) => void;
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
    transactionSummary: StudentTransactionSummary | null;
    setTransactionSummary: (summary: StudentTransactionSummary | null) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
    selectedStudent: null,
    setSelectedStudent: (student) => set({ selectedStudent: student }),
    isDrawerOpen: false,
    setIsDrawerOpen: (open) => set({ isDrawerOpen: open }),
    transactionSummary: null,
    setTransactionSummary: (summary) => set({ transactionSummary: summary }),
}));