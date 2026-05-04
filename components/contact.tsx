"use client";

import { motion } from "framer-motion";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { AuroraBackground } from "@/components/aurora-background";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

const initialState: ContactState = { ok: false };

const consumptionOptions: { value: string; label: string }[] = [
  { value: "<0.5", label: "Under 0.5 GWh / yr" },
  { value: "0.5-1.5", label: "0.5 – 1.5 GWh / yr" },
  { value: "1.5-5", label: "1.5 – 5 GWh / yr" },
  { value: "5+", label: "5+ GWh / yr" },
  { value: "unsure", label: "Not sure yet" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type="submit"
      disabled={pending}
      className={cn(
        "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue px-6 text-[15px] font-medium text-white transition-colors",
        "shadow-[0_8px_24px_-12px_rgba(37,99,235,0.65)] hover:bg-blue-soft",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
      )}
    >
      {pending ? "Sending…" : "Request a demo"}
      {!pending && (
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        />
      )}
    </motion.button>
  );
}

const inputBase =
  "h-12 w-full rounded-xl border border-navy/12 bg-white px-4 text-[14.5px] text-navy placeholder:text-navy/35 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:border-transparent transition";

export function Contact() {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-navy py-24 text-white sm:py-28"
    >
      <AuroraBackground className="opacity-60" />
      <div className="absolute inset-0 bg-dotgrid opacity-30" aria-hidden />

      <CursorSpotlight tone="blue" intensity={0.16} size={520} className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <Eyebrow tone="white">Book a demo</Eyebrow>
            <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-[48px]">
              The reform is live.
              <br />
              <span className="text-white/85">We are ready.</span>
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
              Tell us a little about your buildings. We&apos;ll come back with a
              short discovery call and a tailored CRT exposure read in 48
              hours.
            </p>

            <div className="mt-10 space-y-5 text-[14px] text-white/70">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Mail size={15} />
                </span>
                <a href="mailto:hello@enerlytics.om" className="hover:text-white">
                  hello@enerlytics.om
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <CheckCircle2 size={15} />
                </span>
                <span>Pilot deployment underway · OQ Accelerator</span>
              </div>
            </div>
          </Reveal>

          {state.ok && state.message ? (
            <Reveal y={20}>
              <motion.div
                role="status"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-10 backdrop-blur"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                    delay: 0.15,
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green/15 text-green-soft"
                >
                  <CheckCircle2 size={22} />
                </motion.span>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Got it — message received.
                </h3>
                <p className="text-[14.5px] leading-relaxed text-white/70">
                  {state.message}
                </p>
                <p className="text-[12.5px] text-white/50">
                  In the meantime, you can reach us at{" "}
                  <a
                    className="underline underline-offset-2 hover:text-white"
                    href="mailto:hello@enerlytics.om"
                  >
                    hello@enerlytics.om
                  </a>
                  .
                </p>
              </motion.div>
            </Reveal>
          ) : (
            <Reveal y={28} duration={0.85}>
              <form
                action={formAction}
                noValidate
                className="rounded-3xl border border-white/10 bg-white p-6 text-navy shadow-[var(--shadow-soft)] sm:p-8"
              >
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-0 w-0 opacity-0"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    name="name"
                    placeholder="Muath Al Hinai"
                    error={state.errors?.name}
                  />
                  <Field
                    label="Company"
                    name="company"
                    placeholder="OQ Alternative Energy"
                    error={state.errors?.company}
                  />
                  <Field
                    label="Work email"
                    name="email"
                    type="email"
                    placeholder="muath@company.om"
                    error={state.errors?.email}
                    className="sm:col-span-2"
                  />

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="consumption"
                      className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy/55"
                    >
                      Annual consumption
                    </label>
                    <select
                      id="consumption"
                      name="consumption"
                      defaultValue="unsure"
                      className={cn(inputBase, "mt-2 appearance-none pr-10")}
                    >
                      {consumptionOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {state.errors?.consumption && (
                      <p className="mt-2 text-[12px] text-amber">
                        {state.errors.consumption}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy/55"
                    >
                      What would you like to solve?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="One or two lines on the buildings, current bills, and what 'success' looks like for you."
                      className={cn(inputBase, "mt-2 h-auto py-3 leading-relaxed")}
                    />
                    {state.errors?.message && (
                      <p className="mt-2 text-[12px] text-amber">
                        {state.errors.message}
                      </p>
                    )}
                  </div>
                </div>

                {!state.ok && state.message && (
                  <p className="mt-4 rounded-xl bg-amber/10 px-4 py-2 text-[13px] text-amber">
                    {state.message}
                  </p>
                )}

                <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[12px] text-navy/55">
                    We respond within one business day.
                  </p>
                  <SubmitButton />
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </CursorSpotlight>
    </section>
  );
}

interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  error,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="text-[12px] font-semibold uppercase tracking-[0.16em] text-navy/55"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={
          name === "email"
            ? "email"
            : name === "name"
              ? "name"
              : name === "company"
                ? "organization"
                : "off"
        }
        className={cn(inputBase, "mt-2", error && "border-amber/60")}
      />
      {error && <p className="mt-2 text-[12px] text-amber">{error}</p>}
    </div>
  );
}
