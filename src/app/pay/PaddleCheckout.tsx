"use client";

import Script from "next/script";
import { useState } from "react";

/** Client-side tokens are public by design. Going live swaps this and the environment. */
const PADDLE_CLIENT_TOKEN = "test_e65c310bd7f551018d7e1207b76";
const PADDLE_ENVIRONMENT = "sandbox";

type PaddleEvent = { name?: string };
type PaddleGlobal = {
  Environment: { set: (environment: string) => void };
  Initialize: (options: { token: string; eventCallback: (event: PaddleEvent) => void }) => void;
};

/** Paddle.js opens the checkout by itself from the `_ptxn` in the address. */
export function PaddleCheckout() {
  const [hasPaid, setHasPaid] = useState(false);

  function startPaddle() {
    const paddle = (window as unknown as { Paddle: PaddleGlobal }).Paddle;
    paddle.Environment.set(PADDLE_ENVIRONMENT);
    paddle.Initialize({
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: (event) => {
        if (event.name === "checkout.completed") setHasPaid(true);
      },
    });
  }

  return (
    <>
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" onLoad={startPaddle} />
      <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-moon/85">
        {hasPaid
          ? "You're all set. Go back to Ella: she'll be ready in a moment."
          : "Your secure checkout is opening. If it doesn't, go back to Ella and press Upgrade again."}
      </p>
    </>
  );
}
