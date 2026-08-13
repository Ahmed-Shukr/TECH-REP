import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        That route is not part of this portfolio.
      </p>
      <div className="mt-8">
        <Button href="/">Back to homepage</Button>
      </div>
    </Container>
  );
}
