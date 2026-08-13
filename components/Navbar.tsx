"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { site, navigation } from "@/lib/site";
import { plate } from "@/lib/format";
import { cx } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted uppercase"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent">AM</span>
          <span className="hidden sm:inline">Specification</span>
          <span className="hidden text-subtle sm:inline">Rev A</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navigation.map((item, index) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                  active ? "text-accent" : "text-muted hover:text-ink",
                )}
              >
                <span className="mr-1.5 text-subtle">{plate(index + 1)}</span>
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
            className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase hover:text-ink"
          >
            LinkedIn
          </a>
          <a
            href={site.resumePath}
            className="border border-ink px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-ink uppercase hover:bg-ink hover:text-paper"
          >
            CV
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center border border-rule text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-rule bg-paper lg:hidden">
          <div className="flex flex-col px-5 py-4">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-rule/70 py-3 font-mono text-xs tracking-[0.16em] uppercase"
              >
                {plate(index + 1)} {item.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-4 font-mono text-xs tracking-[0.14em] uppercase">
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
