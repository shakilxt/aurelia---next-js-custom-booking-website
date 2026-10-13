/** Icons the UI knows how to render; mapped to lucide-react components in the amenity list. */
export type AmenityIconName =
  | "anchor"
  | "bath"
  | "bed-double"
  | "coffee"
  | "concierge-bell"
  | "fish"
  | "shower-head"
  | "snowflake"
  | "sofa"
  | "sun"
  | "sunset"
  | "trees"
  | "utensils"
  | "waves"
  | "wifi"
  | "wine";

export type AmenityCategory = "residence" | "outdoors" | "wellness" | "service";

export interface Amenity<Id extends string = string> {
  id: Id;
  name: string;
  iconName?: AmenityIconName;
  category: AmenityCategory;
}
