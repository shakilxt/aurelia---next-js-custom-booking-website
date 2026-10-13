import type { StaticImageData } from "next/image";
import type { MediaAsset } from "@/types/media";

import heroInfinityPoolSrc from "@/assets/images/resort/hero-infinity-pool.jpg";
import waterGardenSrc from "@/assets/images/resort/water-garden.jpg";
import overwaterAerialSrc from "@/assets/images/resort/overwater-aerial.jpg";
import lagoonAerialSrc from "@/assets/images/resort/lagoon-aerial.jpg";
import cabanasDuskSrc from "@/assets/images/resort/cabanas-dusk.jpg";
import palmPoolReflectionSrc from "@/assets/images/resort/palm-pool-reflection.jpg";
import beachSunriseSrc from "@/assets/images/coast/beach-sunrise.jpg";
import palmShoreSrc from "@/assets/images/coast/palm-shore.jpg";
import reefCoastAerialSrc from "@/assets/images/coast/reef-coast-aerial.jpg";
import shoreSunsetSrc from "@/assets/images/coast/shore-sunset.jpg";
import quietCoveSrc from "@/assets/images/coast/quiet-cove.jpg";
import beachPalmsSrc from "@/assets/images/coast/beach-palms.jpg";
import lagoonVillaDeckSrc from "@/assets/images/stays/lagoon-villa-deck.jpg";
import lagoonVillaBedroomSrc from "@/assets/images/stays/lagoon-villa-bedroom.jpg";
import lagoonVillaBathSrc from "@/assets/images/stays/lagoon-villa-bath.jpg";
import groveVillaPoolSrc from "@/assets/images/stays/grove-villa-pool.jpg";
import groveVillaBedroomSrc from "@/assets/images/stays/grove-villa-bedroom.jpg";
import groveVillaVerandaSrc from "@/assets/images/stays/grove-villa-veranda.jpg";
import residencePoolSrc from "@/assets/images/stays/residence-pool.jpg";
import residencePavilionSrc from "@/assets/images/stays/residence-pavilion.jpg";
import overwaterSuiteExteriorSrc from "@/assets/images/stays/overwater-suite-exterior.jpg";
import overwaterSuiteInteriorSrc from "@/assets/images/stays/overwater-suite-interior.jpg";
import overwaterSuiteJettySrc from "@/assets/images/stays/overwater-suite-jetty.jpg";
import reefSuiteAerialSrc from "@/assets/images/stays/reef-suite-aerial.jpg";
import reefSuiteClusterSrc from "@/assets/images/stays/reef-suite-cluster.jpg";
import reefSuitePoolSrc from "@/assets/images/stays/reef-suite-pool.jpg";
import horizonSuiteTerraceSrc from "@/assets/images/stays/horizon-suite-terrace.jpg";
import horizonSuiteBedroomSrc from "@/assets/images/stays/horizon-suite-bedroom.jpg";
import gardenBungalowPathSrc from "@/assets/images/stays/garden-bungalow-path.jpg";
import gardenBungalowPoolSrc from "@/assets/images/stays/garden-bungalow-pool.jpg";
import gardenBungalowThatchSrc from "@/assets/images/stays/garden-bungalow-thatch.jpg";
import beachBungalowPergolaSrc from "@/assets/images/stays/beach-bungalow-pergola.jpg";
import beachBungalowPoolSrc from "@/assets/images/stays/beach-bungalow-pool.jpg";
import privateDiningSrc from "@/assets/images/experiences/private-dining.jpg";
import floatingBreakfastSrc from "@/assets/images/experiences/floating-breakfast.jpg";
import chefPlateSrc from "@/assets/images/experiences/chef-plate.jpg";
import spaHotStoneSrc from "@/assets/images/experiences/spa-hot-stone.jpg";
import spaMassageSrc from "@/assets/images/experiences/spa-massage.jpg";
import snorkelTurtleSrc from "@/assets/images/experiences/snorkel-turtle.jpg";
import reefGardenSrc from "@/assets/images/experiences/reef-garden.jpg";
import sailingSrc from "@/assets/images/experiences/sailing.jpg";
import islandCanoeSrc from "@/assets/images/experiences/island-canoe.jpg";
import jungleAerialSrc from "@/assets/images/experiences/jungle-aerial.jpg";

