import { ClosingCta } from "@/components/home/ClosingCta";
import { ExperiencesPreview } from "@/components/home/ExperiencesPreview";
import { FeaturedStays } from "@/components/home/FeaturedStays";
import { Hero } from "@/components/home/Hero";
import { HomeBookingSearch } from "@/components/home/HomeBookingSearch";
import { Introduction } from "@/components/home/Introduction";
import { IslandSection } from "@/components/home/IslandSection";
import { ResortHighlights } from "@/components/home/ResortHighlights";
import { Testimonials } from "@/components/home/Testimonials";
import { getAmenity } from "@/data/amenities";
import { homepageAmenities, resortHighlights } from "@/data/highlights";
import { media } from "@/data/media";
import { testimonials } from "@/data/testimonials";
import { getAllExperiences } from "@/lib/experiences";
import { getAllStays, getFeaturedStays } from "@/lib/stays";

export default function HomePage() {
  const stays = getAllStays();
  const experiences = getAllExperiences();
  const categories = new Set(stays.map((stay) => stay.category));

  return (
    <>
      <Hero image={media.heroInfinityPool} />
      <HomeBookingSearch maxGuests={Math.max(...stays.map((stay) => stay.capacity))} />
      <Introduction
        images={[media.waterGarden, media.palmShore]}
        facts={[
          { value: String(stays.length), label: "Private residences" },
          { value: String(categories.size), label: "Ways to stay" },
          { value: String(experiences.length), label: "Island experiences" },
        ]}
      />
      <FeaturedStays stays={getFeaturedStays()} />
      <ResortHighlights
        image={media.lagoonAerial}
        highlights={resortHighlights}
        amenities={homepageAmenities.map(getAmenity)}
      />
      <ExperiencesPreview experiences={experiences.slice(0, 3)} />
      <IslandSection
        images={[media.beachSunrise, media.jungleAerial, media.reefGarden, media.quietCove]}
      />
      <Testimonials testimonials={testimonials} />
      <ClosingCta image={media.cabanasDusk} />
    </>
  );
}
