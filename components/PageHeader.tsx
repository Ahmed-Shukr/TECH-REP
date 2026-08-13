import { Container } from "@/components/Container";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <Container className="py-14 sm:py-16">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
