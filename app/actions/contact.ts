"use server";

import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  company: z.string().min(2, "Please enter your company").max(160),
  email: z.string().email("Please enter a valid email"),
  consumption: z
    .enum(["<0.5", "0.5-1.5", "1.5-5", "5+", "unsure"], {
      errorMap: () => ({ message: "Pick a consumption band" }),
    })
    .default("unsure"),
  message: z
    .string()
    .min(10, "A short note helps us prepare the right demo")
    .max(2000),
  // Honeypot — bots fill it, humans don't see it.
  website: z.string().max(0).optional(),
});

export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>;
};

const CONSUMPTION_LABEL: Record<string, string> = {
  "<0.5": "Under 0.5 GWh / yr",
  "0.5-1.5": "0.5 – 1.5 GWh / yr",
  "1.5-5": "1.5 – 5 GWh / yr",
  "5+": "5+ GWh / yr",
  unsure: "Not sure yet",
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    consumption: String(formData.get("consumption") ?? "").trim() || "unsure",
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContactSchema>;
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, message: "Please fix the highlighted fields.", errors };
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return { ok: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? "osama.alshuaili@outlook.com";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Enerlytics <noreply@enerlytics.om>";

  const subject = `New demo request — ${parsed.data.company}`;
  const lines = [
    `Name: ${parsed.data.name}`,
    `Company: ${parsed.data.company}`,
    `Email: ${parsed.data.email}`,
    `Consumption: ${CONSUMPTION_LABEL[parsed.data.consumption]}`,
    "",
    "Message:",
    parsed.data.message,
  ].join("\n");

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not set — cannot deliver contact emails");
    return {
      ok: false,
      message:
        "Demo request delivery is temporarily unavailable. Please email osama.alshuaili@outlook.com directly.",
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: parsed.data.email,
      subject,
      text: lines,
    });
    if (error) {
      console.error("[contact] resend error", error);
      return {
        ok: false,
        message:
          "Something went wrong sending your message. Please email osama.alshuaili@outlook.com directly.",
      };
    }
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return {
      ok: false,
      message:
        "Something went wrong sending your message. Please email osama.alshuaili@outlook.com directly.",
    };
  }

  return {
    ok: true,
    message: "Thanks — we'll be in touch within one business day.",
  };
}
