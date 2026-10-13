import { CircleAlert } from "lucide-react";
import { PageIntro } from "@/components/layout/PageIntro";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { BookingResidence } from "@/components/booking/BookingResidence";
import { BookingSteps } from "@/components/booking/BookingSteps";
import { ResidencePicker } from "@/components/booking/ResidencePicker";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";
import { formatGuestCount } from "@/lib/booking";
import { parseBookingParams } from "@/lib/booking-params";
import { compareIsoDates, formatDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { readParam } from "@/lib/search-params";
import { getAllStays, getStayBySlug } from "@/lib/stays";

export const metadata = pageMetadata({
  title: "Plan your stay",
  description:
    "A simulated AURELIA booking flow with an estimated price breakdown. No reservation is created and no payment is taken.",
  path: "/book",
});

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const rawParams = await searchParams;
  const params = parseBookingParams(rawParams);
  const stay = params.stay ? getStayBySlug(params.stay) : undefined;

  if (stay) {
    const { slug, name, capacity, nightlyRateMinor, currency } = stay;
    return (
      <BookingFlow
        key={slug}
        stay={{ slug, name, capacity, nightlyRateMinor, currency }}
        initial={params}
        residence={<BookingResidence stay={stay} />}
      />
    );
  }

  const requestedUnknownStay = readParam(rawParams, "stay") !== undefined;
  const carriedOver = [
    params.checkIn && params.checkOut && compareIsoDates(params.checkIn, params.checkOut) < 0
      ? `${formatDate(params.checkIn, "short")} – ${formatDate(params.checkOut, "short")}`
      : null,
    params.adults !== undefined
      ? formatGuestCount({ adults: params.adults, children: params.children ?? 0 })
      : null,
  ].filter(Boolean);

  return (
    <>
      <PageIntro
        eyebrow="Booking demonstration"
        title="Plan your stay"
        description="Choose a residence to begin. You’ll then pick dates and guests and see an estimated total. This flow is a simulation: nothing is reserved and no payment is taken."
      >
        <BookingSteps current="residence" />
      </PageIntro>
      <Container className="pb-24">
        <section aria-labelledby="choose-residence">
          {requestedUnknownStay ? (
            <p
              role="status"
              className="mb-8 flex gap-2.5 border-l-4 border-gold bg-white p-4 text-sm text-charcoal"
            >
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-gold-ink"
                strokeWidth={1.75}
              />
              We couldn’t find that residence. Choose one of the residences below to continue.
            </p>
          ) : null}
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 id="choose-residence" className="text-h2 text-forest-900">
              Choose a residence
            </h2>
            {carriedOver.length > 0 ? (
              <p className="text-sm text-muted">
                Keeping your selection: {carriedOver.join(" · ")}
              </p>
            ) : null}
          </div>
          <div className="mt-8">
            <ResidencePicker stays={getAllStays()} selection={params} />
          </div>
          <DemoNotice className="mt-8">
            Rates are demonstration prices in USD. Availability is not checked or held.
          </DemoNotice>
        </section>
      </Container>
    </>
  );
}
