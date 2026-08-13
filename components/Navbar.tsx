"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site, navigation } from "@/lib/site";
import { cx } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.14em] text-foreground uppercase"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "text-sm transition-colors",
                  active
                    ? "font-medium text-accent"
                    : "text-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={site.resumePath}
            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:border-accent/30 hover:bg-accent-soft"
          >
            CV
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-foreground hover:bg-background"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-4 border-t border-border px-2 pt-4 text-sm">
              <a href={site.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={site.resumePath}>CV</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
