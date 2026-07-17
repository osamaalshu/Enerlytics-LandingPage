import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-full transition-all duration-200 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 " +
  "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-teal text-white hover:bg-teal-soft hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white/10 text-white border border-white/15 backdrop-blur hover:bg-white/15",
  ghost:
    "text-navy hover:bg-navy/5",
  outline:
    "border border-navy/15 text-navy hover:border-navy/30 hover:bg-navy/[0.03]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a className={classes} href={href} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as ButtonProps;
  void _v; void _s; void _c; void _ch;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
