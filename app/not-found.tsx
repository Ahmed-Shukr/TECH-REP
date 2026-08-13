import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="crop-frame py-24">
      <p className="font-mono text-[10px] tracking-[0.22em] text-accent uppercase">
        Sheet 404
      </p>
      <h1 className="font-display mt-4 text-5xl">This plate is missing.</h1>
      <p className="mt-4 text-muted">That route is not in the specification.</p>
      <div className="mt-8">
        <Button href="/">Return to sheet 00</Button>
      </div>
    </Container>
  );
}
