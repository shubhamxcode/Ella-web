"use client";

import { useEffect, useState } from "react";

/** Client-side tokens are public by design. Going live sets both in Vercel: a live_ token and "production". */
const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? "sandbox";

/** Paddle.js usually opens the checkout itself; after this long, the page asks it to. */
const CHECKOUT_OPEN_WAIT_MILLISECONDS = 2500;

type PaddleEvent = { name?: string };
type PaddleGlobal = {
  Environment: { set: (environment: string) => void };
  Initialize: (options: { token: string; eventCallback: (event: PaddleEvent) => void }) => void;
  Checkout: { open: (options: { transactionId: string }) => void };
};

export function PaddleCheckout() {
  const [hasPaid, setHasPaid] = useState(false);

  useEffect(() => {
    let hasCheckoutOpened = false;
    let openTimer: ReturnType<typeof setTimeout> | undefined;

    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      const paddle = (window as unknown as { Paddle: PaddleGlobal }).Paddle;
      // Live is Paddle.js's default; only sandbox has to be named.
      if (PADDLE_ENVIRONMENT === "sandbox") paddle.Environment.set("sandbox");
      paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (event) => {
          if (event.name === "checkout.loaded") hasCheckoutOpened = true;
          if (event.name === "checkout.completed") setHasPaid(true);
        },
      });
      const transactionId = new URLSearchParams(window.location.search).get("_ptxn");
      openTimer = setTimeout(() => {
        if (!hasCheckoutOpened && transactionId) paddle.Checkout.open({ transactionId });
      }, CHECKOUT_OPEN_WAIT_MILLISECONDS);
    };
    document.body.appendChild(script);

    return () => {
      clearTimeout(openTimer);
      script.remove();
    };
  }, []);

  return (
    <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-moon/85">
      {hasPaid
        ? "You're all set. Go back to Ella: she'll be ready in a moment."
        : "Your secure checkout is opening. If it doesn't, go back to Ella and press Upgrade again."}
    </p>
  );
}
