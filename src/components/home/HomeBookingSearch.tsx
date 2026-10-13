import { BookingSearch } from "@/components/booking/BookingSearch";
import { Container } from "@/components/ui/Container";
import { DemoNotice } from "@/components/ui/DemoNotice";

/**
 * Search panel that overlaps the hero's lower edge on large screens. The hero fills the
 * viewport, so the overlap decides what shows above the fold: 5rem reveals the title row
 * and ends in the gap before the fields, never a sliver of their top edge.
 */
export function HomeBookingSearch({ maxGuests }: { maxGuests: number }) {
  return (
    <Container className="relative z-10 pt-10 lg:-mt-20 lg:pt-0">
      <section
        aria-labelledby="booking-search-title"
        className="border border-line bg-ivory p-5 sm:p-8 lg:shadow-soft"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 id="booking-search-title" className="text-h3 text-forest-900">
            Find your residence
          </h2>
          <DemoNotice>Demonstration rates. Availability isn’t checked.</DemoNotice>
        </div>
        <BookingSearch maxGuests={maxGuests} />
      </section>
    </Container>
  );
}
