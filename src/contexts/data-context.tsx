"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import type { Debt, Expense } from "@/lib/types";
import { useAuth } from "./auth-context";

type ExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt" | "userId" | "description"> & {
  description?: string;
};
type DebtInput = Omit<Debt, "id" | "createdAt" | "updatedAt" | "userId" | "description" | "dueDate"> & {
  dueDate?: string;
  description?: string;
};

type DataContextValue = {
  expenses: Expense[];
  debts: Debt[];
  loading: boolean;
  error: string | null;
  addExpense: (input: ExpenseInput) => Promise<void>;
  updateExpense: (id: string, input: ExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  addDebt: (input: DebtInput) => Promise<void>;
  updateDebt: (id: string, input: DebtInput) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  markDebt: (id: string, status: Debt["status"]) => Promise<void>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [debtsLoading, setDebtsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const expensesQuery = query(collection(db, "users", user.uid, "expenses"), orderBy("date", "desc"));
    const debtsQuery = query(collection(db, "users", user.uid, "debts"), orderBy("createdAt", "desc"));

    const unsubscribeExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        setExpenses(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Expense));
        setExpensesLoading(false);
      },
      () => {
        setError("Unable to load report. Please try again later.");
        setExpensesLoading(false);
      },
    );

    const unsubscribeDebts = onSnapshot(
      debtsQuery,
      (snapshot) => {
        setDebts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Debt));
        setDebtsLoading(false);
      },
      () => {
        setError("Unable to load report. Please try again later.");
        setDebtsLoading(false);
      },
    );

    return () => {
      unsubscribeExpenses();
      unsubscribeDebts();
    };
  }, [user]);

  const value = useMemo<DataContextValue>(
    () => ({
      expenses,
      debts,
      loading: expensesLoading || debtsLoading,
      error,
      async addExpense(input) {
        if (!user) return;
        await addDoc(collection(db, "users", user.uid, "expenses"), {
          ...input,
          description: input.description || "",
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      },
      async updateExpense(id, input) {
        if (!user) return;
        await updateDoc(doc(db, "users", user.uid, "expenses", id), {
          ...input,
          description: input.description || "",
          updatedAt: serverTimestamp(),
        });
      },
      async deleteExpense(id) {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.uid, "expenses", id));
      },
      async addDebt(input) {
        if (!user) return;
        await addDoc(collection(db, "users", user.uid, "debts"), {
          ...input,
          dueDate: input.dueDate || "",
          description: input.description || "",
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      },
      async updateDebt(id, input) {
        if (!user) return;
        await updateDoc(doc(db, "users", user.uid, "debts", id), {
          ...input,
          dueDate: input.dueDate || "",
          description: input.description || "",
          updatedAt: serverTimestamp(),
        });
      },
      async deleteDebt(id) {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.uid, "debts", id));
      },
      async markDebt(id, status) {
        if (!user) return;
        await updateDoc(doc(db, "users", user.uid, "debts", id), {
          status,
          updatedAt: serverTimestamp(),
        });
      },
    }),
    [debts, debtsLoading, error, expenses, expensesLoading, user],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used inside DataProvider");
  }
  return context;
}
