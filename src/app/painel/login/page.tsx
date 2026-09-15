"use client";

import { useActionState } from "react";
import { Mark } from "@/components/ui/mark";
import { login, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Mark tone="light" />
          <span className="font-display text-sm tracking-[0.18em] text-paper uppercase">
            Painel · Central Imóveis
          </span>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-xs tracking-[0.2em] text-muted-dark uppercase">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-line-dark bg-transparent px-4 py-3 text-paper outline-none focus-visible:border-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs tracking-[0.2em] text-muted-dark uppercase">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="border border-line-dark bg-transparent px-4 py-3 text-paper outline-none focus-visible:border-gold"
            />
          </div>

          {state?.error ? (
            <p role="alert" className="text-sm text-gold">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 bg-gold px-6 py-4 text-xs tracking-[0.25em] text-ink uppercase transition-colors hover:bg-gold-dim disabled:opacity-60"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
