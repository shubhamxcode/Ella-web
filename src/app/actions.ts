"use server";

/**
 * Adds an email to the Ella waitlist (Supabase `waitlist` table).
 * The table only allows inserts with the public key (row-level security),
 * so nobody can read the list from the website.
 */
export type WaitlistState = {
  status: "idle" | "joined" | "already" | "invalid" | "unavailable" | "error";
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function joinWaitlist(_previousState: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // Bots fill every field; people never see this one.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "joined", message: "You're on the list." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return { status: "invalid", message: "That doesn't look like an email address. Check it and try again." };
  }

  const supabaseURL = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseURL || !supabaseKey) {
    return { status: "unavailable", message: "The waitlist isn't open yet. Please check back soon." };
  }

  try {
    const response = await fetch(`${supabaseURL}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email, source: String(formData.get("source") ?? "site").slice(0, 32) }),
      cache: "no-store",
    });

    if (response.ok) {
      return { status: "joined", message: "You're on the list. Ella will write when she's ready for your Mac." };
    }
    // A unique email that's already there.
    if (response.status === 409) {
      return { status: "already", message: "You're already on the list. Ella hasn't forgotten you." };
    }
    console.error("Waitlist insert failed", response.status, await response.text());
    return { status: "error", message: "Couldn't save that just now. Try again in a minute." };
  } catch (error) {
    console.error("Waitlist insert failed", error);
    return { status: "error", message: "Couldn't reach the waitlist. Check your connection and try again." };
  }
}
