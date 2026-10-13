import { StaysIntro } from "@/components/stays/StaysIntro";
import { Container } from "@/components/ui/Container";
import { LoadingState } from "@/components/ui/LoadingState";

export default function StaysLoading() {
  return (
    <>
      <StaysIntro />
      <Container className="pb-24">
        <LoadingState label="Loading residences" className="mt-36" />
      </Container>
    </>
  );
}
