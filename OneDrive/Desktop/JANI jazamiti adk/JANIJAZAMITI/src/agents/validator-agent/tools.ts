// src/agent/tools.ts

/**
 * Validates if a region is a valid Kenya region
 */
export function isValidKenyaRegion(region: string): boolean {
  const regions = [
    'Nairobi',
    'Coast',
    'North Eastern',
    'Eastern',
    'Central',
    'Rift Valley',
    'Western',
    'Nyanza'
  ];
  return regions.includes(region);
}

/**
 * Validates if a tree type is valid
 */
export function isValidTreeType(type: string): boolean {
  const types = [
    'Acacia',
    'Mukuyu',
    'Mango',
    'Avocado',
    'Cypress',
    'Pine',
    'Eucalyptus',
    'Baobab',
    'Neem',
    'Cedar',
    'Teak',
    'Mahogany',
    'Jacaranda',
    'Coconut',
    'Mulberry',
    'Grevillea',
    'Indigenous',
    'Fruit Tree',
    'Forest Tree'
  ];
  return types.includes(type);
}

/**
 * Validates scientific name format (Genus species)
 */
export function isValidScientificName(name: string): boolean {
  return /^[A-Z][a-z]+ [a-z]+/.test(name);
}

/**
 * Validates image URL or base64 format
 */
export function isValidImage(imageString: string): boolean {
  // Check for base64
  if (imageString.startsWith('data:image')) {
    return /^data:image\/(jpeg|jpg|png|gif|webp);base64,/.test(imageString);
  }

  // Check for HTTP/HTTPS URL
  if (imageString.startsWith('http://') || imageString.startsWith('https://')) {
    try {
      new URL(imageString);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(imageString);
    } catch {
      return false;
    }
  }

  // Check for relative file paths
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(imageString);
}

/**
 * Validates GPS coordinates are within Kenya bounds
 */
export function isCoordinateInKenyaBounds(latitude: number, longitude: number): boolean {
  const kenyaBounds = {
    minLat: -4.67677,
    maxLat: 4.89973,
    minLon: 29.0,
    maxLon: 41.9
  };

  return (
    latitude >= kenyaBounds.minLat &&
    latitude <= kenyaBounds.maxLat &&
    longitude >= kenyaBounds.minLon &&
    longitude <= kenyaBounds.maxLon
  );
}

/**
 * Validates GPS coordinate ranges
 */
export function isValidGpsCoordinate(latitude: number, longitude: number): boolean {
  // Check range validity
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  if (longitude < -180 || longitude > 180) {
    return false;
  }

  // Check Kenya bounds
  return isCoordinateInKenyaBounds(latitude, longitude);
}

/**
 * Validates timestamp format
 */
export function isValidTimestamp(timestamp: string): boolean {
  const date = new Date(timestamp);
  return !isNaN(date.getTime());
}

/**
 * Get list of valid Kenya regions
 */
export function getValidKenyaRegions(): string[] {
  return [
    'Nairobi',
    'Coast',
    'North Eastern',
    'Eastern',
    'Central',
    'Rift Valley',
    'Western',
    'Nyanza'
  ];
}

/**
 * Get list of valid tree types
 */
export function getValidTreeTypes(): string[] {
  return [
    'Acacia',
    'Mukuyu',
    'Mango',
    'Avocado',
    'Cypress',
    'Pine',
    'Eucalyptus',
    'Baobab',
    'Neem',
    'Cedar',
    'Teak',
    'Mahogany',
    'Jacaranda',
    'Coconut',
    'Mulberry',
    'Grevillea',
    'Indigenous',
    'Fruit Tree',
    'Forest Tree'
  ];
}

/**
 * Format error message with record index
 */
export function formatRecordError(recordIndex: number, message: string): string {
  return `Record ${recordIndex}: ${message}`;
}

/**
 * Get Kenya bounds object
 */
export function getKenyaBounds() {
  return {
    minLat: -4.67677,
    maxLat: 4.89973,
    minLon: 29.0,
    maxLon: 41.9
  };
}