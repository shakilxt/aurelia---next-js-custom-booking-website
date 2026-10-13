import type { AmenityIconName } from "./amenity";

/** A resort-wide feature presented on the homepage. */
export interface ResortHighlight {
  id: string;
  title: string;
  description: string;
  iconName: AmenityIconName;
}
