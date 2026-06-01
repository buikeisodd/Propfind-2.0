import React, { useState, useEffect } from "react";
import {
  Property,
  Agent,
  Inquiry,
  SavedSearch,
  ReportedListing,
  UserProfile,
} from "./types";
import {
  INITIAL_AGENTS,
  INITIAL_PROPERTIES,
  INITIAL_INQUIRIES,
  INITIAL_SAVED_SEARCHES,
  INITIAL_REPORTED_LISTINGS,
  DEFAULT_USER_PROFILE,
} from "./mockData";
import InteractiveMap from "./components/InteractiveMap";
import PropertyCompare from "./components/PropertyCompare";
import ListingForm from "./components/ListingForm";
import InboxChat from "./components/InboxChat";
import AdminPanel from "./components/AdminPanel";
import PropertyDetailModal from "./components/PropertyDetailModal";
import AuthModal from "./components/AuthModal";
import SupportChatbot from "./components/SupportChatbot";

// Icons
import {
  Building2,
  Search,
  Heart,
  Map,
  List,
  SlidersHorizontal,
  Scale,
  Sparkles,
  ShieldCheck,
  Mail,
  Compass,
  HelpCircle,
  PhoneCall,
  Star,
  Bookmark,
  ClipboardCheck,
  ArrowUpRight,
  AlertCircle,
  ChevronRight,
  User,
  AlertOctagon,
  RotateCcw,
  X,
  MapPin,
} from "lucide-react";

