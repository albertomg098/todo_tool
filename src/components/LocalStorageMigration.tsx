"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { importLocalData } from "@/app/actions/migration";
import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

const TASKS_KEY = "daily-stack-tasks";
const WEEK_PLANS_KEY = "daily-stack-week-plans";
const DISMISSED_KEY = "daily-stack-migration-dismissed";

export function LocalStorageMigration() {
  const [hasData, setHasData] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const t = useTranslations("migration");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const tasks = localStorage.getItem(TASKS_KEY);
    const plans = localStorage.getItem(WEEK_PLANS_KEY);
    const hasTasks = tasks && JSON.parse(tasks).length > 0;
    const hasPlans = plans && JSON.parse(plans).length > 0;

    setHasData(!!(hasTasks || hasPlans));
  }, []);

  if (!hasData && !result) return null;

  const handleImport = async () => {
    setImporting(true);
    try {
      const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "[]");
      const plans = JSON.parse(localStorage.getItem(WEEK_PLANS_KEY) || "[]");

      const { tasksImported, plansImported } = await importLocalData(tasks, plans);

      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(WEEK_PLANS_KEY);
      setHasData(false);
      setResult(t("success", { tasks: tasksImported, plans: plansImported }));
    } catch {
      setResult(t("error"));
    } finally {
      setImporting(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setHasData(false);
  };

  if (result) {
    return (
      <Card className="mb-4 border-green-200 bg-green-50">
        <CardContent className="flex items-center justify-between py-3">
          <p className="text-sm text-green-800">{result}</p>
          <Button variant="ghost" size="icon" onClick={() => setResult(null)}>
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="flex items-center justify-between py-3">
        <p className="text-sm text-blue-800">{t("prompt")}</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleImport} disabled={importing}>
            <Upload className="h-4 w-4 mr-1" />
            {importing ? t("importing") : t("import")}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
