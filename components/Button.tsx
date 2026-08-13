import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  download?: boolean;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  download,
  external,
  className,
}: ButtonProps) {
  const styles = {
    primary:
      "bg-accent text-white hover:bg-accent-hover shadow-sm",
    secondary:
      "border border-border bg-surface text-foreground hover:border-accent/30 hover:bg-accent-soft",
    ghost: "text-accent hover:text-accent-hover",
  }[variant];

  return (
    <Link
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
        styles,
        className,
      )}
    >
      {children}
    </Link>
  );
}