export default function App() {
  // Master Databases in Client State
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [reportedListings, setReportedListings] = useState<ReportedListing[]>(
    INITIAL_REPORTED_LISTINGS,
  );

  // Custom auth states. Users start as Guests initially until they log in. (US-08)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authIntendedAction, setAuthIntendedAction] = useState<string | null>(
    null,
  );
  const [authFormMode, setAuthFormMode] = useState<"signin" | "signup">(
    "signin",
  );

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Guest Explorer",
    email: "guest@propfind.com",
    phone: "",
    photo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
    role: "seeker",
    savedProperties: [],
    recentSearches: [],
    notesOnProperties: {},
    priceDropAlerts: [],
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(
    INITIAL_SAVED_SEARCHES,
  );

  // Active User Persona Role Toggles (Seeker, Owner, Agent, Admin)
  const [currentRole, setCurrentRole] = useState<
    "seeker" | "owner" | "agent" | "admin"
  >("seeker");

  // Secure locked Staff portal password terminal challenge variables (AD-02)
  const [isAdminLockScreenVisible, setIsAdminLockScreenVisible] =
    useState<boolean>(false);
  const [enteredPasscode, setEnteredPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string>("");

  // Floating user support chatbot and live Tickets queue (US-09)
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [supportTickets, setSupportTickets] = useState<
    Array<{
      userEmail: string;
      userName: string;
      userRole: string;
      messages: Array<{
        sender: "user" | "admin" | "bot";
        text: string;
        timestamp: string;
      }>;
    }>
  >([
    {
      userEmail: "chibuikeeseagwu02@gmail.com",
      userName: "Chibuike Eseagwu",
      userRole: "seeker",
      messages: [
        {
          sender: "user",
          text: "Hello, I suspect that some properties in the Marina Heights region have duplicate listings. Could you review them?",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          sender: "bot",
          text: "Hello! I am PropFind Guard, your automatic Trust & Safety bot. Your ticket has been logged and assigned to active administrators.",
          timestamp: new Date(Date.now() - 3590000).toISOString(),
        },
      ],
    },
    {
      userEmail: "george.clooney@hollywood.com",
      userName: "George Clooney",
      userRole: "owner",
      messages: [
        {
          sender: "user",
          text: "Hello administrative team, can you please verify my landlord deed so that I can display the Verified Owner badge on my penthouses?",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          sender: "bot",
          text: "Hello! Your request has been queued for credentials audit.",
          timestamp: new Date(Date.now() - 7190000).toISOString(),
        },
      ],
    },
  ]);

  // Interactive detail views
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );
  const [comparisonPropertyIds, setComparisonPropertyIds] = useState<string[]>(
    [],
  );
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Search, autocompletion and advanced filtering states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>("All Regions");
  const [selectedListingType, setSelectedListingType] = useState<string>("all");
  const [selectedPropertyType, setSelectedPropertyType] =
    useState<string>("all");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("all");
  const [bathroomsFilter, setBathroomsFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortingOption, setSortingOption] = useState<string>("relevance");

  // Polyline bounds filter from Interactive Map Lasso Tools
  const [lassoFilteredIds, setLassoFilteredIds] = useState<string[] | null>(
    null,
  );

  // UI state managers
  const [showAdvancedFilters, setShowAdvancedFilters] =
    useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"all" | "grid" | "map">("all"); // For discovery pane
  const [customSearchName, setCustomSearchName] = useState<string>("");
  const [activePromotedPropertyId, setActivePromotedPropertyId] = useState<
    string | null
  >(null);
  const [promotionDuration, setPromotionDuration] = useState<number>(7);
  const [selectedPromotionType, setSelectedPromotionType] = useState<
    "featured" | "spotlight" | "premium"
  >("featured");
  const [showPromoteFeedback, setShowPromoteFeedback] = useState<string | null>(
    null,
  );

  // Edit / Creation listing modes
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false);

  // Profile management notes
  const [tempNoteText, setTempNoteText] = useState<Record<string, string>>({});

  // Triggering price drop inline notification alerts dynamically
  const [priceDropAlerts, setPriceDropAlerts] = useState<
    { id: string; oldPrice: number; newPrice: number; title: string }[]
  >([]);

  // Local static list of suggested cities for search autocomplete (SR-01)
  const SUGGESTED_CITIES = [
    "Marina Heights",
    "Downtown Core",
    "Pine Crest",
    "Canyon View",
    "Industrial East",
  ];

  // Handle autocomplete matching
  const filteredSuggestions = SUGGESTED_CITIES.filter(
    (city) =>
      city.toLowerCase().includes(searchQuery.toLowerCase()) &&
      searchQuery.length > 0,
  );

  // Add recently viewed trigger on opening property details
  const triggerPropertyDetail = (id: string) => {
    setSelectedPropertyId(id);
    // Track recently viewed (limit to 5)
    if (!recentlyViewedIds.includes(id)) {
      setRecentlyViewedIds([id, ...recentlyViewedIds.slice(0, 4)]);
    }
    // Update view count in state
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, views: p.views + 1 } : p)),
    );
  };

  // Toggle favorite bookmark action (UE-01) - Enforced via Auth Check (US-08)
  const handleToggleFavorite = (propertyId: string) => {
    if (!isAuthenticated) {
      setAuthIntendedAction(`favorite:${propertyId}`);
      setAuthFormMode("signin");
      setIsAuthModalOpen(true);
      return;
    }
    const isSaved = userProfile.savedProperties.includes(propertyId);
    let updatedSaves = [...userProfile.savedProperties];
    if (isSaved) {
      updatedSaves = updatedSaves.filter((id) => id !== propertyId);
      // Reduce save count of property
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, saves: Math.max(0, p.saves - 1) } : p,
        ),
      );
    } else {
      updatedSaves.push(propertyId);
      // Increase save count of property
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, saves: p.saves + 1 } : p,
        ),
      );
    }
    setUserProfile({ ...userProfile, savedProperties: updatedSaves });
  };

  // Toggle comparative lists (UE-02)
  const handleToggleCompare = (propertyId: string) => {
    const isInList = comparisonPropertyIds.includes(propertyId);
    if (isInList) {
      setComparisonPropertyIds((prev) =>
        prev.filter((id) => id !== propertyId),
      );
    } else {
      if (comparisonPropertyIds.length >= 4) {
        alert(
          "You can compare up to 4 properties side-by-side inside the comparison matrix.",
        );
        return;
      }
      setComparisonPropertyIds([...comparisonPropertyIds, propertyId]);
    }
  };

  // Dispatch Inquiry details internally (UE-03, UE-04) - Enforced via Auth Check (US-08)
  const handleSendInquiry = (inqData: Omit<Inquiry, "id" | "createdDate">) => {
    if (!isAuthenticated) {
      setAuthIntendedAction(`tour:${JSON.stringify(inqData)}`);
      setAuthFormMode("signin");
      setIsAuthModalOpen(true);
      return;
    }
    const newInquiry: Inquiry = {
      ...inqData,
      id: `inq-${Date.now()}`,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setInquiries([newInquiry, ...inquiries]);
    // Increment property inquiry count
    setProperties((prev) =>
      prev.map((p) =>
        p.id === inqData.propertyId
          ? { ...p, inquiryCount: p.inquiryCount + 1 }
          : p,
      ),
    );
  };

  // Dispatch live authentication and complete deferred tasks (US-08)
  const handleAuthenticateUser = (userData: {
    name: string;
    email: string;
    age: number;
    role: "seeker" | "owner" | "agent" | "admin";
  }) => {
    setIsAuthenticated(true);
    setUserProfile({
      ...userProfile,
      name: userData.name,
      email: userData.email,
      role: userData.role === "admin" ? "seeker" : userData.role,
    });

    // Set appropriate hot-swap workspace
    setCurrentRole(userData.role === "admin" ? "seeker" : userData.role);

    // Solve deferred pending user triggers
    if (authIntendedAction) {
      if (authIntendedAction.startsWith("favorite:")) {
        const pId = authIntendedAction.split(":")[1];
        setProperties((prev) =>
          prev.map((p) => (p.id === pId ? { ...p, saves: p.saves + 1 } : p)),
        );
        setUserProfile((prev) => ({
          ...prev,
          savedProperties: [...prev.savedProperties, pId],
        }));
        alert(`Welcome, passport logged in! Property bookmarked.`);
      } else if (authIntendedAction.startsWith("tour:")) {
        try {
          const parsed = JSON.parse(authIntendedAction.replace("tour:", ""));
          const finalInquiry: Inquiry = {
            ...parsed,
            id: `inq-${Date.now()}`,
            createdDate: new Date().toISOString().split("T")[0],
          };
          setInquiries((prev) => [finalInquiry, ...prev]);
          setProperties((prev) =>
            prev.map((p) =>
              p.id === parsed.propertyId
                ? { ...p, inquiryCount: p.inquiryCount + 1 }
                : p,
            ),
          );
          alert(
            `Welcome, passport verified! Your tour arrangement was dispatched.`,
          );
        } catch (err) {
          alert(`Welcome back! Your request process is unlocked.`);
        }
      } else if (authIntendedAction === "list") {
        setIsCreatingListing(true);
        alert(`Welcome! Your landlord listing studio is now active.`);
      }
      setAuthIntendedAction(null);
    }
  };

  // Chatbot Live Support ticketing workflow (US-09)
  const handleUserSendSupportMessage = (text: string) => {
    const email = userProfile.email || "guest@propfind.com";
    const name = userProfile.name || "Guest Explorer";
    const role = userProfile.role || "seeker";

    let hasTicket = false;
    const nextTickets = supportTickets.map((tc) => {
      if (tc.userEmail === email) {
        hasTicket = true;
        return {
          ...tc,
          messages: [
            ...tc.messages,
            {
              sender: "user" as const,
              text,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return tc;
    });

    let finalTickets = nextTickets;
    if (!hasTicket) {
      finalTickets = [
        ...supportTickets,
        {
          userEmail: email,
          userName: name,
          userRole: role,
          messages: [
            {
              sender: "user" as const,
              text,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      ];
    }

    setSupportTickets(finalTickets);

    // Automatic guard response triggers to keep client context-informed
    setTimeout(() => {
      setSupportTickets((prev) =>
        prev.map((tc) => {
          if (tc.userEmail === email) {
            let botReplyText =
              "Your ticket was routed to active administrators. Expect an response within a few moments.";
            const lower = text.toLowerCase();
            if (lower.includes("outdated") || lower.includes("prop-")) {
              botReplyText =
                "🤖 Trust Inspector Guard: Analyzing listing records... Registered flag for duplication / outdated price audits.";
            } else if (lower.includes("verify") || lower.includes("deed")) {
              botReplyText =
                "🤖 Owner Registry Audits: Please provide county deed reference numbers inside the owner portal so admins can verify your seller profile.";
            }
            return {
              ...tc,
              messages: [
                ...tc.messages,
                {
                  sender: "bot" as const,
                  text: botReplyText,
                  timestamp: new Date().toISOString(),
                },
              ],
            };
          }
          return tc;
        }),
      );
    }, 1000);
  };

  // Core administrative live router to update chats (US-09)
  const handleAdminReplyTicket = (userEmail: string, text: string) => {
    setSupportTickets((prev) =>
      prev.map((tc) => {
        if (tc.userEmail === userEmail) {
          return {
            ...tc,
            messages: [
              ...tc.messages,
              {
                sender: "admin" as const,
                text,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return tc;
      }),
    );
  };

  // Handle dynamic price drops alerts triggers (forcing simulated drops to showcase feature UX UE-06)
  const triggerDemonstrationPriceDrop = (propertyId: string) => {
    const target = properties.find((p) => p.id === propertyId);
    if (!target) return;
    const oldPrice = target.price;
    const discount = Math.round(target.price * 0.05); // 5% off
    const newPrice = oldPrice - discount;

    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? {
              ...p,
              price: newPrice,
              priceHistory: [
                ...p.priceHistory,
                {
                  date: new Date().toISOString().split("T")[0],
                  price: newPrice,
                },
              ],
            }
          : p,
      ),
    );

    // Append to notifications if user is tracking this item
    if (userProfile.savedProperties.includes(propertyId)) {
      setPriceDropAlerts((prev) => [
        { id: propertyId, oldPrice, newPrice, title: target.title },
        ...prev,
      ]);
    }
  };

  // Saving Searches filters locally (SR-07)
  const handleSaveSearch = () => {
    if (!customSearchName.trim()) {
      alert("Please specify a custom label name for your saved search filter.");
      return;
    }
    const newSave: SavedSearch = {
      id: `sav-${Date.now()}`,
      name: customSearchName,
      criteria: {
        city: selectedCity !== "All Regions" ? selectedCity : undefined,
        listingType:
          selectedListingType !== "all" ? selectedListingType : undefined,
        propertyType:
          selectedPropertyType !== "all" ? selectedPropertyType : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        bedrooms: bedroomsFilter !== "all" ? bedroomsFilter : undefined,
        bathrooms: bathroomsFilter !== "all" ? bathroomsFilter : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      },
      createdDate: new Date().toISOString().split("T")[0],
    };
    setSavedSearches([newSave, ...savedSearches]);
    setCustomSearchName("");
    alert(
      `Search query "${newSave.name}" successfully bookmarked to database!`,
    );
  };

  // Hydrate search from saved filter
  const applySavedSearch = (search: SavedSearch) => {
    const crit = search.criteria;
    setSelectedCity(crit.city || "All Regions");
    setSelectedListingType(crit.listingType || "all");
    setSelectedPropertyType(crit.propertyType || "all");
    setMinPrice(crit.minPrice || "");
    setMaxPrice(crit.maxPrice || "");
    setBedroomsFilter(crit.bedrooms || "all");
    setBathroomsFilter(crit.bathrooms || "all");
    setSelectedAmenities(crit.amenities || []);
  };

  // Clear all filters
  const resetAllFilters = () => {
    setSelectedCity("All Regions");
    setSelectedListingType("all");
    setSelectedPropertyType("all");
    setMinPrice("");
    setMaxPrice("");
    setBedroomsFilter("all");
    setBathroomsFilter("all");
    setSelectedAmenities([]);
    setLassoFilteredIds(null);
    setSearchQuery("");
  };

  // Toggle amenity selection
  const handleToggleAmenityFilter = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities((prev) => prev.filter((x) => x !== name));
    } else {
      setSelectedAmenities((prev) => [...prev, name]);
    }
  };

  // Create or edit property listing callbacks (LM-01, LM-04)
  const handlePostProperty = (payload: Property) => {
    const exists = properties.some((p) => p.id === payload.id);
    if (exists) {
      setProperties((prev) =>
        prev.map((p) => (p.id === payload.id ? payload : p)),
      );
      alert("Property details successfully updated inside database!");
    } else {
      setProperties([payload, ...properties]);
      alert(
        "Congratulations! Your listing has been published live to the PropFind marketplace.",
      );
    }
    setEditingProperty(null);
    setIsCreatingListing(false);
  };

  // Delete property listing callback (US-06 / owner delete trigger)
  const handleDeleteProperty = (propertyId: string) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this listing? This operation cannot be undone.",
      )
    ) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      alert(
        "The listing has been successfully deleted from the marketplace catalog.",
      );
    }
  };

  // Agent promotional setup (LM-10, US-10)
  const handleConfigPromotion = (propertyId: string) => {
    setActivePromotedPropertyId(propertyId);
  };

  const handleApplyPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePromotedPropertyId) return;

    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === activePromotedPropertyId) {
          return {
            ...p,
            isPromoted: true,
            promotionType: selectedPromotionType,
            promotionExpiryDate: new Date(
              Date.now() + promotionDuration * 24 * 60 * 60 * 1000,
            )
              .toISOString()
              .split("T")[0],
          };
        }
        return p;
      }),
    );

    setShowPromoteFeedback(
      `Success! Listing promoted to ${selectedPromotionType.toUpperCase()} tier for ${promotionDuration} days.`,
    );
    setTimeout(() => {
      setShowPromoteFeedback(null);
      setActivePromotedPropertyId(null);
    }, 4000);
  };

  // Admin moderation queues actions (AD-01, AD-03, AD-04)
  const handleApprovePendingProperty = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status: "active" } : p)),
    );
  };

  const handleModifyPropertyStatus = (
    propertyId: string,
    status: Property["status"],
  ) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, status } : p)),
    );
  };

  const handleVerifyAgentBadge = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, isVerified: true } : a)),
    );
  };

  const handleModeratorReportAction = (
    reportId: string,
    action: "dismissed" | "removed",
  ) => {
    const report = reportedListings.find((r) => r.id === reportId);
    if (!report) return;

    if (action === "removed") {
      // Set target property status to off-market
      setProperties((prev) =>
        prev.map((p) =>
          p.id === report.propertyId ? { ...p, status: "off-market" } : p,
        ),
      );
    }

    setReportedListings((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r)),
    );
  };

  const handleSuspendAccount = (email: string) => {
    alert(
      `Account associated with identifier ${email} has been given an official platform warnings flag.`,
    );
  };

  // Add fraud report callback from details modal
  const handleCreateFraudReport = (
    propertyId: string,
    reason: string,
    details: string,
  ) => {
    const target = properties.find((p) => p.id === propertyId);
    const newReport: ReportedListing = {
      id: `rep-${Date.now()}`,
      propertyId,
      propertyTitle: target?.title || "Unknown Asset",
      reporterName: "Anonymous Seeker",
      reason,
      details,
      createdDate: new Date().toISOString().split("T")[0],
      status: "pending",
    };
    setReportedListings([newReport, ...reportedListings]);
  };

  // Personal notes on saved favorites manager
  const updatePersonalNote = (propertyId: string, noteText: string) => {
    const updatedNotes = {
      ...userProfile.notesOnProperties,
      [propertyId]: noteText,
    };
    setUserProfile({
      ...userProfile,
      notesOnProperties: updatedNotes,
    });
    alert("Personal workspace note saved securely.");
  };

  // Update leads pipeline internally
  const handleUpdateInquiry = (
    inquiryId: string,
    updatedFields: Partial<Inquiry>,
  ) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === inquiryId ? { ...inq, ...updatedFields } : inq,
      ),
    );
  };

  // --- Filtering & Searching Core Algorithm ---
  const filteredProperties = properties.filter((prop) => {
    // 1. Lasso polygon boundaries if set (SR-02, US-01-6)
    if (lassoFilteredIds !== null && !lassoFilteredIds.includes(prop.id)) {
      return false;
    }

    // 2. City autocomplete/selection (SR-01)
    if (selectedCity !== "All Regions" && prop.city !== selectedCity) {
      return false;
    }

    // 3. Autocomplete search typed query
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(query);
      const matchAddress = prop.address.toLowerCase().includes(query);
      const matchCity = prop.city.toLowerCase().includes(query);
      if (!matchTitle && !matchAddress && !matchCity) {
        return false;
      }
    }

    // 4. Buy, rent, lease toggle filtering (SR-04)
    if (
      selectedListingType !== "all" &&
      prop.listingType !== selectedListingType
    ) {
      return false;
    }

    // 5. Property type (SR-05)
    if (
      selectedPropertyType !== "all" &&
      prop.propertyType !== selectedPropertyType
    ) {
      return false;
    }

    // 6. Prices ranges
    if (minPrice !== "" && prop.price < Number(minPrice)) {
      return false;
    }
    if (maxPrice !== "" && prop.price > Number(maxPrice)) {
      return false;
    }

    // 7. Bed & Baths count
    if (bedroomsFilter !== "all") {
      if (bedroomsFilter === "4+") {
        if (prop.bedrooms < 4) return false;
      } else if (prop.bedrooms !== Number(bedroomsFilter)) {
        return false;
      }
    }
    if (bathroomsFilter !== "all") {
      if (bathroomsFilter === "3+") {
        if (prop.bathrooms < 3) return false;
      } else if (prop.bathrooms !== Number(bathroomsFilter)) {
        return false;
      }
    }

    // 8. Amenities checklist (SR-03)
    if (selectedAmenities.length > 0) {
      const matchAll = selectedAmenities.every((am) =>
        prop.amenities.includes(am),
      );
      if (!matchAll) return false;
    }

    // 9. Listing lifecycle status filtering
    if (statusFilter !== "all") {
      if (prop.status !== statusFilter) {
        return false;
      }
    }

    // Default: retain
    return true;
  });

  // Sorting list logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    // Premium paid featured listings are promoted to the pinnacle position
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;

    if (sortingOption === "price-low") {
      return a.price - b.price;
    }
    if (sortingOption === "price-high") {
      return b.price - a.price;
    }
    if (sortingOption === "date") {
      return b.createdDate.localeCompare(a.createdDate);
    }
    // relevance / default
    return b.views - a.views;
  });

  const recentlyViewedProperties = recentlyViewedIds
    .map((id) => properties.find((p) => p.id === id))
    .filter((p): p is Property => p !== undefined);

  // Similar properties calculation for modals
  const getSimilarPropertiesFor = (item: Property) => {
    return properties.filter((p) => p.id !== item.id && p.city === item.city);
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans"
      id="propfind-platform-root"
    >
      {/* Dynamic top notifications for price drop warnings (UE-06) */}
      {priceDropAlerts.length > 0 && (
        <div
          className="bg-blue-600 p-2.5 px-4 text-center text-xs font-bold text-white flex justify-between items-center z-50 sticky top-0 animate-pulse duration-1000"
          id="global-news-banner"
        >
          <div className="flex items-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>
              Price Drop Warning! &quot;{priceDropAlerts[0].title}&quot; dropped
              to ${priceDropAlerts[0].newPrice.toLocaleString()}! Saving you 5%
            </span>
          </div>
          <button
            onClick={() => setPriceDropAlerts([])}
            className="text-white hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Core Platform Header Nav bar */}
      <header
        className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 shadow-xl"
        id="platform-main-header"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Branded Logo and Status */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 stroke-2" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-widest uppercase">
                  PropFind
                </h1>
                <span className="text-[10px] bg-slate-950 text-slate-400 p-1 px-2.5 rounded-full border border-slate-800 font-bold tracking-tight">
                  V1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Integrated MLS & Brokerage Ecosystem
              </p>
            </div>
          </div>

          {/* Persona Hot-swap Selector panel. Filtered to obscure secure staff console. (UA-02, AD-02) */}
          <div
            className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full md:w-auto overflow-x-auto scrollbar-none"
            id="persona-swapper"
          >
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 font-mono whitespace-nowrap shrink-0">
              Workspace:
            </span>
            {[
              { role: "seeker", label: "Property Seeker", icon: User },
              { role: "owner", label: "Private Seller", icon: Bookmark },
              { role: "agent", label: "Agency Broker", icon: PhoneCall },
              ...(currentRole === "admin"
                ? [{ role: "admin", label: "Plat. Admin", icon: ShieldCheck }]
                : []),
            ].map((p) => (
              <button
                key={p.role}
                onClick={() => {
                  setCurrentRole(p.role as any);
                  // Auto cancel creating modes to not pollute screens
                  setIsCreatingListing(false);
                  setEditingProperty(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  currentRole === p.role
                    ? "bg-blue-600 text-white shadow-lg font-bold scale-102"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                }`}
                id={`swap-role-to-${p.role}`}
              >
                <p.icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Guest Alert Banner Guide (US-08) */}
      {!isAuthenticated && (
        <div
          className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 border-b border-blue-900/40 p-2.5"
          id="guest-sandbox-header"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span className="text-slate-300">
                Guest Sandbox Exploration. Secret Auth Passport is requested
                to record favorites, list private properties, or schedule tours.
              </span>
            </div>
            <button
              onClick={() => {
                setAuthIntendedAction(null);
                setAuthFormMode("signin");
                setIsAuthModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase px-3 py-1 rounded border border-blue-500/30 transition-all shadow-md shrink-0 cursor-pointer"
            >
              Sign In Securely
            </button>
          </div>
        </div>
      )}

      {/* Authenticated Staff Console HUD Banner (AD-02) */}
      {currentRole === "admin" && (
        <div
          className="bg-amber-955/20 border-b border-amber-900/40 p-2 text-center text-xs text-amber-400 font-mono"
          id="staff-auth-banner"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
            <span className="flex items-center gap-1.5">
              🔒 <strong>Staff Office Gateway</strong>: Authenticated Session
              Active. Secure Moderation Terminal decrypted.
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentRole("seeker");
                setIsAuthenticated(false);
                setUserProfile({
                  name: "Guest Explorer",
                  email: "guest@propfind.com",
                  phone: "",
                  photo:
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
                  role: "seeker",
                  savedProperties: [],
                  recentSearches: [],
                  notesOnProperties: {},
                  priceDropAlerts: [],
                });
              }}
              className="bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold border border-red-900/40 px-2 py-0.5 rounded text-[10px]"
            >
              Lock Staff Desk
            </button>
          </div>
        </div>
      )}

      {/* Primary Workspace container */}
      <main
        className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6"
        id="primary-view-container"
      >
        {/* Swappable Workspace A: PROPERTY SEEKER VIEW (SR-01 - SR-10, UE-01 - UE-08, US-01 - US-04) */}
        {currentRole === "seeker" && (
          <div className="space-y-6" id="seeker-workspace">
            {/* Seeker Greeting & Quick bookmarks status */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              id="seeker-intro-bar"
            >
              <div className="md:col-span-2 bg-slate-900 rounded-3xl p-5 border border-slate-800 flex flex-col justify-center relative overflow-hidden perspective-1200 transform-style-3d">
                {/* 3D Ambient Glowing Orb decoration */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-28 h-28 hidden xl:block perspective-1200 transform-style-3d pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full blur-xl animate-float-3d-effect absolute inset-0"></div>
                  <div className="w-20 h-20 border border-blue-500/30 rounded-full animate-orbit-3d-effect absolute top-4 left-4 flex items-center justify-center transform-style-3d">
                    <div className="w-12 h-12 border-2 border-dashed border-purple-500/20 rounded-full animate-float-3d-effect"></div>
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)] -top-1.5 left-1/2 -translate-x-1/2"></div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 pr-[120px] md:pr-0">
                  <span className="text-xs text-blue-400 font-mono uppercase tracking-widest font-bold">
                    Discover Luxury Real Estate
                  </span>
                  {isAuthenticated ? (
                    <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Passport Verified (Age{" "}
                      {userProfile.role === "seeker" &&
                      userProfile.email === "chibuikeeseagwu02@gmail.com"
                        ? 34
                        : 30}
                      )
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-950 text-slate-500 font-mono border border-slate-850 px-2 py-0.5 rounded">
                      Temporary Guest Pass
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  Hello, {userProfile.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Filter through curated high-res listings, saved parameters,
                  compare housing values, or draw custom boundary areas inside
                  the Interactive Map to find your future home.
                </p>

                {/* Demographic Trust Playbook Advices (US-08) */}
                <div
                  className="mt-3 p-3 bg-slate-950/70 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-1.5"
                  id="demographics-playbook-widget"
                >
                  <div className="flex items-center gap-1">
                    
                    
                  </div>
                  {isAuthenticated ? (
                    (() => {
                      // Custom seeker age is typically around 34
                      const isChibuike =
                        userProfile.email === "chibuikeeseagwu025@gmail.com" ||
                        userProfile.email === "chibuikeeseagwu02@gmail.com";
                      const userAge = isChibuike ? 34 : 30; // Use realistic demographic numbers
                      if (userAge <= 35) {
                        return (
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            🎯{" "}
                            <strong>First-Time Seeker (Age {userAge})</strong>:
                            Look for high-contrast verified listings in Marina
                            Heights. To avoid outdated listings or scammers,
                            consult our county-recorder approved private sellers
                            (like George Clooney).
                          </p>
                        );
                      } else if (userAge > 35 && userAge <= 55) {
                        return (
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            🎯 <strong>Family Relocator (Age {userAge})</strong>
                            : Leverage school ratings (10/10) filters and
                            utilize the <strong>Map Lasso tool</strong> (draw
                            custom boundaries) to align with school district
                            perimeters.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                            🎯 <strong>Investor Segment (Age {userAge})</strong>
                            : Audit commercial leases or office metrics, and
                            leverage our{" "}
                            <strong>simulated price drop triggers</strong> to
                            analyze historical value adjustments.
                          </p>
                        );
                      }
                    })()
                  ) : (
                    <p className="text-[11px] text-slate-400 font-sans italic">
                      Welcome, guest seeker! Sign in to automatically match
                      your account demographics with county-certified real
                      estate suggestions.
                    </p>
                  )}
                </div>

                {/* Autocomplete City Search bar (SR-01) */}
                <div className="mt-4 relative max-w-md" id="search-bar-parent">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Type city (e.g. Marina), address or coordinates..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9.5 py-2.5 text-xs placeholder-slate-600 focus:outline-none focus:border-blue-500 text-white"
                      id="city-autocomplete-input"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete suggestions overlay list */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div
                      className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-850 rounded-xl shadow-2xl z-50 overflow-hidden font-mono"
                      id="autocomplete-suggestions"
                    >
                      {filteredSuggestions.map((city) => (
                        <div
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setSearchQuery(city);
                            setShowSuggestions(false);
                          }}
                          className="px-4 py-2 text-xs text-slate-300 hover:bg-blue-950 hover:text-white cursor-pointer transition-colors"
                        >
                          🏙️ {city} Area Region
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bookmarked quick indices cards (UA-08) */}
              <div
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between"
                id="quick-bookmarks-indices"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    Workspace Index
                  </span>
                  <h4 className="text-white font-semibold text-xs leading-tight">
                    My Active Favorites Dashboard
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Total saves: {userProfile.savedProperties.length} items
                  </p>
                </div>

                <div
                  className="flex gap-2 mt-4"
                  id="view-matrix-compare-trigger"
                >
                  <button
                    type="button"
                    onClick={() => {
                      // Anchor comparative table
                      const element = document.getElementById(
                        "comparison-matrix-anchor",
                      );
                      if (element)
                        element.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-[11px] text-slate-300 border border-slate-850 transition-colors font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    
                    <span>
                      View Compare Matrix ({comparisonPropertyIds.length})
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Recently Viewed Panel */}
              <div
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between"
                id="seeker-recently-viewed-panel"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
                      Recent History
                    </span>
                    <span className="text-[9px] bg-slate-955 px-2 py-0.5 rounded text-slate-400 border border-slate-850 font-mono font-semibold">
                      {recentlyViewedProperties.length}/5
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-xs leading-tight">
                    Recently Viewed
                  </h4>

                  {recentlyViewedProperties.length === 0 ? (
                    <div className="text-center p-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                      <p className="text-[11px] text-slate-500 italic">
                        No views register yet. Toggle properties to populate.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="space-y-2 mt-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800"
                      id="recently-viewed-inner-scroll"
                    >
                      {recentlyViewedProperties.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => triggerPropertyDetail(p.id)}
                          className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-850 hover:border-blue-500/40 cursor-pointer transition-all hover:bg-slate-900 text-left"
                        >
                          <img
                            src={p.photos[0]}
                            alt={p.title}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[10px] font-bold text-slate-200 truncate leading-tight font-display">
                              {p.title}
                            </h5>
                            <p className="text-[9px] text-slate-400 font-mono">
                              ${p.price.toLocaleString()}
                              {p.listingType === "rent" ? "/mo" : ""}
                            </p>
                          </div>
                          <ArrowUpRight className="w-3 h-3 text-slate-600 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter cockpit settings toolbar (SR-03) */}
            <div
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-md"
              id="search-parameters-deck"
            >
              <div
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                id="seeker-toolbar-header"
              >
                <div
                  className="grid grid-cols-2 md:flex md:items-center gap-3 w-full lg:w-auto"
                  id="essential-filters-row"
                >
                  {/* Sector Region Select */}
                  <div className="flex flex-col gap-1 col-span-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold font-mono">
                      Market Region
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 px-3 focus:outline-none focus:border-blue-500 text-white min-h-[38px] cursor-pointer"
                    >
                      <option value="All Regions">All Regions</option>
                      <option value="Marina Heights">Marina Heights</option>
                      <option value="Downtown Core">Downtown Core</option>
                      <option value="Pine Crest">Pine Crest</option>
                      <option value="Canyon View">Canyon View</option>
                      <option value="Industrial East">Industrial East</option>
                    </select>
                  </div>

                  {/* Pricing type toggle (Buy, Rent, Lease SR-04) */}
                  <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold font-mono">
                      Contract Type
                    </span>
                    <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs min-h-[38px] items-center justify-between">
                      {[
                        { label: "All", tag: "all" },
                        { label: "Buy", tag: "buy" },
                        { label: "Rent", tag: "rent" },
                        { label: "Lease", tag: "lease" },
                      ].map((t) => (
                        <button
                          key={t.tag}
                          type="button"
                          onClick={() => setSelectedListingType(t.tag)}
                          className={`flex-1 text-center py-1.5 text-[11px] font-semibold rounded-md transition-all uppercase cursor-pointer ${
                            selectedListingType === t.tag
                              ? "bg-blue-600 text-white font-bold"
                              : "text-slate-500 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sorting dropdown */}
                  <div className="flex flex-col gap-1 col-span-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold font-mono">
                      Sort Catalog
                    </span>
                    <select
                      value={sortingOption}
                      onChange={(e) => setSortingOption(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-xs p-2 px-3 focus:outline-none focus:border-blue-500 text-white min-h-[38px] cursor-pointer"
                    >
                      <option value="relevance">
                        Popular &amp; High Views
                      </option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="date">Newest Listings first</option>
                    </select>
                  </div>
                </div>

                <div
                  className="flex flex-wrap gap-2 items-center justify-between md:justify-end w-full lg:w-auto"
                  id="seekers-controls-tools"
                >
                  {/* Advanced settings toggles */}
                  <button
                    type="button"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="p-2 px-3.5 bg-slate-950 hover:bg-slate-850 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-850 text-slate-200 transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Advanced Filters</span>
                  </button>

                  {/* Grid/Map Toggles */}
                  <div className="flex bg-slate-950 border border-slate-800/80 p-0.5 rounded-xl font-medium text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode("all")}
                      className={`p-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewMode === "all" ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "text-slate-500 hover:text-slate-200 border border-transparent"}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Unified Split</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-200"}`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Grid Only</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("map")}
                      className={`p-1.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${viewMode === "map" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-200"}`}
                    >
                      <Map className="w-3.5 h-3.5" />
                      <span>Map Only</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="p-2 border border-transparent hover:border-slate-800 text-slate-500 hover:text-white rounded-xl transition-all"
                    title="Reset Search and Queries"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Advanced collapsable filters (SR-03) */}
              {showAdvancedFilters && (
                <div
                  className="border-t border-slate-850 pt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs animate-fade-in"
                  id="panel-advanced-filters"
                >
                  {/* Property Type Category */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Category Type
                    </label>
                    <select
                      value={selectedPropertyType}
                      onChange={(e) => setSelectedPropertyType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                    >
                      <option value="all">All Structures</option>
                      <option value="house">House / Villa</option>
                      <option value="apartment">Apartment Suite</option>
                      <option value="condo">Beach Condo</option>
                      <option value="land">Develop Land</option>
                      <option value="commercial">Commercial Hub</option>
                      <option value="office">Corporate workspace</option>
                    </select>
                  </div>

                  {/* Sizing Prices */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Price limits ($)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="number"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-700"
                      />
                      <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value === "" ? "" : Number(e.target.value),
                          )
                        }
                        className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 text-white placeholder-slate-700"
                      />
                    </div>
                  </div>

                  {/* Bed counts */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Beds count
                    </label>
                    <select
                      value={bedroomsFilter}
                      onChange={(e) => setBedroomsFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white focus:outline-none"
                    >
                      <option value="all">Any Beds</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4+">4+ Bedrooms</option>
                    </select>
                  </div>

                  {/* Listing Status */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Listing Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-white focus:outline-none"
                      id="status-filter-select"
                    >
                      <option value="all">Any Status</option>
                      <option value="active">🟢 Active</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="sold">🔑 Sold</option>
                      <option value="rented">✍️ Rented</option>
                      <option value="off-market">🚫 Off-Market</option>
                      <option value="expired">⚠️ Expired</option>
                    </select>
                  </div>

                  {/* Save current search queries parameters */}
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-tight mb-1">
                      Save Search Filter
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Marina Waterfronts"
                        value={customSearchName}
                        onChange={(e) => setCustomSearchName(e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 text-[11px] h-8 text-white focus:outline-none focus:border-blue-500"
                        id="save-filter-input"
                      />
                      <button
                        type="button"
                        onClick={handleSaveSearch}
                        className="p-1 px-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold font-mono uppercase"
                        id="save-filter-submit"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split layout: Discovery Catalog or Map */}
            {viewMode === "all" ? (
              /* High intensity Side-by-Side 3D Map and Listings catalog layout (SR-02, US-01) */
              <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-entrance-3d-effect"
                id="seekers-split-pane"
              >
                {/* 3D Map Anchor Left Column */}
                <div
                  className="lg:col-span-4 xl:col-span-5 h-[320px] sm:h-[480px] lg:h-[550px] lg:sticky lg:top-24 z-10"
                  id="map-sticky-container"
                >
                  <InteractiveMap
                    properties={filteredProperties}
                    selectedPropertyId={selectedPropertyId}
                    onSelectProperty={(id) => triggerPropertyDetail(id)}
                    onFilterByPolygon={(ids) => setLassoFilteredIds(ids)}
                  />
                  <div className="mt-2 text-[10px] text-slate-500 font-mono text-center">
                    💡 Click <strong>&quot;Draw Search Area&quot;</strong> in
                    map header to isolate desirable plots.
                  </div>
                </div>

                {/* Listing Grid Scrolling Right Column */}
                <div
                  className="lg:col-span-8 xl:col-span-7 space-y-4"
                  id="cards-scrolling-container"
                >
                  {/* Stats & Search counts */}
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-900 pb-2"
                    id="seekers-counters-drawer-split"
                  >
                    <span className="font-semibold text-slate-400">
                      Showing{" "}
                      <strong className="text-white">
                        {sortedProperties.length}
                      </strong>{" "}
                      matching premium properties
                    </span>

                    {savedSearches.length > 0 && (
                      <div
                        className="flex items-center gap-1.5"
                        id="saved-searches-drawer-split"
                      >
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                          Saved searches:
                        </span>
                        {savedSearches.slice(0, 2).map((sv) => (
                          <button
                            key={sv.id}
                            onClick={() => applySavedSearch(sv)}
                            type="button"
                            className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-850 hover:text-white text-[10px] border border-slate-800 text-slate-350 transition-colors font-mono cursor-pointer"
                          >
                            🏙️ {sv.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Property list inside split-grid */}
                  {sortedProperties.length === 0 ? (
                    <div
                      className="text-center p-12 bg-slate-900/40 border border-slate-800 rounded-3xl"
                      id="seekers-search-empty-split"
                    >
                      <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p className="text-sm text-slate-450 font-semibold">
                        Zero Matching Listings found
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Your advanced parameters are too constrained. Reset
                        filters to reload catalog.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      id="seekers-results-grid-split"
                    >
                      {sortedProperties.map((prop) => {
                        const isSaved = userProfile.savedProperties.includes(
                          prop.id,
                        );
                        const isCompare = comparisonPropertyIds.includes(
                          prop.id,
                        );

                        return (
                          <div
                            key={prop.id}
                            className="bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadowIndex group flex flex-col justify-between hover-perspective-card"
                            id={`property-card-split-${prop.id}`}
                          >
                            {/* Photo Block */}
                            <div className="relative h-44 bg-slate-950 overflow-hidden">
                              <img
                                src={prop.photos[0]}
                                alt={prop.title}
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                                onClick={() => triggerPropertyDetail(prop.id)}
                              />

                              {(prop.isPromoted || prop.isFeatured) && (
                                <span
                                  className={`absolute top-2.5 left-2.5 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-lg flex items-center gap-1 ${
                                    prop.isFeatured
                                      ? "bg-amber-400 border border-amber-300 animate-pulse"
                                      : "bg-blue-400 border border-blue-300"
                                  }`}
                                >
                                  ★{" "}
                                  {prop.isFeatured
                                    ? "FEATURED"
                                    : prop.promotionType?.toUpperCase() ||
                                      "PROMOTED"}
                                </span>
                              )}

                              <span
                                className={`absolute bottom-2.5 left-2.5 backdrop-blur-md shadow-lg font-bold font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                                  prop.status === "active"
                                    ? "bg-emerald-950/90 text-emerald-400 border-emerald-900/60"
                                    : prop.status === "pending"
                                      ? "bg-amber-950/90 text-amber-400 border-amber-900/60"
                                      : prop.status === "sold"
                                        ? "bg-blue-950/90 text-blue-400 border-blue-900/60"
                                        : prop.status === "rented"
                                          ? "bg-purple-950/90 text-purple-400 border-purple-900/60"
                                          : prop.status === "off-market"
                                            ? "bg-slate-950/90 text-slate-400 border-slate-800"
                                            : "bg-red-950/90 text-red-400 border-red-900/60"
                                }`}
                              >
                                {prop.status === "active" ? "● " : ""}
                                {prop.status}
                              </span>

                              <button
                                onClick={() => handleToggleFavorite(prop.id)}
                                className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border shadow transition-all ${
                                  isSaved
                                    ? "bg-rose-600 text-white border-rose-500 scale-105"
                                    : "bg-slate-955/80 hover:bg-slate-950 text-slate-300 border-slate-800"
                                }`}
                                title="Bookmark item"
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                                />
                              </button>

                              <span className="absolute bottom-2.5 right-2.5 bg-slate-950/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-blue-300 font-bold font-mono text-xs shadow-lg">
                                ${prop.price.toLocaleString()}
                                {prop.listingType === "rent" ? "/mo" : ""}
                              </span>
                            </div>

                            {/* Body and info */}
                            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <h4
                                    onClick={() =>
                                      triggerPropertyDetail(prop.id)
                                    }
                                    className="font-bold text-white text-xs hover:text-blue-400 cursor-pointer truncate transition-colors pr-1 flex-1 leading-snug tracking-tight font-display"
                                    title={prop.title}
                                  >
                                    {prop.title}
                                  </h4>
                                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight bg-slate-950 p-1 px-1.5 rounded font-mono border border-slate-900 shrink-0">
                                    {prop.propertyType}
                                  </span>
                                </div>

                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">
                                    {prop.address}, {prop.city}
                                  </span>
                                </p>

                                <p className="text-[11px] text-slate-400 line-clamp-2 italic pt-1 leading-normal">
                                  {prop.description}
                                </p>
                              </div>

                              <div className="pt-2.5 space-y-2 border-t border-slate-950 mt-2">
                                <div className="bg-slate-950/60 p-2 rounded-lg flex justify-between text-[10px] font-mono text-slate-400 border border-slate-900/60">
                                  <span>{prop.bedrooms} Bed</span>
                                  <span>{prop.bathrooms} Bath</span>
                                  <span>
                                    {prop.sizeSqFt.toLocaleString()} sqft
                                  </span>
                                </div>

                                <div className="flex gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCompare(prop.id)}
                                    className={`flex-1 py-1 rounded-lg border border-slate-800 text-[9px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                                      isCompare
                                        ? "bg-blue-600 border-blue-500 text-white"
                                        : "bg-slate-950 hover:bg-slate-900 text-slate-350"
                                    }`}
                                  >
                                    {isCompare ? "In Compare" : "Compare"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      triggerPropertyDetail(prop.id)
                                    }
                                    className="flex-1 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold font-mono uppercase tracking-wider transition-all shadow cursor-pointer"
                                  >
                                    Details
                                  </button>
                                </div>

                                {currentRole === "owner" && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProperty(prop.id);
                                    }}
                                    className="w-full py-1 bg-red-950/45 hover:bg-red-900/65 border border-red-900/50 text-red-300 rounded-lg text-[9px] font-bold font-mono uppercase transition-all tracking-wide cursor-pointer text-center"
                                  >
                                    🗑️ Delete Listing
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : viewMode === "map" ? (
              /* High intensity Map bounds projection screen (SR-02, US-01) */
              <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-entrance-3d-effect"
                id="seekers-map-split"
              >
                <div className="lg:col-span-2">
                  <InteractiveMap
                    properties={filteredProperties}
                    selectedPropertyId={selectedPropertyId}
                    onSelectProperty={(id) => triggerPropertyDetail(id)}
                    onFilterByPolygon={(ids) => setLassoFilteredIds(ids)}
                  />
                </div>

                {/* Embedded quick check view */}
                <div
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                  id="map-quick-guide"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] text-blue-400 font-bold tracking-widest font-mono uppercase">
                      Map Projection HUD
                    </span>
                    <h5 className="font-bold text-white text-xs">
                      How to use Map Coordinates:
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      1. Click &quot;Draw Search Area&quot; in the map header.
                      <br />
                      2. Draw a complete loop on the grid to bind coordinating
                      plots.
                      <br />
                      3. Properties within bounds are selected immediately
                      below!
                      <br />
                      4. Hover on coordinates markers to preview luxury
                      highlights.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Master Grid Catalog presentation (Grid Only) */
              <div
                className="space-y-4 animate-entrance-3d-effect"
                id="seekers-catalog"
              >
                {/* Active results count row and Saved Searches index drawer */}
                <div
                  className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-900 pb-2"
                  id="seekers-counters-drawer"
                >
                  <span className="font-semibold text-slate-400">
                    Showing{" "}
                    <strong className="text-white">
                      {sortedProperties.length}
                    </strong>{" "}
                    matching premium properties
                  </span>

                  {savedSearches.length > 0 && (
                    <div
                      className="flex items-center gap-1.5"
                      id="saved-searches-drawer"
                    >
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                        My Saved Searches:
                      </span>
                      {savedSearches.slice(0, 3).map((sv) => (
                        <button
                          key={sv.id}
                          onClick={() => applySavedSearch(sv)}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 hover:text-white text-[10px] border border-slate-800 text-slate-350 transition-colors font-mono cursor-pointer"
                          id={`saved-query-${sv.id}`}
                        >
                          🏙️ {sv.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Empty check */}
                {sortedProperties.length === 0 ? (
                  <div
                    className="text-center p-12 bg-slate-900/40 border border-slate-800 rounded-3xl"
                    id="seekers-search-empty"
                  >
                    <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm text-slate-450 font-semibold">
                      Zero Matching Listings found
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Your advanced parameters are too constrained. Try
                      resetting filters to reload.
                    </p>
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    id="seekers-results-grid"
                  >
                    {sortedProperties.map((prop) => {
                      const isSaved = userProfile.savedProperties.includes(
                        prop.id,
                      );
                      const isCompare = comparisonPropertyIds.includes(prop.id);

                      return (
                        <div
                          key={prop.id}
                          className="bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadowIndex group flex flex-col justify-between hover-perspective-card"
                          id={`property-card-${prop.id}`}
                        >
                          {/* Photo Block */}
                          <div className="relative h-48 bg-slate-950 overflow-hidden">
                            <img
                              src={prop.photos[0]}
                              alt={prop.title}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 cursor-pointer"
                              onClick={() => triggerPropertyDetail(prop.id)}
                            />

                            {/* Promoted / Featured badge indexer */}
                            {(prop.isPromoted || prop.isFeatured) && (
                              <span
                                className={`absolute top-2.5 left-2.5 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-lg flex items-center gap-1 ${
                                  prop.isFeatured
                                    ? "bg-amber-400 border border-amber-300 animate-pulse"
                                    : "bg-blue-400 border border-blue-300"
                                }`}
                              >
                                ★{" "}
                                {prop.isFeatured
                                  ? "FEATURED"
                                  : prop.promotionType?.toUpperCase() ||
                                    "PROMOTED"}
                              </span>
                            )}

                            {/* Status Badge overlay */}
                            <span
                              className={`absolute bottom-2.5 left-2.5 backdrop-blur-md shadow-lg font-bold font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                                prop.status === "active"
                                  ? "bg-emerald-950/90 text-emerald-400 border-emerald-900/60"
                                  : prop.status === "pending"
                                    ? "bg-amber-950/90 text-amber-400 border-amber-900/60"
                                    : prop.status === "sold"
                                      ? "bg-blue-950/90 text-blue-400 border-blue-900/60"
                                      : prop.status === "rented"
                                        ? "bg-purple-950/90 text-purple-400 border-purple-900/60"
                                        : prop.status === "off-market"
                                          ? "bg-slate-950/90 text-slate-400 border-slate-800"
                                          : "bg-red-950/90 text-red-400 border-red-900/60"
                              }`}
                            >
                              {prop.status === "active" ? "● " : ""}
                              {prop.status}
                            </span>

                            {/* Bookmarks float check */}
                            <button
                              onClick={() => handleToggleFavorite(prop.id)}
                              className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border shadow transition-all ${
                                isSaved
                                  ? "bg-rose-600 text-white border-rose-500 scale-105"
                                  : "bg-slate-950/80 hover:bg-slate-950 text-slate-300 border-slate-800"
                              }`}
                              title="Bookmark item"
                              id={`card-fav-btn-${prop.id}`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                              />
                            </button>

                            {/* Sizing pricing parameters */}
                            <span className="absolute bottom-2.5 right-2.5 bg-slate-950/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-blue-300 font-bold font-mono text-xs shadow-lg">
                              ${prop.price.toLocaleString()}
                              {prop.listingType === "rent" ? "/mo" : ""}
                            </span>
                          </div>

                          {/* Body parameters */}
                          <div
                            className="p-4 space-y-1.5 flex-1 flex flex-col justify-between"
                            id={`card-body-${prop.id}`}
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4
                                  onClick={() => triggerPropertyDetail(prop.id)}
                                  className="font-bold text-white text-sm hover:text-blue-400 cursor-pointer truncate transition-colors pr-1 flex-1 leading-snug tracking-tight font-display"
                                >
                                  {prop.title}
                                </h4>
                                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight bg-slate-950 p-1 px-1.5 rounded font-mono border border-slate-900">
                                  {prop.propertyType}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                                <span>
                                  {prop.address}, {prop.city}
                                </span>
                              </p>

                              <p className="text-xs text-slate-400 line-clamp-2 italic pt-1 flex-1 leading-normal">
                                {prop.description}
                              </p>
                            </div>

                            <div
                              className="pt-3.5 space-y-2.5 border-t border-slate-950 mt-3"
                              id={`card-footer-triggers-${prop.id}`}
                            >
                              {/* Standard specs */}
                              <div className="bg-slate-950/60 p-2 rounded-lg flex justify-between text-[11px] font-mono text-slate-350 border border-slate-900/60">
                                <span>{prop.bedrooms} Bed</span>
                                <span>{prop.bathrooms} Bath</span>
                                <span>
                                  {prop.sizeSqFt.toLocaleString()} sqft
                                </span>
                              </div>

                              {/* Matrix trigger compare & view catalog details */}
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCompare(prop.id)}
                                    className={`flex-1 py-1.5 rounded-lg border border-slate-800 text-[10px] font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                      isCompare
                                        ? "bg-blue-600 border-blue-500 text-white"
                                        : "bg-slate-950/80 hover:bg-slate-955 hover:border-slate-700 text-slate-300"
                                    }`}
                                    id={`card-compare-btn-${prop.id}`}
                                  >
                                    {isCompare ? "In Comparison" : "Compare"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      triggerPropertyDetail(prop.id)
                                    }
                                    className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold font-mono uppercase tracking-wider transition-all shadow cursor-pointer"
                                    id={`card-details-btn-${prop.id}`}
                                  >
                                    Details
                                  </button>
                                </div>

                                {currentRole === "owner" && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProperty(prop.id);
                                    }}
                                    className="w-full py-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-900/50 text-red-300 rounded-lg text-[10px] font-bold font-mono uppercase transition-all tracking-wide cursor-pointer text-center"
                                  >
                                    🗑️ Delete Listing (Seller Tool)
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Side note workspace block for favorited items (UE-01) */}
            {userProfile.savedProperties.length > 0 && (
              <div
                className="bg-slate-900/50 rounded-3xl p-5 border border-slate-800 space-y-4"
                id="notes-persistency-desk"
              >
                <div id="notes-label">
                  <span className="text-xs text-blue-400 font-mono uppercase tracking-widest font-bold">
                    Personal Workspace
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">
                    My Favorited Private Notes
                  </h3>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  id="fav-notes-grid"
                >
                  {properties
                    .filter((p) => userProfile.savedProperties.includes(p.id))
                    .map((fav) => (
                      <div
                        key={fav.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] text-blue-400 font-bold">
                            {fav.title}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">
                            My personal comments:
                          </p>
                          <p className="text-[11px] text-slate-300 leading-normal italic">
                            &quot;
                            {userProfile.notesOnProperties[fav.id] ||
                              "No notes currently stored for this property."}
                            &quot;
                          </p>
                        </div>

                        {/* Edit private notes input */}
                        <div className="flex gap-2 pt-2 border-t border-slate-900">
                          <input
                            type="text"
                            placeholder="Update private note..."
                            value={tempNoteText[fav.id] || ""}
                            onChange={(e) =>
                              setTempNoteText({
                                ...tempNoteText,
                                [fav.id]: e.target.value,
                              })
                            }
                            className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10px] focus:outline-none focus:border-blue-500 text-white flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              updatePersonalNote(
                                fav.id,
                                tempNoteText[fav.id] || "",
                              );
                              setTempNoteText({
                                ...tempNoteText,
                                [fav.id]: "",
                              });
                            }}
                            className="p-1 px-3 rounded bg-slate-900 border border-slate-800 text-[10px] hover:text-white"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Comparative side-by-side Matrix anchors block (UE-02, US-03) */}
            <div
              className="pt-6 border-t border-slate-900"
              id="comparison-matrix-anchor"
            >
              <span className="text-xs text-blue-400 font-mono uppercase tracking-widest block font-bold mb-3">
                Feature Comparison Cockpit
              </span>
              <PropertyCompare
                properties={properties.filter((p) =>
                  comparisonPropertyIds.includes(p.id),
                )}
                onRemoveFromCompare={(id) => handleToggleCompare(id)}
                onSelectProperty={(id) => triggerPropertyDetail(id)}
              />
            </div>
          </div>
        )}

        {/* Swappable Workspace B: PROPERTY OWNER PORTAL (LM-01 - LM-11, US-05 - US-07) */}
        {currentRole === "owner" && (
          <div className="space-y-6" id="owner-workspace">
            <div
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              id="owner-summary-header"
            >
              <div className="space-y-1">
                <span className="text-xs text-blue-400 font-mono uppercase tracking-widest font-bold">
                  Seller hub workspace
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Post &amp; Track Private Real Estate
                </h2>
                <p className="text-xs text-slate-400 max-w-xl">
                  Register details, upload mock picture streams, set leasing
                  status updates, or analyze listing views.
                </p>
              </div>

              <div className="flex gap-2" id="owner-quick-triggers">
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(true)}
                  className="p-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white text-xs font-mono uppercase tracking-wider shadow-lg flex items-center gap-1.5"
                  id="create-new-listing-trigger"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>List New Property</span>
                </button>
              </div>
            </div>

            {/* Display Creation Form Wizard if toggled */}
            {isCreatingListing || editingProperty ? (
              <div id="listing-wizard-container">
                <ListingForm
                  agents={agents}
                  onPublish={handlePostProperty}
                  editingProperty={editingProperty}
                  onCancel={() => {
                    setEditingProperty(null);
                    setIsCreatingListing(false);
                  }}
                />
              </div>
            ) : (
              /* Display Owner portfolios */
              <div className="space-y-6" id="owner-portfolio-grid">
                {/* Visual statistics on properties owned */}
                <div
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                  id="owners-portfolio-highlights"
                >
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    My Active Listings performance summary
                  </span>

                  <div
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    id="owned-metrics-panel"
                  >
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="text-slate-400 text-xs">
                        Platform Page Views
                      </span>
                      <p className="text-white text-2xl font-black mt-1">
                        1,910 views
                      </p>
                      <p className="text-[10px] text-emerald-400 mt-1 font-mono">
                        +12.4% vs last week
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="text-slate-400 text-xs">
                        Total client saves
                      </span>
                      <p className="text-white text-2xl font-black mt-1">
                        362 bookmarked
                      </p>
                      <p className="text-[10px] text-blue-400 mt-1 font-mono">
                        Average item: 42 saves
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
                      <span className="text-slate-400 text-xs">
                        Pending tour Requests
                      </span>
                      <p className="text-white text-2xl font-black mt-1">
                        {inquiries.length} requests
                      </p>
                      <p className="text-[10px] text-amber-500 mt-1 font-mono">
                        100% Client Response rate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subheading client listings catalog */}
                <div className="space-y-4" id="owned-listings-catalog-grid">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    My properties listings ({properties.length})
                  </h4>

                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    id="owned-cards-grid"
                  >
                    {properties.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover-perspective-card"
                        id={`owned-item-${p.id}`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.photos[0]}
                            className="w-20 h-20 rounded-lg object-cover border border-slate-800"
                          />
                          <div>
                            <h5 className="font-bold text-white text-xs leading-normal">
                              {p.title}
                            </h5>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {p.address} &bull; {p.city}
                            </p>
                            <p className="text-blue-400 font-bold text-[11px] font-mono mt-1">
                              ${p.price.toLocaleString()}
                            </p>

                            <div
                              className="flex gap-2 items-center mt-2"
                              id={`owned-tags-row-${p.id}`}
                            >
                              <span
                                className={`px-2 py-0.5 rounded text-[8px] tracking-wider uppercase font-bold border ${
                                  p.status === "active"
                                    ? "bg-emerald-950 text-emerald-400 border-emerald-900/60"
                                    : p.status === "pending"
                                      ? "bg-amber-950 text-amber-400 border-amber-900/60"
                                      : p.status === "sold"
                                        ? "bg-blue-950 text-blue-400 border-blue-900/60"
                                        : p.status === "rented"
                                          ? "bg-purple-950 text-purple-400 border-purple-900/60"
                                          : p.status === "off-market"
                                            ? "bg-slate-900 text-slate-400 border-slate-800"
                                            : "bg-red-950 text-red-400 border-red-900/60"
                                }`}
                              >
                                {p.status}
                              </span>
                              {p.isFeatured && (
                                <span className="bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider font-mono shadow">
                                  ★ FEATURED
                                </span>
                              )}
                              {p.autoRenewBeforeExpiry && (
                                <span
                                  className="text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-800 bg-slate-950 uppercase tracking-wider font-mono"
                                  title="Auto Renewal Active"
                                >
                                  🔄 Auto-Renew
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-mono">
                                Views: {p.views}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive listing management triggers (LM-04, LM-05, LM-06, LM-10) */}
                        <div
                          className="flex flex-col gap-2 justify-center"
                          id={`owned-triggers-${p.id}`}
                        >
                          <button
                            type="button"
                            onClick={() => setEditingProperty(p)}
                            className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg p-1.5 hover:text-white hover:border-slate-700 font-medium transition-colors text-center cursor-pointer"
                            id={`owner-edit-btn-${p.id}`}
                          >
                            Edit Features
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              // Trigger demo price drop
                              triggerDemonstrationPriceDrop(p.id);
                              alert(
                                "Demonstration price drop registered under local state, notifications dispatched!",
                              );
                            }}
                            className="bg-amber-950/20 text-xs text-amber-400 border border-amber-900/40 rounded-lg p-1 text-center cursor-pointer hover:bg-amber-900/30 transition-colors"
                            id={`owner-drop-price-btn-${p.id}`}
                            title="Demonstrate dynamic price drop alert features"
                          >
                            Demo Price Drop
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(p.id)}
                            className="bg-red-950/40 hover:bg-red-900/60 text-xs text-red-300 border border-red-900/40 rounded-lg p-1.5 font-bold transition-all text-center cursor-pointer"
                            id={`owner-delete-btn-${p.id}`}
                          >
                            Delete Listing
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seller Trust & Anti-Scam Ratings dashboard (US-06) */}
                <div
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  id="owner-reputation-metrics"
                >
                  <div
                    className="flex items-center justify-between border-b border-slate-800/60 pb-3"
                    id="owner-rep-header"
                  >
                    <div>
                      <span className="text-[10px] text-amber-500 font-mono uppercase tracking-widest block font-bold">
                        Verified Landlord Reputation Certificate
                      </span>
                      <h4 className="text-white font-black text-sm tracking-tight">
                        My Public Trust Grade & Anti-Scam Verification
                      </h4>
                    </div>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold rounded-full uppercase shrink-0">
                      ★ Active Trust Score: 4.95 / 5.0
                    </span>
                  </div>

                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    id="rep-benchmarks-grid"
                  >
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold font-mono block">
                        Scam Audit Status
                      </span>
                      <p className="text-emerald-400 font-bold text-xs">
                        🛡️ 100% SECURED
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        County deed registries successfully cross-checked with
                        official land records.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold font-mono block">
                        Image Authenticity
                      </span>
                      <p className="text-blue-400 font-bold text-xs">
                        📸 PHOTO-VERIFIED
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        No stock photos or outdated images. Preview assets
                        checked by site audits.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-1">
                      <span className="text-slate-500 text-[10px] uppercase font-bold font-mono block">
                        Dispute Resolution
                      </span>
                      <p className="text-purple-400 font-bold text-xs">
                        🤝 TRUSTED PARTNER
                      </p>
                      <p className="text-[10px] text-slate-400 leading-normal font-sans">
                        Zero formal reports or complaints from property seekers
                        since joining.
                      </p>
                    </div>
                  </div>

                  {/* Customer Testimonials stream (US-06) */}
                  <div
                    className="space-y-2.5 pt-2"
                    id="verified-testimonials-stack"
                  >
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                      Verified Buyer & Tenant Reviews (3):
                    </span>
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      id="testimonials-list"
                    >
                      {[
                        {
                          author: "Alice M.",
                          text: "Pristine listing experience. The coordinates and floor designs matched the physical house perfectly. Highly responsive landlord!",
                          stars: "★★★★★",
                        },
                        {
                          author: "Ken T.",
                          text: "George provided the authentic county tax paperwork promptly. Absolutely zero scam concern! Fully recommend to any relocation seekers.",
                          stars: "★★★★☆",
                        },
                        {
                          author: "Marcus V.",
                          text: "Clean and direct interaction. Secured the Marina Heights glass penthouse in 3 days. PropFind guard verified his ownership badge.",
                          stars: "★★★★★",
                        },
                      ].map((t, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-850/60 text-xs"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-200">
                              {t.author}
                            </span>
                            <span className="text-amber-500 font-mono text-[9px] font-extrabold">
                              {t.stars}
                            </span>
                          </div>
                          <p className="text-slate-400 italic text-[11px] leading-relaxed">
                            &quot;{t.text}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Swappable Workspace C: REAL ESTATE BROKER CRM PORTAL (LD-01 - LD-08, AG-01 - AG-07) */}
        {currentRole === "agent" && (
          <div className="space-y-6" id="agent-workspace">
            {/* Agent Header dashboard */}
            <div
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              id="agents-context-header"
            >
              <div className="space-y-1">
                <span className="text-xs text-amber-500 font-mono uppercase tracking-widest font-bold">
                  Broker Core Workspace
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Vanguard Brokerage Platform
                </h2>
                <p className="text-xs text-slate-400 max-w-xl">
                  Inspect client leads, configure chat correspondence, approve
                  tours calendars, or boost asset visibility listings.
                </p>
              </div>

              {/* Show active broker stats summaries (AG-07) */}
              <div
                className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-center self-start sm:self-auto"
                id="agents-performance-badge-view"
              >
                <span className="text-[9px] tracking-wider text-slate-500 uppercase font-bold font-mono block">
                  Aggregate Agency Performance
                </span>
                <div
                  className="flex gap-4 mt-1 font-mono"
                  id="ag-aggregate-metrics"
                >
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Sold:
                    </span>
                    <strong className="text-white text-xs">
                      {INITIAL_AGENTS[0].performance.propertiesSold} items
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Response:
                    </span>
                    <strong className="text-emerald-400 text-xs">
                      {INITIAL_AGENTS[0].performance.responseRate}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* CRM Cockpit & Inbox (LD-01) */}
            <div className="space-y-3" id="crm-desktop-nest">
              <span className="text-xs text-blue-400 font-mono uppercase tracking-widest block font-bold">
                Broker leads CRM Cockpit
              </span>
              <InboxChat
                inquiries={inquiries}
                properties={properties}
                onUpdateInquiry={handleUpdateInquiry}
                currentRole="agent"
              />
            </div>

            {/* Listing Booster promotion packages workflow screen (LM-10, US-10) */}
            <div
              className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4"
              id="listing-boosts-section"
            >
              <div id="booster-caption">
                <span className="text-xs text-blue-400 font-mono uppercase tracking-widest font-bold font-mono">
                  Revenue & Promotion desks
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Promote Premium Real Estate listings
                </h3>
                <p className="text-xs text-slate-400">
                  Increase search reach, place units inside spotlight areas, and
                  verify placement metrics.
                </p>
              </div>

              {activePromotedPropertyId ? (
                /* Boost payment form setup */
                <form
                  onSubmit={handleApplyPromotion}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4 max-w-lg"
                  id="promotion-checkout-form"
                >
                  <span className="text-[10px] text-amber-500 font-bold uppercase font-mono tracking-wider">
                    Configure Promotional Placement Checkout
                  </span>

                  <div
                    className="grid grid-cols-2 gap-3 text-xs"
                    id="boost-form-selections"
                  >
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Duration Period
                      </label>
                      <select
                        value={promotionDuration}
                        onChange={(e) =>
                          setPromotionDuration(Number(e.target.value))
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 font-mono text-white focus:outline-none"
                      >
                        <option value={7}>7 Days Duration</option>
                        <option value={14}>14 Days Duration</option>
                        <option value={30}>30 Days Duration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Exposure Level
                      </label>
                      <select
                        value={selectedPromotionType}
                        onChange={(e) =>
                          setSelectedPromotionType(e.target.value as any)
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white focus:outline-none"
                      >
                        <option value="featured">Featured placement</option>
                        <option value="spotlight">Spotlight banner</option>
                        <option value="premium">Elite premium tier</option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="bg-slate-900 p-2.5 rounded text-[11px] font-mono flex justify-between border border-slate-850"
                    id="pricing-math-boost"
                  >
                    <span className="text-slate-400">Total charge:</span>
                    <strong className="text-emerald-400">
                      $
                      {promotionDuration *
                        (selectedPromotionType === "premium" ? 15 : 8)}{" "}
                      USD
                    </strong>
                  </div>

                  {showPromoteFeedback && (
                    <p className="text-xs text-emerald-400 bg-emerald-950 p-2 rounded text-center animate-pulse">
                      {showPromoteFeedback}
                    </p>
                  )}

                  <div
                    className="flex gap-2 justify-end text-xs"
                    id="boost-actions-checkout"
                  >
                    <button
                      type="button"
                      onClick={() => setActivePromotedPropertyId(null)}
                      className="px-3 py-1.5 text-slate-400 hover:text-white"
                    >
                      Cancel Checkout
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-1.5 rounded-lg"
                    >
                      Authorize Payment (Simulated Checkout)
                    </button>
                  </div>
                </form>
              ) : (
                /* Select property listing for promo placement */
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  id="eligible-promo-listings"
                >
                  {properties.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center gap-4"
                    >
                      <div>
                        <h6 className="text-xs font-bold text-white leading-normal">
                          {p.title}
                        </h6>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Region: {p.city} &bull; ${p.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleConfigPromotion(p.id)}
                        className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-900 hover:border-blue-500 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                        id={`promote-spot-trigger-${p.id}`}
                      >
                        Boost Spot
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Swappable Workspace D: PLATFORM MODERATOR & ADMIN DESK (AD-01 - AD-08, US-11 - US-12) */}
        {currentRole === "admin" && (
          <div className="space-y-6" id="admin-workspace-pane">
            <AdminPanel
              properties={properties}
              agents={agents}
              reportedListings={reportedListings}
              inquiries={inquiries}
              supportTickets={supportTickets}
              onApproveProperty={handleApprovePendingProperty}
              onModifyPropertyStatus={handleModifyPropertyStatus}
              onVerifyAgent={handleVerifyAgentBadge}
              onReviewReport={handleModeratorReportAction}
              onSuspendUser={handleSuspendAccount}
              onReplyTicket={handleAdminReplyTicket}
            />
          </div>
        )}
      </main>

      {/* Shared Modals Area: Curated Detail Viewers (US-02, US-04) */}
      {selectedPropertyId &&
        (() => {
          const matchedProp = properties.find(
            (p) => p.id === selectedPropertyId,
          );
          if (!matchedProp) return null;
          const matchedAgent =
            agents.find((ag) => ag.id === matchedProp.agentId) || agents[0];

          return (
            <PropertyDetailModal
              property={matchedProp}
              agent={matchedAgent}
              similarProperties={getSimilarPropertiesFor(matchedProp)}
              onClose={() => setSelectedPropertyId(null)}
              onToggleFavorite={(id) => handleToggleFavorite(id)}
              isFavorited={userProfile.savedProperties.includes(matchedProp.id)}
              isInCompare={comparisonPropertyIds.includes(matchedProp.id)}
              onToggleCompare={(id) => handleToggleCompare(id)}
              onSendInquiry={handleSendInquiry}
              currentRole={currentRole}
              onReportListing={(reason, details) =>
                handleCreateFraudReport(matchedProp.id, reason, details)
              }
            />
          );
        })()}

      {/* Auth Modal overlay (US-08) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authFormMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthenticate={handleAuthenticateUser}
        />
      )}

      {/* Support Chatbot Floating Agent (US-09) */}
      <SupportChatbot
        userEmail={userProfile.email}
        userName={userProfile.name}
        userRole={currentRole}
        isAuthenticated={isAuthenticated}
        activeTicketMessages={
          supportTickets.find((t) => t.userEmail === userProfile.email)
            ?.messages || [
            {
              sender: "bot",
              text: "Hello! I am PropFind Guard, your automatic Trust & Safety desk. Ask any question or report duplicate listings to get admin assistance!",
              timestamp: new Date().toISOString(),
            },
          ]
        }
        onSendMessage={handleUserSendSupportMessage}
        isOpen={isChatbotOpen}
        setIsOpen={setIsChatbotOpen}
        onOpenAuth={() => {
          setAuthIntendedAction(null);
          setAuthFormMode("signin");
          setIsAuthModalOpen(true);
        }}
      />

      {/* Admin Passcode Terminal Gate (AD-02) */}
      {isAdminLockScreenVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
          id="staff-lockscreen-overlay"
        >
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsAdminLockScreenVisible(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
                <ShieldCheck className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-white font-black text-sm uppercase tracking-wider font-mono">
                Decryption Staff Challenge
              </h3>
              <p className="text-[10px] text-slate-400 font-sans">
                Verification key is required to render active Moderator tickets.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[8px] text-slate-500 uppercase font-bold font-mono">
                  Administrative Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={enteredPasscode}
                  onChange={(e) => {
                    setEnteredPasscode(e.target.value);
                    setPasscodeError("");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-white font-mono placeholder-slate-800 focus:outline-none focus:border-amber-500 text-xs mt-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (enteredPasscode === "admin123") {
                        setIsAuthenticated(true);
                        setUserProfile({
                          ...userProfile,
                          name: "Platform Moderator Staff",
                          email: "admin@propfind.com",
                          role: "admin",
                        });
                        setCurrentRole("admin");
                        setIsAdminLockScreenVisible(false);
                      } else {
                        setPasscodeError(
                          "Decryption failure: Invalid staff passcode key",
                        );
                      }
                    }
                  }}
                />
                {passcodeError && (
                  <p className="text-[9px] text-red-400 mt-1 font-mono text-center">
                    {passcodeError}
                  </p>
                )}
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-center text-[9px] text-slate-500 font-mono">
                Hint: Enter{" "}
                <code className="text-amber-400 font-bold">admin123</code> to
                authenticate Supervisor credentials.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPasscode("admin123");
                    setPasscodeError("");
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2 rounded-lg text-[10px] font-mono uppercase cursor-pointer"
                >
                  ⚡ Code Auto-fill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (enteredPasscode === "admin123") {
                      setIsAuthenticated(true);
                      setUserProfile({
                        ...userProfile,
                        name: "Platform Moderator Staff",
                        email: "admin@propfind.com",
                        role: "admin",
                      });
                      setCurrentRole("admin");
                      setIsAdminLockScreenVisible(false);
                    } else {
                      setPasscodeError(
                        "Decryption failure: Invalid staff passcode key",
                      );
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-[10px] font-mono uppercase cursor-pointer"
                >
                  Verify Term
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform shared footer */}
      <footer
        className="bg-slate-900 border-t border-slate-800 p-6 mt-12 text-xs text-slate-500 font-mono"
        id="platform-global-footer"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="order-2 md:order-1">
            &copy; 2026 PropFind Real Estate Inc. All rights reserved.
          </p>
          <div
            className="flex flex-wrap gap-4 order-1 md:order-2 text-[11px] items-center"
            id="policy-links"
          >
            <span className="hover:text-white cursor-pointer">
              Security Audits
            </span>
            <span className="hover:text-white cursor-pointer">
              Listing Guidelines
            </span>
            <span className="hover:text-white cursor-pointer">
              Broker license terms
            </span>
            <button
              onClick={() => {
                setIsAdminLockScreenVisible(true);
                setEnteredPasscode("");
                setPasscodeError("");
              }}
              className="text-[10px] bg-slate-950 hover:bg-slate-850 text-amber-500 hover:text-amber-400 font-bold border border-slate-850 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-all"
            >
              🔒 Staff Gateway Office
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