function asset(id: string, src: StaticImageData, alt: string): MediaAsset {
  return { id, src, alt };
}

/**
 * Every photograph used on the site. Data files reference these entries directly,
 * so a missing file fails the build instead of rendering a broken image.
 */
export const media = {
  // resort
  heroInfinityPool: asset(
    "hero-infinity-pool",
    heroInfinityPoolSrc,
    "An infinity pool curving between palm trees and white umbrellas above a deep blue ocean",
  ),
  waterGarden: asset(
    "water-garden",
    waterGardenSrc,
    "A long reflecting pool lined with palms and terracotta urns leading toward the sea",
  ),
  overwaterAerial: asset(
    "overwater-aerial",
    overwaterAerialSrc,
    "Aerial view of overwater villas linked by a winding boardwalk across a turquoise lagoon",
  ),
  lagoonAerial: asset(
    "lagoon-aerial",
    lagoonAerialSrc,
    "Aerial view of thatched overwater villas branching along jetties over a pale blue lagoon",
  ),
  cabanasDusk: asset(
    "cabanas-dusk",
    cabanasDuskSrc,
    "Draped poolside cabanas beside an infinity pool at dusk, with palms against a violet sky",
  ),
  palmPoolReflection: asset(
    "palm-pool-reflection",
    palmPoolReflectionSrc,
    "Tall palms and shaded cabanas reflected in a still pool on a bright morning",
  ),

  // coast
  beachSunrise: asset(
    "beach-sunrise",
    beachSunriseSrc,
    "Gentle waves washing over pale sand as the sun rises above a calm sea",
  ),
  palmShore: asset(
    "palm-shore",
    palmShoreSrc,
    "Coconut palms and tropical shrubs framing a turquoise sea",
  ),
  reefCoastAerial: asset(
    "reef-coast-aerial",
    reefCoastAerialSrc,
    "Aerial view of a forested shoreline meeting shallow turquoise water and a reef",
  ),
  shoreSunset: asset(
    "shore-sunset",
    shoreSunsetSrc,
    "A curving beach at sunset under pink and orange clouds",
  ),
  quietCove: asset(
    "quiet-cove",
    quietCoveSrc,
    "A shaded beach in a quiet cove, with a forested island across clear water",
  ),
  beachPalms: asset(
    "beach-palms",
    beachPalmsSrc,
    "A white sand spit lined with palms and thatched umbrellas beside clear shallow water",
  ),

  // stays
  lagoonVillaDeck: asset(
    "lagoon-villa-deck",
    lagoonVillaDeckSrc,
    "A timber deck with loungers beside an infinity pool that meets the lagoon under shade trees",
  ),
  lagoonVillaBedroom: asset(
    "lagoon-villa-bedroom",
    lagoonVillaBedroomSrc,
    "A bright bedroom with a white bed, dark timber bench and tall glass doors opening to greenery",
  ),
  lagoonVillaBath: asset(
    "lagoon-villa-bath",
    lagoonVillaBathSrc,
    "A freestanding stone bathtub beside a potted palm against a textured plaster wall",
  ),
  groveVillaPool: asset(
    "grove-villa-pool",
    groveVillaPoolSrc,
    "A private pool and lawn in front of a white garden pavilion surrounded by palms",
  ),
  groveVillaBedroom: asset(
    "grove-villa-bedroom",
    groveVillaBedroomSrc,
    "A warm timber bedroom with low lighting and glass doors opening onto a garden",
  ),
  groveVillaVeranda: asset(
    "grove-villa-veranda",
    groveVillaVerandaSrc,
    "A covered timber veranda with chairs overlooking forested hills in golden light",
  ),
  residencePool: asset(
    "residence-pool",
    residencePoolSrc,
    "A large pool edged with palms and loungers, glowing under a pink evening sky",
  ),
  residencePavilion: asset(
    "residence-pavilion",
    residencePavilionSrc,
    "An open-sided pavilion lounge with timber furniture beside palms under a moonlit sky",
  ),
  overwaterSuiteExterior: asset(
    "overwater-suite-exterior",
    overwaterSuiteExteriorSrc,
    "Thatched overwater suites and a boardwalk over clear water as the sun rises",
  ),
  overwaterSuiteInterior: asset(
    "overwater-suite-interior",
    overwaterSuiteInteriorSrc,
    "A rounded overwater lounge with floor-to-ceiling windows framing a private deck and the lagoon",
  ),
  overwaterSuiteJetty: asset(
    "overwater-suite-jetty",
    overwaterSuiteJettySrc,
    "A long timber jetty leading between rows of thatched overwater suites",
  ),
  reefSuiteAerial: asset(
    "reef-suite-aerial",
    reefSuiteAerialSrc,
    "Aerial view of a cluster of overwater suites at the edge of a white sandbank and reef",
  ),
  reefSuiteCluster: asset(
    "reef-suite-cluster",
    reefSuiteClusterSrc,
    "Thatched overwater suites connected by walkways above a bright turquoise reef",
  ),
  reefSuitePool: asset(
    "reef-suite-pool",
    reefSuitePoolSrc,
    "A guest in a sun hat resting in an infinity pool overlooking the beach and an overwater jetty",
  ),
  horizonSuiteTerrace: asset(
    "horizon-suite-terrace",
    horizonSuiteTerraceSrc,
    "A paved terrace with loungers at the water's edge beneath a pink sunset sky",
  ),
  horizonSuiteBedroom: asset(
    "horizon-suite-bedroom",
    horizonSuiteBedroomSrc,
    "A suite bedroom with a made-up king bed, bedside lamps and a woven runner",
  ),
  gardenBungalowPath: asset(
    "garden-bungalow-path",
    gardenBungalowPathSrc,
    "A gravel path and timber railing winding through dense greenery toward a bungalow",
  ),
  gardenBungalowPool: asset(
    "garden-bungalow-pool",
    gardenBungalowPoolSrc,
    "Thatched bungalows set around a turquoise pool, with green mountains beyond",
  ),
  gardenBungalowThatch: asset(
    "garden-bungalow-thatch",
    gardenBungalowThatchSrc,
    "Thatched-roof bungalows and a curving pool among palms and loungers",
  ),
  beachBungalowPergola: asset(
    "beach-bungalow-pergola",
    beachBungalowPergolaSrc,
    "A timber pergola framing palms and a white beach with turquoise water beyond",
  ),
  beachBungalowPool: asset(
    "beach-bungalow-pool",
    beachBungalowPoolSrc,
    "A timber beach house with a steep roof beside a pool lined with cushioned loungers",
  ),

  // experiences
  privateDining: asset(
    "private-dining",
    privateDiningSrc,
    "A long candlelit table set with glassware and bright tropical flowers",
  ),
  floatingBreakfast: asset(
    "floating-breakfast",
    floatingBreakfastSrc,
    "A floating breakfast tray of fruit and juice on a pool overlooking the ocean",
  ),
  chefPlate: asset(
    "chef-plate",
    chefPlateSrc,
    "A plated fish course served at a candlelit dinner table",
  ),
  spaHotStone: asset(
    "spa-hot-stone",
    spaHotStoneSrc,
    "A hot stone massage with dark basalt stones and white orchids along a guest's back",
  ),
  spaMassage: asset(
    "spa-massage",
    spaMassageSrc,
    "A therapist pouring warm oil during a relaxing massage",
  ),
  snorkelTurtle: asset(
    "snorkel-turtle",
    snorkelTurtleSrc,
    "A sea turtle gliding through deep blue water beneath the surface",
  ),
  reefGarden: asset(
    "reef-garden",
    reefGardenSrc,
    "Shafts of sunlight over a coral reef busy with small orange fish",
  ),
  sailing: asset("sailing", sailingSrc, "A sailing yacht with full white sails on open blue water"),
  islandCanoe: asset(
    "island-canoe",
    islandCanoeSrc,
    "A small outrigger canoe on a green river lined with leaning palms",
  ),
  jungleAerial: asset(
    "jungle-aerial",
    jungleAerialSrc,
    "Aerial view of terraced fields and dense forest catching early light",
  ),
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;
