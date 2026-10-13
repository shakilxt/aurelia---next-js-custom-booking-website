import Link from "next/link";
import type { Route } from "next";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

type ButtonVariant = "primary" | "secondary" | "light" | "outline-light";
type ButtonSize = "md" | "lg";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretches to the container width below the `sm` breakpoint. */
  block?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-sm border text-[0.8125rem] font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors duration-200 ease-out-soft disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "border-forest-800 bg-forest-800 text-ivory hover:border-forest-900 hover:bg-forest-900",
  secondary:
    "border-charcoal/70 bg-transparent text-charcoal hover:border-forest-800 hover:bg-forest-800 hover:text-ivory",
  light: "border-ivory bg-ivory text-forest-900 hover:border-white hover:bg-white",
  "outline-light":
    "border-ivory/70 bg-transparent text-ivory hover:border-ivory hover:bg-ivory hover:text-forest-900",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-11 px-5",
  lg: "min-h-13 px-7",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  block = false,
}: ButtonStyleProps = {}) {
  return cx(base, variants[variant], sizes[size], block && "w-full sm:w-auto");
}

type ButtonProps = ButtonStyleProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, block }), className)}
      {...props}
    />
  );
}

interface ButtonLinkProps extends ButtonStyleProps {
  href: Route;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({ href, variant, size, block, className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={cx(buttonClasses({ variant, size, block }), className)}>
      {children}
    </Link>
  );
}
