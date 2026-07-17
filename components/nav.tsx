"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const links = [
  { href: "#how", label: "How we do it" },
  { href: "#platform", label: "Platform" },
  { href: "#services", label: "Services" },
  { href: "#solutions", label: "Who it's for" },
  { href: "#engagement", label: "Working with us" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="container-narrow">
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full px-4 py-2 transition-all duration-300",
            scrolled
              ? "border border-white/10 bg-navy/85 backdrop-blur-xl shadow-[var(--shadow-soft)]"
              : "border border-white/0 bg-transparent",
          )}
        >
          <Link
            href="#top"
            aria-label="Enerlytics — home"
            className="flex items-center"
          >
            <Image
              src="/brand/logos/horizontal_white.png"
              alt="Enerlytics"
              width={520}
              height={120}
              priority
              className="h-9 w-auto"
            />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href="#contact" size="sm" variant="primary">
              Book a Demo
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
          </button>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-2xl border border-white/10 bg-navy/95 p-3 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] text-white/80 hover:bg-white/10"
                >
                  {l.label}
                </Link>
              ))}
              <Button
                href="#contact"
                size="md"
                variant="primary"
                className="mt-2 w-full"
                onClick={() => setOpen(false)}
              >
                Book a Demo
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
