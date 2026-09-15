import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decrypt, getSessionCookieValue } from "@/lib/auth/session";

export const verifySession = cache(async () => {
  const cookieValue = await getSessionCookieValue();
  const session = await decrypt(cookieValue);

  if (!session?.userId) {
    redirect("/painel/login");
  }

  return { isAuth: true, userId: session.userId as string };
});
