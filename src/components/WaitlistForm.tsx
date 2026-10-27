"use client";

import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useActionState, useId } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions";

const INITIAL_STATE: WaitlistState = { status: "idle", message: "" };

export function WaitlistForm({ source, tone = "night" }: { source: string; tone?: "night" | "lav" }) {
  const [state, formAction, isPending] = useActionState(joinWaitlist, INITIAL_STATE);
  const emailFieldID = useId();
  const messageID = useId();
  const isDone = state.status === "joined" || state.status === "already";
  const isProblem = state.status === "invalid" || state.status === "error" || state.status === "unavailable";

  if (isDone) {
    return (
      <div role="status" className="cut flex max-w-xl items-center gap-3 rounded-2xl bg-mint px-5 py-4 text-ink">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper">
          <Check size={18} strokeWidth={3} />
        </span>
        <p className="text-[17px] font-semibold">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-xl" noValidate={false}>
      <input type="hidden" name="source" value={source} />
      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label htmlFor={emailFieldID} className="sr-only">
        Your email
      </label>
      <div className="cut flex flex-col gap-2 rounded-2xl bg-paper p-2 sm:flex-row">
        <input
          id={emailFieldID}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@email.com"
          aria-invalid={isProblem || undefined}
          aria-describedby={state.message ? messageID : undefined}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 text-[17px] text-ink placeholder:text-ink/55 focus:outline-none focus-visible:bg-white/70"
        />
        <button
          type="submit"
          disabled={isPending}
          className="press cut-sm flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3 font-display text-xl tracking-wide text-paper uppercase disabled:cursor-wait disabled:opacity-80"
        >
          {isPending ? (
            <>
              <LoaderCircle size={20} className="animate-spin" /> Joining
            </>
          ) : (
            <>
              Join the waitlist <ArrowRight size={20} strokeWidth={2.6} />
            </>
          )}
        </button>
      </div>
      <p
        id={messageID}
        role={isProblem ? "alert" : undefined}
        className={`mt-2.5 min-h-[1.4em] text-[15px] ${
          isProblem ? (tone === "lav" ? "font-semibold text-ink" : "font-semibold text-blush") : tone === "lav" ? "text-ink/75" : "text-lav-l/80"
        }`}
      >
        {state.message || "No spam. One email when Maya is ready for your Mac."}
      </p>
    </form>
  );
}
