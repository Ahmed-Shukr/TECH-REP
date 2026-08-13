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
    primary: "border border-ink bg-ink text-paper hover:bg-accent hover:border-accent",
    secondary: "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
    ghost: "text-accent hover:text-accent-hover",
  }[variant];

  return (
    <Link
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors",
        styles,
        className,
      )}
    >
      {children}
    </Link>
  );
}
