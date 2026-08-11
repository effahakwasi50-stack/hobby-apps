import { CategoryType, Venue } from '../types';

export const EXCLUDED_PLACE_KEYWORDS = [
  'school',
  'university',
  'college',
  'bank',
  'atm',
  'credit union',
  'corporate office',
  'business center',
  'office building',
  'hospital',
  'medical center',
  'clinic',
  'dental',
  'pharmacy',
  'real estate',
  'insurance',
  'government office',
  'court',
  'police',
];

export const EXCLUDED_GOOGLE_TYPES = [
  'school',
  'primary_school',
  'secondary_school',
  'university',
  'bank',
  'atm',
  'accounting',
  'finance',
  'hospital',
  'doctor',
  'dentist',
  'pharmacy',
  'physiotherapist',
  'health',
  'local_government_office',
  'courthouse',
  'post_office',
  'real_estate_agency',
  'insurance_agency',
];

/**
 * Checks if a venue name, category or description matches an excluded location type.
 * Enforces strict rule: Filter out schools, banks, business centers, corporate offices, hospitals.
 */
export function isExcludedVenue(venueName: string, types: string[] = [], textToSearch: string = ''): boolean {
  const normalizedName = venueName.toLowerCase();
  const normalizedText = textToSearch.toLowerCase();

  // Check keyword matches in name or description
  const hasExcludedKeyword = EXCLUDED_PLACE_KEYWORDS.some((kw) =>
    normalizedName.includes(kw) || normalizedText.includes(kw)
  );

  if (hasExcludedKeyword) return true;

  // Check Google Places API type tags if present
  const hasExcludedType = types.some((type) => EXCLUDED_GOOGLE_TYPES.includes(type.toLowerCase()));

  return hasExcludedType;
}

/**
 * Filters array of venues against strict exclusion rules.
 */
export function filterLeisureVenues(venues: Venue[]): Venue[] {
  return venues.filter(
    (v) => !isExcludedVenue(v.name, [v.category], `${v.categoryLabel} ${v.description} ${v.address}`)
  );
}

/**
 * Calculates straight line distance in miles between two lat/lng points.
 */
export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
