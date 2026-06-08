"use client";

import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  removeAccount: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(nextUser: User | null) {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    const ref = doc(db, "users", nextUser.uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      setProfile(snapshot.data() as UserProfile);
    } else {
      const fallback = {
        displayName: nextUser.displayName || "KireDuit User",
        email: nextUser.email || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(ref, fallback);
      setProfile({ displayName: fallback.displayName, email: fallback.email });
    }
  }

  useEffect(() => {
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      await loadProfile(nextUser);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      async login(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },
      async register(displayName, email, password) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName });
        await setDoc(doc(db, "users", credential.user.uid), {
          displayName,
          email,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      },
      async logout() {
        await signOut(auth);
      },
      async forgotPassword(email) {
        await sendPasswordResetEmail(auth, email);
      },
      async refreshProfile() {
        await loadProfile(auth.currentUser);
      },
      async updateDisplayName(displayName) {
        if (!auth.currentUser) return;
        await updateProfile(auth.currentUser, { displayName });
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          displayName,
          updatedAt: serverTimestamp(),
        });
        await loadProfile(auth.currentUser);
      },
      async changePassword(currentPassword, newPassword) {
        if (!auth.currentUser?.email) return;
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
      },
      async removeAccount(password) {
        if (!auth.currentUser?.email) return;
        const userId = auth.currentUser.uid;
        const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        const batch = writeBatch(db);
        const expenses = await getDocs(collection(db, "users", userId, "expenses"));
        const debts = await getDocs(collection(db, "users", userId, "debts"));
        expenses.forEach((item) => batch.delete(item.ref));
        debts.forEach((item) => batch.delete(item.ref));
        batch.delete(doc(db, "users", userId));
        await batch.commit();
        await deleteUser(auth.currentUser);
      },
    }),
    [loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
