import type { ReactNode } from "react";
import { verifySession } from "@/lib/auth/dal";
import { PainelHeader } from "@/components/layout/painel-header";

export default async function PainelProtectedLayout({ children }: { children: ReactNode }) {
  await verifySession();

  return (
    <div className="min-h-screen bg-paper">
      <PainelHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 md:px-10">{children}</main>
    </div>
  );
}
