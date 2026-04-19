// Approximate lat/lng centroids for visited countries.
// Used by the map variants to project markers onto a real world map.
// Order matches src/data/beyondWork.ts visitedCountries.

export type CountryCoord = {
  code: string;
  name: string;
  lat: number;
  lng: number;
  fav?: boolean;
};

export const countryCoords: CountryCoord[] = [
  { code: "US", name: "United States", lat: 39.8, lng: -98.5 },
  { code: "CA", name: "Canada", lat: 56.1, lng: -106.3 },
  { code: "MX", name: "Mexico", lat: 23.6, lng: -102.5 },
  { code: "CO", name: "Colombia", lat: 4.6, lng: -74.1, fav: true },
  { code: "BR", name: "Brazil", lat: -14.2, lng: -51.9 },
  { code: "GB", name: "United Kingdom", lat: 54.0, lng: -2.0 },
  { code: "FR", name: "France", lat: 46.2, lng: 2.2 },
  { code: "ES", name: "Spain", lat: 40.0, lng: -3.7 },
  { code: "IT", name: "Italy", lat: 41.9, lng: 12.5 },
  { code: "NL", name: "Netherlands", lat: 52.1, lng: 5.3 },
  { code: "DE", name: "Germany", lat: 51.1, lng: 10.4 },
  { code: "BD", name: "Bangladesh", lat: 23.7, lng: 90.4 },
  { code: "IN", name: "India", lat: 20.6, lng: 78.9 },
  { code: "JP", name: "Japan", lat: 36.2, lng: 138.3 },
  { code: "TH", name: "Thailand", lat: 15.9, lng: 101.0 },
  { code: "AE", name: "UAE", lat: 23.4, lng: 53.8 },
];
