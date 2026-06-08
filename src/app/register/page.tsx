import { PublicOnly } from "@/components/auth/auth-gate";
import { AuthCard } from "@/components/auth/auth-card";

export default function Page() {
  return (
    <PublicOnly>
      <AuthCard mode="register" />
    </PublicOnly>
  );
}
