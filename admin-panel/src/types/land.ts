export interface LandParcel {
  id: string;
  deedNumber: string;
  surveyPlanNumber: string;
  ownerName: string;
  ownerAddress: string;
  landType: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  area: number; // in square meters
  coordinates: [number, number][]; // lat, lng pairs for polygon
  address: string;
  district: string;
  province: string;
  isVerified: boolean;
  verificationDate?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandSearchFilters {
  deedNumber?: string;
  surveyPlanNumber?: string;
  ownerName?: string;
  landType?: string;
  district?: string;
  isVerified?: boolean;
}

export interface AddLandRequest {
  deedNumber: string;
  surveyPlanNumber: string;
  ownerName: string;
  ownerAddress: string;
  landType: string;
  area: number;
  coordinates: [number, number][];
  address: string;
  district: string;
  province: string;
}