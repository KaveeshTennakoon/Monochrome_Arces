export interface GovernmentEvent {
  id: string;
  title: string;
  description: string;
  eventType: 'survey' | 'title_registration' | 'court_hearing' | 'inspection' | 'other';
  startDate: string;
  endDate?: string;
  location: string;
  relatedLandIds: string[];
  isPublic: boolean;
  source: 'government' | 'internal';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddEventRequest {
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate?: string;
  location: string;
  relatedLandIds: string[];
  isPublic: boolean;
}
