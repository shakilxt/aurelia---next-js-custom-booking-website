"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";

// Internal error details are deliberately not shown to visitors.
export default function RouteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="section-y">
      <ErrorState
        title="Something went adrift"
        description="This page couldn’t be displayed. Please try again, or return to the homepage."
        action={
          <>
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href="/" variant="secondary">
              Return home
            </ButtonLink>
          </>
        }
      />
    </Container>
  );
}
