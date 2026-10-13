# AURELIA — Project Specification

## 1. Project Overview

**Project name:** AURELIA  
**Product:** Luxury Tropical Resort & Retreats  
**Purpose:** Fiverr portfolio showcase  
**Project type:** Design-first, interactive frontend demonstration  
**Target audience:** Resort owners, hospitality businesses, boutique hotels, travel brands, and prospective Fiverr clients seeking custom website development.

### Project objective

Create a visually exceptional, responsive resort website that looks credible as a premium hospitality brand and demonstrates advanced frontend development skills.

The finished product must combine high-quality visual design with realistic booking-interface interactions. It should feel like a thoughtfully designed commercial website rather than a generic AI-generated template.

The project is a fictional portfolio concept, not a production reservation platform.

### Success priorities

1. Visual quality and brand consistency.
2. Excellent desktop and mobile experiences.
3. Realistic accommodation discovery and booking UI.
4. Reusable, maintainable component architecture.
5. Accessibility, performance and reliable interactions.
6. Strong presentation for Fiverr portfolio use.

## 2. Scope and Constraints

### Included

- Complete marketing homepage.
- Accommodation listing and filtering.
- Individual accommodation detail pages.
- Interactive booking search interface.
- Simulated booking flow with validation.
- Experiences and resort facilities.
- About, gallery and contact pages.
- Responsive mobile navigation.
- Reusable components and realistic mock data.
- Loading, empty, error and success UI states where appropriate.
- A polished footer and consistent navigation.
- Local development and production-build readiness.

### Explicitly excluded

- Real payment processing.
- Real reservations or room inventory.
- Production authentication or guest accounts.
- PostgreSQL, Supabase or Prisma integration.
- External booking APIs.
- Real email or SMS notifications.
- A production admin dashboard.
- Claims of actual customer bookings, occupancy or reviews.
- Unnecessary backend infrastructure.

Do not implement excluded features unless the project scope is explicitly changed.

## 3. Technology Stack

Use the following stack:

- Next.js with App Router.
- React.
- TypeScript in strict mode.
- Tailwind CSS using the conventions supported by the installed version.
- Lucide icons through lucide-react.
- Local typed TypeScript data for accommodations, amenities, experiences and testimonials.
- React state and URL search parameters where appropriate.
- A suitable date-picker implementation or custom accessible date controls.
- Motion for selected animations only, if it adds genuine value.

Use Server Components by default. Add Client Components only for interactions that require client-side state, event handlers, browser APIs or interactive controls.

Do not install unnecessary dependencies. First inspect the existing project, package manager, installed versions and configuration before recommending changes.

Do not assume a specific Tailwind CSS version or replace working configuration without a reason.

## 4. Brand and Visual Direction

### Brand personality

AURELIA should feel:

- Luxurious but approachable.
- Peaceful and nature-inspired.
- Sophisticated and editorial.
- Warm, authentic and premium.
- Contemporary rather than overly ornate.

### Color system

Create design tokens with these starting values:

- Deep forest green: #183D32
- Dark green: #102C25
- Warm ivory: #F8F6F0
- Sand: #E8DFD0
- Muted gold: #B49A68
- Charcoal: #252A27
- White: #FFFFFF
- Muted text: #747A73

Treat these as initial design tokens, not immutable values. Check text contrast and adjust when necessary.

Use forest green for primary actions and strong accents. Use ivory and white for spacious content surfaces. Use gold sparingly for small details.

### Typography

Use an elegant serif typeface for prominent headings and a highly readable sans-serif typeface for body text and controls.

Suggested pairing: Cormorant Garamond and DM Sans, provided they can be loaded reliably.

Use a deliberate typographic hierarchy, restrained font weights, comfortable line lengths and responsive heading sizes.

### Photography

Photography is a core part of the experience.

Prioritize:
- Tropical coastlines and infinity pools.
- Private villas with pools.
- Refined bedroom interiors.
- Natural stone, wood and linen.
- Palm trees, lush gardens and ocean views.
- Dining and curated resort experiences.

Use authentic, high-quality imagery with consistent color grading.

Prefer reliable, optimized image assets. Do not assume remote images will automatically work with Next.js image optimization. Configure remote image hosts only when necessary and explicitly permitted.

Avoid broken images, watermarks, inconsistent photography and generic illustrations in place of resort photography.

### Layout and interaction style

- Large, immersive hero sections.
- Spacious editorial content layouts.
- Strong image-to-text balance.
- Consistent container widths and spacing.
- Subtle borders and restrained shadows.
- Refined buttons and form controls.
- Smooth but restrained hover and entrance animations.
- No excessive gradients, glassmorphism or decorative effects.
- No excessive rounded cards that make the site look like a generic dashboard.

Avoid copying another resort website's exact design.

## 5. Information Architecture

Implement these routes:

### `/` — Homepage

Sections:
1. Responsive navigation.
2. Full-width photographic hero.
3. Brand introduction and short value proposition.
4. Interactive booking search panel.
5. Featured accommodations.
6. Resort highlights and amenities.
7. Experiences section.
8. Gallery or destination section.
9. Guest testimonial presentation using clearly identified fictional demo content.
10. Final booking call to action.
11. Premium footer.

