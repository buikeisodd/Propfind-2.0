import { Agent, Property, Inquiry, SavedSearch, ReportedListing, UserProfile } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'owner-george',
    name: 'George Clooney',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    bio: 'George is a verified private landlord and homeowner. He manages his boutique properties and city residences directly on PropFind.',
    agency: 'Private Owner / Homeowner',
    email: 'george.clooney@hollywood.com',
    phone: '+1 (555) 501-4432',
    isVerified: true,
    rating: 4.8,
    reviewCount: 24,
    areasServed: ['Downtown Core', 'Marina Heights'],
    specialties: ['Luxury Condos', 'Waterfront Properties', 'Investment Portfolios'],
    performance: {
      propertiesSold: 8,
      avgDaysOnMarket: 22,
      responseRate: 94
    }
  },
  {
    id: 'agent-1',
    name: 'Sarah Jenkins',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Sarah is a licensed elite broker specializing in luxury waterfront estates and modern urban penthouses with over 12 years of experience.',
    agency: 'Aura Premium Realty',
    email: 'sarah.jenkins@propfind.com',
    phone: '+1 (555) 302-8941',
    isVerified: true,
    rating: 4.9,
    reviewCount: 142,
    areasServed: ['Marina Heights', 'Downtown Core', 'Bayview Ridge'],
    specialties: ['First-Time Buyers', 'Relocations', 'High-Rise Apartments'],
    performance: {
      propertiesSold: 184,
      avgDaysOnMarket: 18,
      responseRate: 98
    }
  },
  {
    id: 'agent-2',
    name: 'David Vance',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    bio: 'Specializing in suburban family villas, new residential construction, and residential land acquisition across northern pine forestry districts.',
    agency: 'Vanguard Realty Group',
    email: 'david.vance@propfind.com',
    phone: '+1 (555) 723-1109',
    isVerified: true,
    rating: 4.8,
    reviewCount: 96,
    areasServed: ['Pine Crest', 'Canyon View', 'Oakridge Estates'],
    specialties: ['Suburban Homes', 'Family Estates', 'Eco-Friendly Properties'],
    performance: {
      propertiesSold: 112,
      avgDaysOnMarket: 24,
      responseRate: 95
    }
  },
  {
    id: 'agent-3',
    name: 'Marcus Sterling',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    bio: 'Marcus has established a repute for commercial leasing, multi-use workspace sales, and real estate investment portfolio development.',
    agency: 'Sterling Institutional Properties',
    email: 'm.sterling@sterlingcommercial.com',
    phone: '+1 (555) 489-2287',
    isVerified: true,
    rating: 4.7,
    reviewCount: 68,
    areasServed: ['Downtown Core', 'Industrial East', 'Commercial District'],
    specialties: ['Commercial Leasing', 'Office Spaces', 'Retail Lots'],
    performance: {
      propertiesSold: 75,
      avgDaysOnMarket: 31,
      responseRate: 91
    }
  },
  {
    id: 'agent-4',
    name: 'Elena Rostova',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    bio: 'Elena represents private landlords, real estate investors, and high-net-worth sellers across premier beachsides and metropolitan areas.',
    agency: 'Horizon Elite Properties',
    email: 'elena.rostova@propfind.com',
    phone: '+1 (555) 831-2902',
    isVerified: false,
    rating: 4.6,
    reviewCount: 29,
    areasServed: ['Bayview Ridge', 'Marina Heights', 'Sunset Bay'],
    specialties: ['Vacation Homes', 'Short-term Rentals', 'Coastal Estates'],
    performance: {
      propertiesSold: 38,
      avgDaysOnMarket: 28,
      responseRate: 88
    }
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Peninsula Sovereign Estate',
    description: 'This masterfully designed architectural wonder showcases 270-degree views of the crescent harbor and skyline. Crafted with absolute premium finishes, double-height limestone galleries, a saltwater infinity lagoon pool, state-of-the-art climate-controlled wine cellars, a private boat slip, and sprawling garden terraces. Master bathrooms are sculpted in Calacatta marble, complemented by professional-grade wolf kitchens and fully integrated home automation automation systems.',
    price: 4850000,
    listingType: 'buy',
    propertyType: 'house',
    address: '412 Ocean Winds Boulevard',
    city: 'Marina Heights',
    zipCode: '90211',
    bedrooms: 5,
    bathrooms: 6,
    sizeSqFt: 7200,
    lotSize: '0.85 Acres',
    yearBuilt: 2021,
    parkingSpaces: 4,
    floors: 3,
    amenities: ['Infinity Pool', 'Private Boat Slip', 'Smart Automation', 'Wine Cellar', 'Elevator', 'Calacatta Marbles', 'Private Gym', '24/7 Gated Security'],
    photos: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=800'
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
    floorPlanUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    agentId: 'agent-1',
    isFeatured: true,
    status: 'active',
    views: 1240,
    saves: 345,
    inquiryCount: 42,
    walkScore: 88,
    transitScore: 92,
    schoolRating: 9,
    lat: 30, // Downtown/Marina Heights coordinates
    lng: 40,
    createdDate: '2025-11-12',
    priceHistory: [
      { date: '2025-05-10', price: 4950000 },
      { date: '2025-09-01', price: 4900000 },
      { date: '2025-11-12', price: 4850000 }
    ]
  },
  {
    id: 'prop-2',
    title: 'Zenith Heights Glass Penthouse',
    description: 'Perched on the 48th floor of the prestigious Zenith Residence, this glass penthouse features soaring 14-foot floor-to-ceiling windows capturing stunning urban vistas. Features custom walnut cabinetry, motorized solar shades, integrated multi-room sound systems, and a wrap-around sky terraza with a private plunge tub. Complete with white-glove concierge amenities, sky club access, a wellness sanctuary, and helipad accessibility.',
    price: 8500,
    listingType: 'rent',
    propertyType: 'apartment',
    address: '900 Metropolitan Ave, Unit 4801',
    city: 'Downtown Core',
    zipCode: '10001',
    bedrooms: 3,
    bathrooms: 3.5,
    sizeSqFt: 3100,
    lotSize: 'N/A',
    yearBuilt: 2023,
    parkingSpaces: 2,
    floors: 1,
    amenities: ['Sky Terrazza', 'Plunge Tub', 'Concierge Service', 'Floor-to-Ceiling Windows', 'Clubroom Access', 'Steam Shower', 'Walk-in Closets'],
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    ],
    virtualTourUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
    floorPlanUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    agentId: 'owner-george',
    isFeatured: true,
    status: 'active',
    views: 890,
    saves: 212,
    inquiryCount: 28,
    walkScore: 98,
    transitScore: 100,
    schoolRating: 8,
    lat: 150, // Downtown
    lng: 150,
    createdDate: '2025-11-20',
    priceHistory: [
      { date: '2025-06-01', price: 9000 },
      { date: '2025-11-20', price: 8500 }
    ]
  },
  {
    id: 'prop-3',
    title: 'Oakwood Mountain Crest Villa',
    description: 'Nestled beautifully within mature pine woodlands, this organic-modern timber villa offers privacy, serenity, and striking snowcap horizons. Boasts radiant concrete floor heaters, three real river-stone hearth fire pits, an exterior thermal pool, and stunning natural timber architecture throughout. Ideal for year-round mountain recreation and cozy seasonal retreats.',
    price: 1150000,
    listingType: 'buy',
    propertyType: 'house',
    address: '1683 Woodcutter Ridge Trail',
    city: 'Pine Crest',
    zipCode: '84060',
    bedrooms: 4,
    bathrooms: 4,
    sizeSqFt: 3800,
    lotSize: '1.4 Acres',
    yearBuilt: 2018,
    parkingSpaces: 3,
    floors: 2,
    amenities: ['Timber Architecture', 'Thermal Outdoor Pool', 'River-stone Fireplaces', 'Radiant Heating', 'Triple Garage', 'Ski-in/Ski-out Access', 'Jacuzzi Sauna'],
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800'
    ],
    agentId: 'agent-2',
    isFeatured: false,
    status: 'active',
    views: 450,
    saves: 98,
    inquiryCount: 12,
    walkScore: 32,
    transitScore: 15,
    schoolRating: 8,
    lat: 280, // Pine Crest
    lng: 350,
    createdDate: '2025-12-01',
    priceHistory: [
      { date: '2025-12-01', price: 1150000 }
    ]
  },
  {
    id: 'prop-4',
    title: 'Vanguard Corporate Center',
    description: 'A premium, grade-A corporate workspace structure located right in the premium financial submarket. This corporate facility delivers hyper-fast dedicated fiber, access controlled security, fully custom layouts, triple-zone energy HVAC, executive boardrooms, on-site catering kitchen and subterranean reserved spaces.',
    price: 12500,
    listingType: 'lease',
    propertyType: 'commercial',
    address: '22 Financial Plaza Way, Floors 4-5',
    city: 'Downtown Core',
    zipCode: '10006',
    bedrooms: 0,
    bathrooms: 8,
    sizeSqFt: 11400,
    lotSize: 'N/A',
    yearBuilt: 2015,
    parkingSpaces: 12,
    floors: 2,
    amenities: ['Dedicated Fiber', 'Grade-A Architecture', 'Access Control', 'HVAC Triple-Zone', 'Subterranean Parking', 'Executive Boardrooms', 'Catering Kitchen'],
    photos: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ],
    agentId: 'agent-3',
    isFeatured: true,
    isPromoted: true,
    promotionType: 'premium',
    status: 'active',
    views: 610,
    saves: 74,
    inquiryCount: 15,
    walkScore: 95,
    transitScore: 98,
    schoolRating: 5,
    lat: 140, // Downtown
    lng: 210,
    createdDate: '2025-11-28',
    priceHistory: [
      { date: '2025-11-28', price: 12500 }
    ]
  },
  {
    id: 'prop-5',
    title: 'Canyon Crest Vista Development Land',
    description: 'Prime, shovel-ready panoramic hilltop real estate acreage zoned for architectural luxury estates or boutique cluster houses. Offering full municipal water, electrical conduits, completed environmental surveys, and dramatic cliff views overlooking the sunset valley lake systems below.',
    price: 360000,
    listingType: 'buy',
    propertyType: 'land',
    address: 'Lot 14, High Canyon Bluffs Road',
    city: 'Canyon View',
    zipCode: '87501',
    bedrooms: 0,
    bathrooms: 0,
    sizeSqFt: 43560, // 1 Acre
    lotSize: '1.0 Acre',
    yearBuilt: 2024,
    parkingSpaces: 0,
    floors: 0,
    amenities: ['Water Hookups', 'Electrical Grid Conduits', 'Topographical Surveys Done', 'Scenic Overlook', 'Zoned Residential', 'Paved Road Access'],
    photos: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'
    ],
    agentId: 'agent-2',
    isFeatured: false,
    status: 'active',
    views: 290,
    saves: 61,
    inquiryCount: 5,
    walkScore: 12,
    transitScore: 8,
    schoolRating: 7,
    lat: 440, // Canyon view
    lng: 220,
    createdDate: '2025-12-05',
    priceHistory: [
      { date: '2025-12-05', price: 360000 }
    ]
  },
  {
    id: 'prop-6',
    title: 'Waterfront Sunset Townhome',
    description: 'Elegant architectural loft-style condo property set right in the boardwalk strip. Features warm engineered oak floors, quartz breakfast bars, a private solar heated rooftop platform, and sliding dock access pathways. Walkable directly to beach clubs, coastal taverns, and local organic grocers.',
    price: 1350000,
    listingType: 'buy',
    propertyType: 'condo',
    address: '88 Esplanade Promenade, Villa 4',
    city: 'Marina Heights',
    zipCode: '90212',
    bedrooms: 2,
    bathrooms: 2.5,
    sizeSqFt: 2100,
    lotSize: '0.1 Acres',
    yearBuilt: 2019,
    parkingSpaces: 2,
    floors: 2,
    amenities: ['Boardwalk Access', 'Rooftop Lounge', 'Solar-Heated Decks', 'Quartz Counters', 'Smart Ring Locks', 'Private Carport', 'Gym Access'],
    photos: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800'
    ],
    agentId: 'agent-4',
    isFeatured: false,
    status: 'active',
    views: 520,
    saves: 145,
    inquiryCount: 19,
    walkScore: 92,
    transitScore: 88,
    schoolRating: 10,
    lat: 50, // Marina / beach area
    lng: 80,
    createdDate: '2025-12-10',
    priceHistory: [
      { date: '2025-12-01', price: 1390000 },
      { date: '2025-12-10', price: 1350000 }
    ]
  },
  {
    id: 'prop-7',
    title: 'The Apex Modernist Warehouse',
    description: 'High-clearance commercial logistics facility offering excellent truck loading bays, a smart administrative office duplex, concrete foundations designed for machinery load limits, 600V three-phase electrical services, and instant highway arterial links. Fully secured perimeter lines.',
    price: 16500,
    listingType: 'lease',
    propertyType: 'commercial',
    address: '104 Industrial Commerce Expressway',
    city: 'Industrial East',
    zipCode: '55102',
    bedrooms: 0,
    bathrooms: 4,
    sizeSqFt: 18500,
    lotSize: '2.5 Acres',
    yearBuilt: 2017,
    parkingSpaces: 15,
    floors: 1,
    amenities: ['Loading Bays', 'Office Duplex', '600V Power Supply', 'Highway Arterials Link', 'Secured Perimeters', 'CCTV System', 'HVAC Server Room'],
    photos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&q=80&w=800'
    ],
    agentId: 'agent-3',
    isFeatured: false,
    status: 'active',
    views: 310,
    saves: 42,
    inquiryCount: 9,
    walkScore: 10,
    transitScore: 45,
    schoolRating: 3,
    lat: 480, // industrial east
    lng: 450,
    createdDate: '2025-12-08',
    priceHistory: [
      { date: '2025-12-08', price: 16500 }
    ]
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    propertyId: 'prop-1',
    propertyTitle: 'The Peninsula Sovereign Estate',
    propertyPhoto: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=150',
    seekerName: 'Robert Vance Jr.',
    seekerEmail: 'robert.vance@vancerefrigi.com',
    seekerPhone: '+1 (555) 231-9080',
    message: 'Hello, I am interested in scheduling a private VIP walkthrough of this estate next Tuesday morning. I would also like to confirm if the private dock can accommodate an 80-foot vessel.',
    status: 'new',
    preferredDate: '2026-06-02',
    preferredTime: '10:00 AM',
    createdDate: '2026-05-25',
    notes: ['Pre-vetted with bank letter of credit.', 'Interested in immediate 30-day closing.'],
    chatHistory: [
      {
        sender: 'seeker',
        message: 'Hello! I saw this Peninsula list, is it still active?',
        timestamp: '2026-05-25T14:20:00Z'
      },
      {
        sender: 'agent',
        message: 'Hello Mr. Vance, yes it is! I can arrange a private viewing for you. Would you like to check the dock dimensions during the trip?',
        timestamp: '2026-05-25T14:35:00Z'
      },
      {
        sender: 'seeker',
        message: 'Absolutely, that is crucial. Lets set it up for next Tuesday is possible.',
        timestamp: '2026-05-25T14:40:00Z'
      }
    ]
  },
  {
    id: 'inq-2',
    propertyId: 'prop-2',
    propertyTitle: 'Zenith Heights Glass Penthouse',
    propertyPhoto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150',
    seekerName: 'Diana Prince',
    seekerEmail: 'diana.prince@themiscyra.io',
    seekerPhone: '+1 (555) 555-1941',
    message: 'Hi Sarah, I would love to rent your Zenith Penthouse. Could you tell me if pets (one well-behaved corgi) are allowed in the penthouse or if the tower imposes weight limits?',
    status: 'contacted',
    preferredDate: '2026-05-29',
    preferredTime: '02:00 PM',
    createdDate: '2026-05-24',
    notes: ['Tenant is moving for a corporate consultancy assignment.'],
    chatHistory: [
      {
        sender: 'seeker',
        message: 'Does this building have a specific pet restriction register?',
        timestamp: '2026-05-24T10:15:00Z'
      },
      {
        sender: 'agent',
        message: 'The tower allows pets up to 35lbs! A corgi will have absolutely no issues. Would you like to schedule a viewing to feel the elevator and security flow?',
        timestamp: '2026-05-24T11:02:00Z'
      }
    ]
  },
  {
    id: 'inq-3',
    propertyId: 'prop-3',
    propertyTitle: 'Oakwood Mountain Crest Villa',
    propertyPhoto: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=150',
    seekerName: 'Ethan Hunt',
    seekerEmail: 'ethan.hunt@impossible.gov',
    seekerPhone: '+1 (555) 707-1996',
    message: 'How is the snow avalanche safety rating for this Pine Crest hillside? Also, are the solar backups configured for sub-zero battery storage?',
    status: 'viewing',
    preferredDate: '2026-05-28',
    preferredTime: '11:00 AM',
    createdDate: '2026-05-23',
    notes: ['Requires extreme privacy controls. High priority viewing request.'],
    chatHistory: [
      {
        sender: 'seeker',
        message: 'Greetings, I need details on the perimeter fencing and backup generators.',
        timestamp: '2026-05-23T09:00:00Z'
      },
      {
        sender: 'agent',
        message: 'Hello Ethan, the house features a fully automatic 22kW backup generator and is insulated to extreme alpine specifications. The perimeter faces solid granite bluffs.',
        timestamp: '2026-05-23T11:30:00Z'
      }
    ]
  }
];

