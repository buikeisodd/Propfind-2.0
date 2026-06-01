export interface Agent {
  id: string;
  name: string;
  photo: string;
  bio: string;
  agency: string;
  email: string;
  phone: string;
  isVerified: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  rating: number;
  reviewCount: number;
  areasServed: string[];
  specialties?: string[];
  performance: {
    propertiesSold: number;
    avgDaysOnMarket: number;
    responseRate: number; // percentage
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: 'buy' | 'rent' | 'lease';
  propertyType: 'house' | 'apartment' | 'condo' | 'land' | 'commercial' | 'office';
  address: string;
  city: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqFt: number;
  lotSize: string;
  yearBuilt: number;
  parkingSpaces: number;
  floors: number;
  amenities: string[];
  photos: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  agentId: string; // references Agent
  isFeatured: boolean;
  isPromoted?: boolean;
  promotionType?: 'featured' | 'spotlight' | 'premium';
  promotionExpiryDate?: string;
  status: 'active' | 'pending' | 'sold' | 'rented' | 'off-market' | 'expired';
  expiryDate?: string;
  autoRenewBeforeExpiry?: boolean;
  views: number;
  saves: number;
  inquiryCount: number;
  walkScore: number;
  transitScore: number;
  schoolRating: number; // out of 10
  lat: number; // for coordinate simulation mapping
  lng: number; // for coordinate simulation mapping
  createdDate: string;
  priceHistory: { date: string; price: number }[];
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPhoto: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone: string;
  message: string;
  status: 'new' | 'contacted' | 'viewing' | 'negotiating' | 'closed' | 'lost';
  preferredDate?: string;
  preferredTime?: string;
  createdDate: string;
  notes?: string[];
  chatHistory?: { sender: 'seeker' | 'agent'; message: string; timestamp: string }[];
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: {
    city?: string;
    listingType?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: string;
    bathrooms?: string;
    amenities?: string[];
  };
  createdDate: string;
}

export interface ReportedListing {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  createdDate: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'removed';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  photo: string;
  role: 'seeker' | 'owner' | 'agent' | 'admin';
  bio?: string; // New field for profile
  verificationStatus?: 'unverified' | 'pending' | 'verified'; // Track if user has requested verification
  savedProperties: string[]; // property IDs
  recentSearches: string[];
  notesOnProperties: Record<string, string>; // property ID -> personal note mapping
  priceDropAlerts: string[]; // property IDs
}
