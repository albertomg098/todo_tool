import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";

export default async function SignInPage() {
  const t = await getTranslations("app");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
      <SignIn />
    </div>
  );
}
