/** Every testimonial is fictional demonstration copy and must be labelled as such. */
export interface Testimonial {
  id: string;
  guestDisplayName: string;
  quote: string;
  stayLabel?: string;
  isDemoContent: true;
}
