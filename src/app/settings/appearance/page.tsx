"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  const { setTheme, theme } = useTheme();
  const options = [
    { value: "light", label: "Light Theme", icon: Sun },
    { value: "dark", label: "Dark Theme", icon: Moon },
    { value: "system", label: "Use System", icon: Monitor },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Button
              key={option.value}
              className="w-full justify-start"
              variant={theme === option.value ? "default" : "outline"}
              onClick={() => setTheme(option.value)}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
