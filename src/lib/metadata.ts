import type { Metadata, Route } from "next";

interface PageMetadataInput {
  title: string;
  description: string;
  path: Route;
}

/** Per-page metadata with a canonical URL; brand defaults come from the root layout. */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}
