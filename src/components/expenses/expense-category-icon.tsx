import { Boxes, Car, Fuel, Gamepad2, GraduationCap, HeartPulse, ReceiptText, ShoppingBag, Utensils } from "lucide-react";
import type { ExpenseCategory } from "@/lib/types";

export function ExpenseCategoryIcon({ category, className }: { category: ExpenseCategory; className?: string }) {
  if (category === "Food") return <Utensils className={className} />;
  if (category === "Transport") return <Car className={className} />;
  if (category === "Fuel") return <Fuel className={className} />;
  if (category === "Shopping") return <ShoppingBag className={className} />;
  if (category === "Bills") return <ReceiptText className={className} />;
  if (category === "Health") return <HeartPulse className={className} />;
  if (category === "Entertainment") return <Gamepad2 className={className} />;
  if (category === "Education") return <GraduationCap className={className} />;
  return <Boxes className={className} />;
}
