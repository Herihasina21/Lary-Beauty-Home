"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(
    async function (_prev: { error?: string } | null, formData: FormData) {
      return (await loginAction(formData)) ?? null;
    },
    null,
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf7f5] px-4 dark:bg-[#141012]">
      <div className="w-full max-w-md rounded-3xl border border-or/20 bg-white p-8 shadow-lg dark:bg-[#1c1416]">
        <p className="text-center font-display text-3xl text-anthracite dark:text-rose-pale">Lary Beauty</p>
        <p className="mt-2 text-center text-sm text-texte/60 dark:text-rose-pale/50">
          Connectez-vous pour gérer votre site
        </p>

        <form action={action} className="mt-8 space-y-5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Email</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm dark:bg-[#2a1a1d] dark:text-rose-pale"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-texte dark:text-rose-pale">Mot de passe</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-or/20 bg-white px-3 py-2.5 text-sm dark:bg-[#2a1a1d] dark:text-rose-pale"
            />
          </label>
          {state?.error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-or py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
