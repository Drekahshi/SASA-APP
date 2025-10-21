// src/agent/types.ts

// src/agent/types.ts

export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface JazaMitiRecord {
  id: string;
  name: string;
  scientificName?: string;
  typePlanted?: string;
  region?: string;
  count?: number;
  gpsData?: GpsCoordinate;
  images?: string[];
  imageVerification?: {
    verified: boolean;
    timestamp?: string;
  };
  [key: string]: any;
}

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  message: string;
}