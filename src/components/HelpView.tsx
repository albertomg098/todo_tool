"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function HelpView() {
  const t = useTranslations("help");
  const tStatus = useTranslations("status");

  return (
    <div>
      <div className="py-4">
        <h1 className="text-xl font-semibold">{t("pageTitle")}</h1>
      </div>

      <div className="space-y-4">
        {/* Rituales */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("ritualsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">{t("ritual1Title")}</p>
              <p className="text-muted-foreground">{t("ritual1Desc")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("ritual2Title")}</p>
              <p className="text-muted-foreground">{t("ritual2Desc")}</p>
            </div>
            <div>
              <p className="font-semibold">{t("ritual3Title")}</p>
              <p className="text-muted-foreground">{t("ritual3Desc")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Estados */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("statesTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-slate-400 text-white">{tStatus("TODO")}</Badge>
              <span className="text-muted-foreground">{t("stateTodoDesc")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-600 text-white">{tStatus("TODAY")}</Badge>
              <span className="text-muted-foreground">{t("stateTodayDesc")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-600 text-white">{tStatus("BLOCKED")}</Badge>
              <span className="text-muted-foreground">{t("stateBlockedDesc")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white">{tStatus("DONE")}</Badge>
              <span className="text-muted-foreground">{t("stateDoneDesc")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Regla del 5 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("limitTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {t("limitDesc")}
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t("faqTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n}>
                <p className="font-semibold">{t(`faq${n}Q`)}</p>
                <p className="text-muted-foreground">{t(`faq${n}A`)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
