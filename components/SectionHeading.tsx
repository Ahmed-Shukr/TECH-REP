import { plate } from "@/lib/format";
import { cx } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
}: {
  index?: number;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx(align === "center" && "mx-auto max-w-2xl text-center")}>
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-rule pb-3">
        <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
          {index !== undefined ? (
            <span className="mr-3">{plate(index)}</span>
          ) : null}
          {eyebrow}
        </p>
        <span className="hidden font-mono text-[10px] tracking-[0.18em] text-subtle uppercase sm:block">
          Plate
        </span>
      </div>
      <h2 className="font-display max-w-3xl text-4xl leading-[1.05] text-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
