export const MIN_LAT = -55.0;
export const MAX_LAT = -21.0;
export const MIN_LONG = -73.6;
export const MAX_LONG = -53.6;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export type Location = Readonly<{
  latitude: number;
  longitude: number;
  distanceTo: (other: Location) => number;
}>;

const assertValidCoordinates = (latitude: number, longitude: number): void => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error('Invalid coordinates: latitude/longitude must be finite numbers.');
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error('Invalid latitude: must be between -90 and 90.');
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error('Invalid longitude: must be between -180 and 180.');
  }

  const isInsideArgentinaBoundingBox =
    latitude >= MIN_LAT && latitude <= MAX_LAT && longitude >= MIN_LONG && longitude <= MAX_LONG;

  if (!isInsideArgentinaBoundingBox) {
    throw new Error('Location must be within Argentina territory bounds.');
  }
};

const distanceInKm = (from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): number => {
  const earthRadiusKm = 6371;

  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLong = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

export const createLocation = (latitude: number, longitude: number): Location => {
  assertValidCoordinates(latitude, longitude);

  const location: Location = {
    latitude,
    longitude,
    distanceTo: (other: Location) => distanceInKm({ latitude, longitude }, other),
  };

  return Object.freeze(location);
};