The hero must establish the brand immediately. The primary CTA should lead to accommodation discovery or the booking interface.

### `/stays` — Accommodation listing

Include:
- Page introduction.
- Search and filter controls.
- Guest capacity and accommodation-type filters.
- Optional price-range filter.
- Sorting options.
- Responsive accommodation cards.
- Clear nightly pricing.
- Empty state when filters produce no matches.
- Reset filters action.
- Links to individual accommodation pages.

Filters must actually update the displayed mock data.

### `/stays/[slug]` — Accommodation detail

Each detail page should include:
- Image gallery.
- Accommodation name and category.
- Short description.
- Capacity, bed configuration and approximate area.
- Amenities.
- Price per night.
- Booking panel.
- Check-in and check-out selection.
- Guest count.
- Stay summary and estimated price.
- Availability disclaimer explaining that this is a demonstration.
- Related accommodations.

Use real slugs from the local dataset and handle unknown slugs with a proper not-found page.

### `/experiences` — Resort experiences

Show curated experiences such as:
- Private beach dining.
- Spa and wellness.
- Snorkeling and ocean adventures.
- Sunset cruises.
- Guided island excursions.

Each experience should have imagery, a concise description and an appropriate CTA.

Do not imply that experience reservations are connected to a real service.

### `/gallery` — Gallery

Create an image-led gallery with responsive layouts and accessible image descriptions.

An optional lightbox is acceptable if it is polished, keyboard-accessible and reliable.

### `/about` — About the resort

Include the resort story, hospitality philosophy, sustainable-design narrative and property highlights.

All brand claims should be fictional or clearly presented as concept copy.

### `/contact` — Contact

Include a refined contact page with:
- Contact information using clearly fictional demonstration details.
- Inquiry form with client-side validation.
- Clear success feedback after valid submission.
- Explicit notice that the demo form does not transmit a real inquiry.

Do not fabricate a real business address or use another company's contact details.

### `/book` — Booking demonstration

Implement a simulated booking route that can receive selected accommodation and date information.

Include:
- Selected stay summary.
- Date and guest details.
- Guest information form.
- Price breakdown.
- Validation errors.
- Confirmation state after valid demo submission.

Do not collect payment details or claim that a real reservation has been made.

## 6. Booking UI Requirements

The booking interface is a frontend simulation.

### Date selection

- Support check-in and check-out dates.
- Prevent past dates where appropriate.
- Require check-out to be later than check-in.
- Display dates clearly.
- Calculate the number of nights correctly.
- Support editing the selection.
- Provide appropriate validation feedback.

### Guest selection

- Support adults and children.
- Enforce a sensible minimum of one guest.
- Validate the selected guest count against the accommodation's configured capacity.
- Prevent invalid negative counts.

### Estimated pricing

Use a consistent pricing utility.

For a basic stay:
- Subtotal = nightly rate multiplied by number of nights.
- Any optional fees must be explicitly defined in the mock data or configuration.
- Display the total as an estimate.

Use integer minor currency units where practical to avoid floating-point currency calculation errors.

Choose one display currency, such as USD, and use it consistently. Label all prices as demonstration prices.

### Simulated confirmation

After valid form submission:
- Show a polished confirmation screen.
- Display the selected accommodation, dates, guest count and estimated total.
- Clearly identify the reference number as a demo identifier if one is generated.
- State that no actual reservation has been created.

Do not claim live availability, guaranteed room inventory or confirmed bookings.

## 7. Mock Data and Conceptual Data Model

Use local typed mock data. Do not create a real database in this phase.

Create appropriate TypeScript types for the following entities.

### Accommodation

- id: string
- slug: string
- name: string
- category: villa | suite | bungalow
- shortDescription: string
- description: string
- images: array of image metadata
- capacity: number
- bedrooms: number
- bathrooms: number
- areaSquareMeters: number
- nightlyRateMinor: number
- currency: string
- amenities: array of amenity identifiers
- featured: boolean
- displayOrder: number

### Amenity

- id: string
- name: string
- iconName: optional supported icon identifier
- category: string

### Experience

- id: string
- slug: string
- name: string
- description: string
- image: image metadata
- category: string
- durationLabel: optional display string
- displayOrder: number

### Testimonial

- id: string
- guestDisplayName: string
- quote: string
- stayLabel: optional display string
- isDemoContent: true

Every testimonial must be fictional demonstration content. Do not present fictional testimonials as verified customer reviews.

### BookingDraft

- accommodationSlug: string
- checkIn: date string
- checkOut: date string
- adults: number
- children: number
- estimatedTotalMinor: number

### GuestInquiry

- fullName: string
- email: string
- message: string

GuestInquiry is transient UI data only. Do not persist real personal information.

### Data organization

Separate mock data from UI components.

Recommended structure:
- `src/data/accommodations.ts`
- `src/data/experiences.ts`
- `src/data/testimonials.ts`
- `src/types/`
- `src/lib/`

Use a conceptual domain model that could later be mapped to PostgreSQL tables. Do not install Prisma, create Supabase resources or write database migrations for this frontend-only release.

