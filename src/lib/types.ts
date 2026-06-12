import type { Timestamp } from "firebase/firestore";

export const expenseCategories = [
  "Food",
  "Transport",
  "Fuel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];
export type DebtType = "i-owe" | "owe-me";
export type DebtStatus = "paid" | "unpaid";

export type UserProfile = {
  displayName: string;
  email: string;
  favoriteContacts?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
};

export type Debt = {
  id: string;
  personName: string;
  amount: number;
  type: DebtType;
  status: DebtStatus;
  dueDate?: string;
  description: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  userId: string;
};

export type DeletedExpense = Expense & {
  deletedAt: number;
  expiresAt: number;
};

export type DeletedDebt = Debt & {
  deletedAt: number;
  expiresAt: number;
};
