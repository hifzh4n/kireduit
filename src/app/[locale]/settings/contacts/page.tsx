"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/form";

export default function Page() {
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  const { profile, updateFavoriteContacts } = useAuth();
  const [newContact, setNewContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contacts = profile?.favoriteContacts || [];

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    if (!newContact.trim()) return;
    
    const name = newContact.trim();
    if (contacts.includes(name)) {
      setNewContact("");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateFavoriteContacts([...contacts, name]);
      toast.success(t("contactAdded"));
      setNewContact("");
    } catch (error) {
      toast.error(tCommon("tryAgain"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeContact(name: string) {
    setIsSubmitting(true);
    try {
      await updateFavoriteContacts(contacts.filter(c => c !== name));
      toast.success(t("contactRemoved"));
    } catch (error) {
      toast.error(tCommon("tryAgain"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("favoriteContacts")}</CardTitle>
        <p className="text-sm text-slate-500 dark:text-slate-300">{t("contactsDescription")}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addContact} className="flex gap-2">
          <Input 
            value={newContact} 
            onChange={(e) => setNewContact(e.target.value)} 
            placeholder={t("contactName")} 
            className="flex-1"
          />
          <Button type="submit" disabled={isSubmitting || !newContact.trim()}>
            {t("addContact")}
          </Button>
        </form>

        <div className="space-y-2">
          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">{t("noContacts")}</p>
          ) : (
            contacts.map((contact) => (
              <div key={contact} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="font-medium">{contact}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeContact(contact)}
                  disabled={isSubmitting}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  aria-label={tCommon("delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
