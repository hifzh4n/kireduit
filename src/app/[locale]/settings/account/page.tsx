"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmButton } from "@/components/ui/alert-dialog";
import { Label, PasswordInput } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";

export default function Page() {
  const t = useTranslations("Settings");
  const tAuth = useTranslations("Auth");
  const router = useRouter();
  const { logout, removeAccount } = useAuth();
  const [password, setPassword] = useState("");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("account")}</CardTitle>
          <CardDescription>{t("accountIntro")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmButton
            title={t("logoutQuestion")}
            description={t("logoutDescription")}
            actionLabel={t("logout")}
            variant="danger"
            onConfirm={async () => {
              try {
                await logout();
                toast.success(t("logoutSuccessful"));
                router.replace("/login");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : t("unableLogout"));
              }
            }}
          >
            <Button className="w-full" variant="secondary">
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </ConfirmButton>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("deleteAccount")}</CardTitle>
          <CardDescription>{t("deleteAccountIntro")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="deletePassword">{tAuth("password")}</Label>
            <PasswordInput id="deletePassword" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={tAuth("passwordPlaceholder")} />
          </div>
          <ConfirmButton
            disabled={!password.trim()}
            title={t("deleteAccountQuestion")}
            description={t("deleteAccountDescription")}
            actionLabel={t("deleteAccountButton")}
            onConfirm={async () => {
              if (!password) {
                toast.error(t("enterPasswordFirst"));
                return;
              }
              await removeAccount(password);
              toast.success(t("accountDeleted"));
              router.replace("/register");
            }}
          >
            <Button className="w-full" variant="danger" disabled={!password.trim()}>
              <Trash2 className="h-4 w-4" />
              {t("deleteAccountButton")}
            </Button>
          </ConfirmButton>
        </CardContent>
      </Card>
    </div>
  );
}
