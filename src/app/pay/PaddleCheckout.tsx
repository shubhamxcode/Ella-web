"use client";

import { useEffect, useState } from "react";

/** Client-side tokens are public by design. Going live swaps this and the environment. */
const PADDLE_CLIENT_TOKEN = "test_e65c310bd7f551018d7e1207b76";
const PADDLE_ENVIRONMENT = "sandbox";

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
      paddle.Environment.set(PADDLE_ENVIRONMENT);
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