## 8. Component Architecture

Prefer reusable components with clear responsibilities.

Suggested shared components:
- SiteHeader
- MobileNavigation
- SiteFooter
- Button
- Container
- SectionHeading
- BookingSearch
- DateRangeSelector
- GuestSelector
- AccommodationCard
- AccommodationGrid
- AccommodationGallery
- AmenityList
- ExperienceCard
- PriceSummary
- BookingForm
- ContactForm
- EmptyState
- LoadingState
- ErrorState

Create shared design primitives only when they improve consistency or remove genuine duplication.

Keep page-specific sections close to their routes when they are not reusable.

Do not turn every small element into a separate component. Avoid excessively abstract or deeply nested component structures.

## 9. Suggested Directory Structure

Adapt this structure to the existing repository instead of blindly replacing its files.

- `src/app/`
  - `page.tsx`
  - `layout.tsx`
  - `globals.css`
  - `stays/page.tsx`
  - `stays/[slug]/page.tsx`
  - `experiences/page.tsx`
  - `gallery/page.tsx`
  - `about/page.tsx`
  - `contact/page.tsx`
  - `book/page.tsx`
  - `not-found.tsx`
- `src/components/`
  - `layout/`
  - `home/`
  - `booking/`
  - `stays/`
  - `experiences/`
  - `gallery/`
  - `ui/`
- `src/data/`
- `src/types/`
- `src/lib/`
- `public/images/`
- `PROJECT_SPEC.md`
- `README.md`

Use the `@/` import alias if the existing configuration supports it.

## 10. Security and Privacy Boundaries

Although this project has no backend, it must follow sound frontend practices.

- Never add secret API keys to client-side code.
- Do not create fake authentication or pretend a user is authenticated.
- Do not collect payment card information.
- Do not persist personal inquiry or guest data.
- Do not send form data to external services.
- Validate all user inputs before displaying confirmation.
- Treat client-side availability and pricing as illustrative only.
- Use safe React rendering and avoid injecting untrusted HTML.
- Avoid storing sensitive information in local storage or URL parameters.
- Do not expose unnecessary internal errors.
- Do not use fabricated business credentials or claims.
- Add clear demonstration disclaimers to booking and inquiry flows.

A future production implementation would require server-side validation, secure session management, database authorization policies, transactional reservation logic, rate limiting and appropriate privacy practices. Those features are documentation for future work, not part of this implementation.

## 11. Accessibility Requirements

- Use semantic HTML.
- Maintain a logical heading hierarchy.
- Provide descriptive alternative text for meaningful images.
- Ensure keyboard access to navigation, forms, dialogs and interactive galleries.
- Add visible focus states.
- Associate form controls with labels.
- Provide understandable validation and status messages.
- Respect reduced-motion preferences.
- Ensure sufficient text and control contrast.
- Avoid communicating status through color alone.
- Use appropriate accessible names for icon-only controls.

## 12. Performance and SEO

- Use Next.js image optimization where appropriate.
- Reserve image dimensions to minimize layout shifts.
- Optimize hero imagery and loading priority.
- Lazy-load below-the-fold images where appropriate.
- Avoid unnecessary client-side JavaScript.
- Use server rendering for static content where beneficial.
- Add page titles and descriptions.
- Provide a canonical brand identity and consistent metadata.
- Use appropriate Open Graph metadata.
- Create a favicon and branded metadata image if assets are available.
- Ensure direct route navigation and refresh work.
- Avoid broken remote image dependencies.

Do not claim Lighthouse scores or performance metrics unless actually measured.

## 13. Quality Assurance

Test the following:

- All navigation links.
- All accommodation detail routes.
- Invalid slugs.
- Accommodation filters and sorting.
- Empty filter results.
- Date validation.
- Guest-capacity validation.
- Night-count and price calculations.
- Booking form validation and simulated confirmation.
- Contact form validation and demo-only success.
- Mobile navigation and responsive layouts.
- Keyboard navigation and focus visibility.
- Image loading and missing-image states.
- Production build and TypeScript checks.

Fix genuine errors rather than suppressing them with broad TypeScript casts, disabled lint rules or ignored build failures.

## 14. Definition of Done

The project is complete when:

- All specified pages are implemented.
- The visual identity is consistent.
- The homepage makes an excellent first impression.
- Accommodation pages use coherent and realistic content.
- All visible controls work or are clearly identified as decorative.
- Booking interactions produce correct estimates and validation feedback.
- The site is responsive at common desktop, tablet and mobile widths.
- Accessibility fundamentals are implemented.
- There are no known broken routes or major console errors.
- TypeScript and production-build checks pass.
- Demo-only limitations are clearly disclosed.
- The README explains installation, development, build commands and project scope.
- Screenshots and a deployment-ready version can be prepared.

## 15. Final Deliverable

Deliver a polished, deployable portfolio website that demonstrates advanced Next.js frontend development, premium visual design, interactive booking UX and maintainable component architecture.

The final result should be appropriate to present to prospective Fiverr clients as an example of custom website development.

Do not begin production booking infrastructure or add unrequested features. Preserve the design-first, frontend-only scope.
