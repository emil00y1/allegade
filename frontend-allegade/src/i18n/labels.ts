/**
 * Static UI microcopy that isn't tied to a single page (career listings,
 * room/event detail labels, form copy, shared component strings).
 *
 * Stored in the Sanity `uiLabels` singleton so it flows through the same
 * translation pipeline as the rest of the content. The Danish DEFAULTS below
 * are the source of truth and the fallback used when the singleton hasn't been
 * created/published yet, so the site never renders an empty label.
 *
 * Dependency-free so it can be shared by server code, the labels provider and
 * (via the client hook) client components.
 */

export interface UiLabels {
  // General
  priceOnRequest: string;
  free: string;
  currencySuffix: string;
  readMore: string;
  // Hotel / rooms
  roomsBreadcrumbHotel: string;
  roomsBreadcrumbAll: string;
  roomPricePerNight: string;
  roomBookStay: string;
  roomSeeAll: string;
  roomFacilities: string;
  roomBookYourStay: string;
  roomReadyToBook: string;
  // Events
  eventsBreadcrumb: string;
  eventMenuHeading: string;
  eventPracticalInfo: string;
  eventCapacityPrefix: string;
  eventCapacitySuffix: string;
  eventPriceHeading: string;
  eventBookSpot: string;
  eventAllEvents: string;
  // Careers
  careersTitle: string;
  careersEmpty: string;
  careersDeadlinePrefix: string;
  careersFullTime: string;
  careersPartTime: string;
  careersApplyNow: string;
  careersAllPositions: string;
  // Misc shared components
  venueInquire: string;
  venueNext: string;
  menuSeeDrinks: string;
  menuEmpty: string;
  mapTitle: string;
  mapRecenter: string;
}

export const UI_LABELS_DEFAULTS: UiLabels = {
  priceOnRequest: "Kontakt os for pris",
  free: "Gratis",
  currencySuffix: "kr.",
  readMore: "Læs mere",

  roomsBreadcrumbHotel: "Hotel",
  roomsBreadcrumbAll: "Alle værelser",
  roomPricePerNight: "Pris pr. nat",
  roomBookStay: "Book ophold",
  roomSeeAll: "Se alle værelser",
  roomFacilities: "Faciliteter",
  roomBookYourStay: "Book dit ophold",
  roomReadyToBook: "Klar til at booke",

  eventsBreadcrumb: "Begivenheder",
  eventMenuHeading: "Menu",
  eventPracticalInfo: "Praktisk info",
  eventCapacityPrefix: "Op til",
  eventCapacitySuffix: "gæster",
  eventPriceHeading: "Pris",
  eventBookSpot: "Book plads",
  eventAllEvents: "Alle begivenheder",

  careersTitle: "Karriere",
  careersEmpty: "Vi har ingen ledige stillinger lige nu. Kig forbi igen snart.",
  careersDeadlinePrefix: "Frist:",
  careersFullTime: "Fuldtid",
  careersPartTime: "Deltid",
  careersApplyNow: "Ansøg nu",
  careersAllPositions: "Alle stillinger",

  venueInquire: "Forespørg om lokalet",
  venueNext: "Næste lokale",
  menuSeeDrinks: "Se drikkekort",
  menuEmpty: "Indholdet er ikke klar endnu — tilføj et menukort i Sanity Studio.",
  mapTitle: "Kort over Allégade 10",
  mapRecenter: "Centrér kort",
};

// Fetch the whole singleton (incl. _id, which getTranslated needs).
export const UI_LABELS_QUERY = `*[_type == "uiLabels" && _id == "uiLabels"][0]`;
