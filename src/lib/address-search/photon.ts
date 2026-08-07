export type AddressSuggestion = {
  readonly id: string;
  readonly label: string;
  readonly address: string;
  readonly suburb: string;
};

type PhotonProperties = {
  readonly osm_id?: number;
  readonly housenumber?: string;
  readonly street?: string;
  readonly name?: string;
  readonly city?: string;
  readonly district?: string;
  readonly locality?: string;
  readonly county?: string;
  readonly state?: string;
  readonly postcode?: string;
  readonly country?: string;
  readonly countrycode?: string;
};

type PhotonFeature = {
  readonly properties: PhotonProperties;
};

type PhotonResponse = {
  readonly features?: readonly PhotonFeature[];
};

const VICTORIA_BBOX = "140.9,-39.2,150.0,-33.8";

function formatStreetLine(properties: PhotonProperties): string {
  const street = properties.street ?? properties.name;
  if (properties.housenumber && street) {
    return `${properties.housenumber} ${street}`;
  }
  return street ?? properties.name ?? "";
}

function formatSuburb(properties: PhotonProperties): string {
  return (
    properties.city ??
    properties.district ??
    properties.locality ??
    properties.county ??
    ""
  );
}

export function mapPhotonFeature(feature: PhotonFeature): AddressSuggestion | null {
  const { properties } = feature;
  if (properties.countrycode && properties.countrycode !== "AU") {
    return null;
  }

  const streetLine = formatStreetLine(properties);
  const suburb = formatSuburb(properties);

  if (!streetLine && !suburb) {
    return null;
  }

  const addressParts = [
    streetLine,
    suburb,
    properties.state,
    properties.postcode,
  ].filter(Boolean);

  const label = addressParts.join(", ");
  const id = `${properties.osm_id ?? label}-${properties.postcode ?? ""}`;

  return {
    id,
    label,
    address: label,
    suburb,
  };
}

export async function searchAustralianAddresses(
  query: string,
): Promise<readonly AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return [];
  }

  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");
  url.searchParams.set("bbox", VICTORIA_BBOX);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as PhotonResponse;
  const seen = new Set<string>();
  const suggestions: AddressSuggestion[] = [];

  for (const feature of data.features ?? []) {
    const mapped = mapPhotonFeature(feature);
    if (!mapped || seen.has(mapped.label)) {
      continue;
    }
    seen.add(mapped.label);
    suggestions.push(mapped);
  }

  return suggestions;
}