export const INITIAL_REPORTED_LISTINGS: ReportedListing[] = [
  {
    id: 'rep-1',
    propertyId: 'prop-1',
    propertyTitle: 'The Peninsula Sovereign Estate',
    reporterName: 'Anonymous Broker',
    reason: 'Outdated Price Info',
    details: 'The MLS listing says this property has accepted an offer last week, but it is shown as active here.',
    createdDate: '2026-05-22',
    status: 'pending'
  },
  {
    id: 'rep-2',
    propertyId: 'prop-5',
    propertyTitle: 'Canyon Crest Vista Development Land',
    reporterName: 'George Clooney',
    reason: 'Inaccurate Location Coordinates',
    details: 'The map shows this land parcel inside the municipal park conservation boundary, which is physically impossible. It is located 3 miles east.',
    createdDate: '2026-05-24',
    status: 'pending'
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Chibuike Eseagwu',
  email: 'chibuikeeseagwu02@gmail.com',
  phone: '+1 (555) 438-1920',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  role: 'seeker', // Seeker initially - user can hot-swap on dashboard!
  savedProperties: ['prop-1', 'prop-2'],
  recentSearches: ['Marina Heights buy 4+ bed', 'Downtown Core apartment rent'],
  notesOnProperties: {
    'prop-1': 'Stunning layout - make sure Sarah checks the boat slip permit records.',
    'prop-2': 'Ideal high quality sky club amenities, excellent proximity to the engineering offices.'
  },
  priceDropAlerts: ['prop-1']
};

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'sav-1',
    name: 'Marina Waterfront Estates',
    criteria: {
      city: 'Marina Heights',
      listingType: 'buy',
      propertyType: 'house',
      minPrice: 1000000
    },
    createdDate: '2026-05-20'
  },
  {
    id: 'sav-2',
    name: 'Metro Sky Lofts Penthouse',
    criteria: {
      city: 'Downtown Core',
      listingType: 'rent',
      propertyType: 'apartment',
      minPrice: 5000,
      bedrooms: '3'
    },
    createdDate: '2026-05-22'
  }
];
