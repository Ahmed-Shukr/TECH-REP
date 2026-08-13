import { cx } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx(align === "center" && "mx-auto max-w-2xl text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
