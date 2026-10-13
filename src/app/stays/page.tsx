import type { Route } from "next";
import { SearchX } from "lucide-react";
import { StayExplorer } from "@/components/stays/StayExplorer";
import { StayDatesNotice } from "@/components/stays/StayDatesNotice";
import { StaysIntro } from "@/components/stays/StaysIntro";
import { AccommodationGrid } from "@/components/stays/AccommodationGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { pageMetadata } from "@/lib/metadata";
import {
  applyStayQuery,
  defaultStayQuery,
  parseStayQuery,
  serializeStayQuery,
  stayLinkSearch,
  type StayQuery,
} from "@/lib/stay-query";
import { getAllStays } from "@/lib/stays";

export const metadata = pageMetadata({
  title: "Stays",
  description:
    "Pool villas, ocean suites and garden bungalows at AURELIA, a concept island resort. Demonstration prices in USD.",
  path: "/stays",
});

const staysHref = (query: StayQuery) => {
  const search = serializeStayQuery(query);
  return (search ? `/stays?${search}` : "/stays") as Route;
};

export default async function StaysPage({ searchParams }: PageProps<"/stays">) {
  const query = parseStayQuery(await searchParams);
  const allStays = getAllStays();
  const results = applyStayQuery(allStays, query);

  return (
    <>
      <StaysIntro />
      <Container className="pb-24 lg:pb-32">
        {query.checkIn && query.checkOut ? (
          <StayDatesNotice
            checkIn={query.checkIn}
            checkOut={query.checkOut}
            clearHref={staysHref({ ...query, checkIn: null, checkOut: null })}
          />
        ) : null}
        <StayExplorer
          query={query}
          resultCount={results.length}
          totalCount={allStays.length}
          maxCapacity={Math.max(...allStays.map((stay) => stay.capacity))}
        >
          {results.length > 0 ? (
            <AccommodationGrid
              stays={results}
              prioritizeFirst
              linkSearch={stayLinkSearch(query) || undefined}
            />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No residences match"
              description="Try fewer guests, a higher nightly rate or another residence type."
              action={
                <ButtonLink
                  href={staysHref({
                    ...defaultStayQuery,
                    checkIn: query.checkIn,
                    checkOut: query.checkOut,
                  })}
                  variant="secondary"
                >
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
