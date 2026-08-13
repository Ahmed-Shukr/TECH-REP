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
    <section className="border-b border-rule">
      <Container className="crop-frame py-16 sm:py-20">
        {eyebrow ? (
          <p className="mb-5 font-mono text-[10px] tracking-[0.24em] text-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display max-w-4xl text-4xl leading-[0.95] text-ink sm:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
