import { SearchX } from "lucide-react";
import { StayExplorer } from "@/components/stays/StayExplorer";
import { StaysIntro } from "@/components/stays/StaysIntro";
import { AccommodationGrid } from "@/components/stays/AccommodationGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { pageMetadata } from "@/lib/metadata";
import { applyStayQuery, parseStayQuery } from "@/lib/stay-query";
import { getAllStays } from "@/lib/stays";

export const metadata = pageMetadata({
  title: "Stays",
  description:
    "Pool villas, ocean suites and garden bungalows at AURELIA, a concept island resort. Demonstration prices in USD.",
  path: "/stays",
});

export default async function StaysPage({ searchParams }: PageProps<"/stays">) {
  const query = parseStayQuery(await searchParams);
  const allStays = getAllStays();
  const results = applyStayQuery(allStays, query);

  return (
    <>
      <StaysIntro />
      <Container className="pb-24 lg:pb-32">
        <StayExplorer
          query={query}
          resultCount={results.length}
          totalCount={allStays.length}
          maxCapacity={Math.max(...allStays.map((stay) => stay.capacity))}
        >
          {results.length > 0 ? (
            <AccommodationGrid stays={results} prioritizeFirst />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No residences match"
              description="Try fewer guests, a higher nightly rate or another residence type."
              action={
                <ButtonLink href="/stays" variant="secondary">
                  Reset filters
                </ButtonLink>
              }
            />
          )}
        </StayExplorer>
      </Container>
    </>
  );
}
