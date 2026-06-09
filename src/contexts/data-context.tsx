"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import type { Debt, DeletedDebt, DeletedExpense, Expense } from "@/lib/types";
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
  deletedExpenses: DeletedExpense[];
  deletedDebts: DeletedDebt[];
  loading: boolean;
  error: string | null;
  addExpense: (input: ExpenseInput) => Promise<void>;
  updateExpense: (id: string, input: ExpenseInput) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  restoreExpense: (id: string) => Promise<void>;
  permanentlyDeleteExpense: (id: string) => Promise<void>;
  addDebt: (input: DebtInput) => Promise<void>;
  updateDebt: (id: string, input: DebtInput) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  restoreDebt: (id: string) => Promise<void>;
  permanentlyDeleteDebt: (id: string) => Promise<void>;
  markDebt: (id: string, status: Debt["status"]) => Promise<void>;
};

const deletedRetentionMs = 30 * 24 * 60 * 60 * 1000;

const DataContext = createContext<DataContextValue | undefined>(undefined);

function restoreDeletedRecord<T extends { deletedAt: number; expiresAt: number }>(record: T) {
  const { deletedAt, expiresAt, ...data } = record;
  void deletedAt;
  void expiresAt;
  return data;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [deletedExpenses, setDeletedExpenses] = useState<DeletedExpense[]>([]);
  const [deletedDebts, setDeletedDebts] = useState<DeletedDebt[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [debtsLoading, setDebtsLoading] = useState(true);
  const [deletedLoading, setDeletedLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const expensesQuery = query(collection(db, "users", user.uid, "expenses"), orderBy("date", "desc"));
    const debtsQuery = query(collection(db, "users", user.uid, "debts"), orderBy("createdAt", "desc"));
    const deletedExpensesQuery = query(collection(db, "users", user.uid, "deletedExpenses"), orderBy("deletedAt", "desc"));
    const deletedDebtsQuery = query(collection(db, "users", user.uid, "deletedDebts"), orderBy("deletedAt", "desc"));

    const unsubscribeExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        setError(null);
        setExpenses(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Expense));
        setExpensesLoading(false);
      },
      () => {
        setError("Please try again later.");
        setExpensesLoading(false);
      },
    );

    const unsubscribeDebts = onSnapshot(
      debtsQuery,
      (snapshot) => {
        setError(null);
        setDebts(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Debt));
        setDebtsLoading(false);
      },
      () => {
        setError("Please try again later.");
        setDebtsLoading(false);
      },
    );

    const unsubscribeDeletedExpenses = onSnapshot(
      deletedExpensesQuery,
      (snapshot) => {
        const now = Date.now();
        const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as DeletedExpense);
        setDeletedExpenses(records.filter((item) => item.expiresAt > now));
        void Promise.all(records.filter((item) => item.expiresAt <= now).map((item) => deleteDoc(doc(db, "users", user.uid, "deletedExpenses", item.id))));
        setDeletedLoading(false);
      },
      (reason) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Recently deleted expenses could not load.", reason);
        }
        setDeletedLoading(false);
      },
    );

    const unsubscribeDeletedDebts = onSnapshot(
      deletedDebtsQuery,
      (snapshot) => {
        const now = Date.now();
        const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as DeletedDebt);
        setDeletedDebts(records.filter((item) => item.expiresAt > now));
        void Promise.all(records.filter((item) => item.expiresAt <= now).map((item) => deleteDoc(doc(db, "users", user.uid, "deletedDebts", item.id))));
        setDeletedLoading(false);
      },
      (reason) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("Recently deleted debts could not load.", reason);
        }
        setDeletedLoading(false);
      },
    );

    return () => {
      unsubscribeExpenses();
      unsubscribeDebts();
      unsubscribeDeletedExpenses();
      unsubscribeDeletedDebts();
    };
  }, [user]);

  const value = useMemo<DataContextValue>(
    () => ({
      expenses,
      debts,
      deletedExpenses,
      deletedDebts,
      loading: expensesLoading || debtsLoading || deletedLoading,
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
        const sourceRef = doc(db, "users", user.uid, "expenses", id);
        const deletedRef = doc(db, "users", user.uid, "deletedExpenses", id);
        const snapshot = await getDoc(sourceRef);
        if (!snapshot.exists()) return;
        const now = Date.now();
        const batch = writeBatch(db);
        batch.set(deletedRef, {
          ...snapshot.data(),
          deletedAt: now,
          expiresAt: now + deletedRetentionMs,
          updatedAt: serverTimestamp(),
        });
        batch.delete(sourceRef);
        await batch.commit();
      },
      async restoreExpense(id) {
        if (!user) return;
        const sourceRef = doc(db, "users", user.uid, "deletedExpenses", id);
        const restoredRef = doc(db, "users", user.uid, "expenses", id);
        const snapshot = await getDoc(sourceRef);
        if (!snapshot.exists()) return;
        const data = restoreDeletedRecord(snapshot.data() as DeletedExpense);
        await setDoc(restoredRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
        await deleteDoc(sourceRef);
      },
      async permanentlyDeleteExpense(id) {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.uid, "deletedExpenses", id));
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
        const sourceRef = doc(db, "users", user.uid, "debts", id);
        const deletedRef = doc(db, "users", user.uid, "deletedDebts", id);
        const snapshot = await getDoc(sourceRef);
        if (!snapshot.exists()) return;
        const now = Date.now();
        const batch = writeBatch(db);
        batch.set(deletedRef, {
          ...snapshot.data(),
          deletedAt: now,
          expiresAt: now + deletedRetentionMs,
          updatedAt: serverTimestamp(),
        });
        batch.delete(sourceRef);
        await batch.commit();
      },
      async restoreDebt(id) {
        if (!user) return;
        const sourceRef = doc(db, "users", user.uid, "deletedDebts", id);
        const restoredRef = doc(db, "users", user.uid, "debts", id);
        const snapshot = await getDoc(sourceRef);
        if (!snapshot.exists()) return;
        const data = restoreDeletedRecord(snapshot.data() as DeletedDebt);
        await setDoc(restoredRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
        await deleteDoc(sourceRef);
      },
      async permanentlyDeleteDebt(id) {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.uid, "deletedDebts", id));
      },
      async markDebt(id, status) {
        if (!user) return;
        await updateDoc(doc(db, "users", user.uid, "debts", id), {
          status,
          updatedAt: serverTimestamp(),
        });
      },
    }),
    [debts, debtsLoading, deletedDebts, deletedExpenses, deletedLoading, error, expenses, expensesLoading, user],
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
