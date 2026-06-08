"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Label, PasswordInput } from "@/components/ui/form";

export default function Page() {
  const router = useRouter();
  const { logout, removeAccount } = useAuth();
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Leave KireDuit safely when you are done.</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmButton
            title="Logout?"
            description="You will need to login again to access KireDuit."
            actionLabel="Logout"
            variant="danger"
            onConfirm={async () => {
              try {
                await logout();
                toast.success("Logout successful");
                router.replace("/login");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to logout");
              }
            }}
          >
            <Button className="w-full" variant="secondary">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </ConfirmButton>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>Enter your password before deleting your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="deletePassword">Password</Label>
            <PasswordInput id="deletePassword" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <ConfirmButton
            disabled={!password.trim()}
            title="Delete account?"
            description="Your Firebase account will be deleted. Firestore data should be removed manually or by a backend cleanup function."
            actionLabel="Delete account"
            onConfirm={async () => {
              if (!password) {
                toast.error("Enter your password first.");
                return;
              }
              await removeAccount(password);
              toast.success("Account deleted");
              router.replace("/register");
            }}
          >
            <Button className="w-full" variant="danger" disabled={!password.trim()}>
              <Trash2 className="h-4 w-4" />
              Delete account
            </Button>
          </ConfirmButton>
        </CardContent>
      </Card>
    </div>
  );
}
