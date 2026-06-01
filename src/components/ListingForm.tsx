import React, { useState, useEffect } from "react";
import { Property, Agent } from "../types";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  Home,
  Eye,
  Sparkles,
  MapPin,
  DollarSign,
  Image,
  X,
  Play,
  Video,
  CreditCard,
  Calendar,
  RotateCcw,
  ShieldCheck,
  Info,
} from "lucide-react";

interface ListingFormProps {
  agents: Agent[];
  currentAgentId?: string;
  onPublish: (property: Property) => void;
  editingProperty?: Property | null;
  onCancel: () => void;
}

// Pre-packaged Unsplash architectural images for streamlined mock upload selection
const PRE_VETTED_PHOTOS = [
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
];

const AVAILABLE_AMENITIES = [
  "Swimming Pool",
  "Infinity Pool",
  "Smart Automation",
  "Wine Cellar",
  "Elevator",
  "Private Gym",
  "Steam Shower",
  "Walk-in Closets",
  "Private Boat Slip",
  "Timber Architecture",
  "Thermal Outdoor Pool",
  "Rooftop Lounge",
  "24/7 Gated Security",
];

export default function ListingForm({
  agents,
  currentAgentId,
  onPublish,
  editingProperty,
  onCancel,
}: ListingFormProps) {
  const [step, setStep] = useState<number>(1);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Core Form attributes
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [listingType, setListingType] = useState<"buy" | "rent" | "lease">(
    "buy",
  );
  const [propertyType, setPropertyType] = useState<
    "house" | "apartment" | "condo" | "land" | "commercial" | "office"
  >("house");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Marina Heights");
  const [zipCode, setZipCode] = useState("");
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2.5);
  const [sizeSqFt, setSizeSqFt] = useState<number | "">("");
  const [lotSize, setLotSize] = useState("0.25 Acres");
  const [yearBuilt, setYearBuilt] = useState<number>(2024);
  const [parkingSpaces, setParkingSpaces] = useState<number>(2);
  const [floors, setFloors] = useState<number>(2);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([PRE_VETTED_PHOTOS[0]]);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Listing statuses & Promotion states
  const [status, setStatus] = useState<
    "active" | "pending" | "sold" | "rented" | "off-market" | "expired"
  >("active");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [autoRenewBeforeExpiry, setAutoRenewBeforeExpiry] =
    useState<boolean>(false);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // Simulated Payment Checkout states
  const [paymentCardNumber, setPaymentCardNumber] = useState("");
  const [paymentCardName, setPaymentCardName] = useState("Chibuike Eseagwu");
  const [paymentCardExpiry, setPaymentCardExpiry] = useState("08/29");
  const [paymentCardCvv, setPaymentCardCvv] = useState("360");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Custom uploaded photos state (holds local base64 or custom images)
  const [customUploadedFiles, setCustomUploadedFiles] = useState<string[]>([]);

  // Hydrate form in edit mode
  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setDescription(editingProperty.description);
      setPrice(editingProperty.price);
      setListingType(editingProperty.listingType);
      setPropertyType(editingProperty.propertyType);
      setAddress(editingProperty.address);
      setCity(editingProperty.city);
      setZipCode(editingProperty.zipCode);
      setBedrooms(editingProperty.bedrooms);
      setBathrooms(editingProperty.bathrooms);
      setSizeSqFt(editingProperty.sizeSqFt || "");
      setLotSize(editingProperty.lotSize || "N/A");
      setYearBuilt(editingProperty.yearBuilt);
      setParkingSpaces(editingProperty.parkingSpaces);
      setFloors(editingProperty.floors);
      setAmenities(editingProperty.amenities);
      setPhotos(editingProperty.photos);
      setVideoUrl(editingProperty.videoUrl || "");
      setSelectedAgentId(editingProperty.agentId);
      setStatus(editingProperty.status || "active");
      setExpiryDate(
        editingProperty.expiryDate ||
          (() => {
            const d = new Date();
            d.setDate(d.getDate() + 30);
            return d.toISOString().split("T")[0];
          })(),
      );
      setAutoRenewBeforeExpiry(!!editingProperty.autoRenewBeforeExpiry);
      setIsFeatured(!!editingProperty.isFeatured);
      setPaymentSuccess(!!editingProperty.isFeatured);
    } else {
      setSelectedAgentId(currentAgentId || agents[0]?.id || "");
      setPhotos([PRE_VETTED_PHOTOS[0]]);
      setVideoUrl("");
      setStatus("active");
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setExpiryDate(d.toISOString().split("T")[0]);
      setAutoRenewBeforeExpiry(false);
      setIsFeatured(false);
      setPaymentSuccess(false);
    }
  }, [editingProperty, currentAgentId, agents]);

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleDragPhotoSelect = (url: string) => {
    if (photos.includes(url)) {
      setPhotos(photos.filter((p) => p !== url));
    } else {
      setPhotos([...photos, url]);
    }
  };

  // --- Photo Reordering Draggable Engine ---
  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setDraggingIndex(index);
  };

  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePhotoDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIdxStr = e.dataTransfer.getData("text/plain");
    if (!sourceIdxStr) return;
    const sourceIndex = parseInt(sourceIdxStr, 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    setPhotos(reordered);
    setDraggingIndex(null);
  };

  // --- Real File Drag-and-Drop / Upload Processing ---
  const handlePhotoFilesDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as File[];
    processPhotoFiles(files);
  };

  const handlePhotoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      processPhotoFiles(files);
    }
  };

  const processPhotoFiles = (files: File[]) => {
    files.forEach((file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && typeof event.target.result === "string") {
            const dataUrl = event.target.result;
            setPhotos((prev) => [...prev, dataUrl]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // --- Video File Upload Processing ---
  const handleVideoFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files) as File[];
    const videoFile = files.find((f: File) => f.type.startsWith("video/"));
    if (videoFile) {
      processVideoFile(videoFile);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const processVideoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === "string") {
        setVideoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !address) {
      alert("Please fill out all mandatory attributes.");
      return;
    }

    const payload: Property = {
      id: editingProperty?.id || `prop-${Date.now()}`,
      title,
      description: description || "No summary highlights provided.",
      price: Number(price),
      listingType,
      propertyType,
      address,
      city,
      zipCode: zipCode || "90210",
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sizeSqFt: Number(sizeSqFt) || 2000,
      lotSize: lotSize || "0.2 Acres",
      yearBuilt: Number(yearBuilt) || 2024,
      parkingSpaces: Number(parkingSpaces),
      floors: Number(floors),
      amenities:
        amenities.length > 0 ? amenities : ["Central AC", "Smart System"],
      photos: photos.length > 0 ? photos : [PRE_VETTED_PHOTOS[0]],
      videoUrl: videoUrl || undefined,
      agentId: selectedAgentId || agents[0]?.id || "agent-1",
      isFeatured: isFeatured,
      status: status,
      expiryDate: expiryDate || undefined,
      autoRenewBeforeExpiry: autoRenewBeforeExpiry,
      views: editingProperty ? editingProperty.views : 12,
      saves: editingProperty ? editingProperty.saves : 2,
      inquiryCount: editingProperty ? editingProperty.inquiryCount : 0,
      walkScore: editingProperty ? editingProperty.walkScore : 72,
      transitScore: editingProperty ? editingProperty.transitScore : 84,
      schoolRating: editingProperty ? editingProperty.schoolRating : 8,
      lat: editingProperty ? editingProperty.lat : 100 + Math.random() * 200,
      lng: editingProperty ? editingProperty.lng : 100 + Math.random() * 200,
      createdDate: editingProperty
        ? editingProperty.createdDate
        : new Date().toISOString().split("T")[0],
      priceHistory: editingProperty
        ? [
            ...editingProperty.priceHistory,
            {
              date: new Date().toISOString().split("T")[0],
              price: Number(price),
            },
          ]
        : [
            {
              date: new Date().toISOString().split("T")[0],
              price: Number(price),
            },
          ],
    };

    onPublish(payload);
  };

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100"
      id="property-wizard-form"
    >
      {/* Wizard Header bar */}
      <div
        className="p-5 bg-slate-950 border-b border-slate-800 flex justify-between items-center"
        id="wizard-bar"
      >
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest font-mono">
            {editingProperty
              ? "Edit Property Registry"
              : "Publish Property Listing"}
          </span>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5 mt-0.5">
            <Home className="w-5 h-5 text-blue-500" />
            <span>
              {editingProperty ? `Update: ${title}` : "List Your Real Estate"}
            </span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            id="wizard-preview-toggle"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>
              {isPreviewMode ? "View Form Editor" : "Instant Web Preview"}
            </span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold border border-transparent hover:border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
            id="wizard-cancel"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Steps Visual Progress Tracker */}
      {!isPreviewMode && (
        <div
          className="px-5 py-3.5 bg-slate-900/60 border-b border-slate-800 flex justify-between text-xs font-mono"
          id="wizard-progress-bar"
        >
          {[
            { nr: 1, label: "Base Specs" },
            { nr: 2, label: "Dimensions" },
            { nr: 3, label: "Media & Features" },
            { nr: 4, label: "Status & Promos" },
          ].map((s) => (
            <div
              key={s.nr}
              className={`flex items-center gap-2 ${step > s.nr ? "text-blue-400 font-bold" : step === s.nr ? "text-white font-bold" : "text-slate-600"}`}
              id={`progress-step-${s.nr}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step > s.nr
                    ? "bg-blue-950 border border-blue-400"
                    : step === s.nr
                      ? "bg-blue-600 text-white"
                      : "bg-slate-950 border border-slate-800"
                }`}
              >
                {step > s.nr ? "✓" : s.nr}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {isPreviewMode ? (
        /* Instant Live Mock Web Preview Output */
        <div className="p-6 bg-slate-950" id="live-preview-workspace">
          <div className="max-w-md mx-auto bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="relative h-48 bg-slate-800">
              <img
                src={photos[0] || PRE_VETTED_PHOTOS[0]}
                alt="Preview First"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg">
                For {listingType}
              </span>
              <span className="absolute bottom-2.5 right-2 rounded-lg bg-slate-950/90 backdrop-blur-sm px-2 py-1 text-blue-300 font-bold font-mono text-xs shadow-lg">
                ${price ? Number(price).toLocaleString() : "0"}
                {listingType === "rent" ? "/mo" : ""}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm tracking-tight truncate line-clamp-1 flex-1 pr-2">
                  {title || "Untitled Sovereign Listing Title"}
                </h4>
                <span className="text-[10px] text-slate-400 bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 uppercase font-mono font-bold tracking-tight">
                  {propertyType}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {address || "Plot 4, Emerald Vista High Road"}, {city}
                </span>
              </p>

              <p className="text-xs text-slate-400 line-clamp-2 italic pt-1 mb-2">
                {description ||
                  "Provide detailed rich text highlights within step 1 of the builder."}
              </p>

              <div className="bg-slate-950/50 rounded-lg p-2 flex justify-between text-[11px] font-mono font-medium text-slate-300 border border-slate-900 mt-2">
                <span>{bedrooms} Beds</span>
                <span>{bathrooms} Baths</span>
                <span>{sizeSqFt || 1800} sqft</span>
              </div>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {amenities.map((am) => (
                    <span
                      key={am}
                      className="text-[9px] bg-blue-950 border border-blue-900/40 text-blue-300 px-1.5 py-0.5 rounded-md font-medium"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-500 font-mono mt-4">
            * This displays a streamlined card rendering representation for
            property seekers.
          </p>
        </div>
      ) : (
        /* Real editor Form Steps content */
        <form
          onSubmit={handleFormSubmit}
          className="p-6 space-y-6"
          id="wizard-form-data"
        >
          {step === 1 && (
            <div className="space-y-4 animate-fade-in" id="wizard-step-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Listing Identifier Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Skyline Panoramic Luxury Penthouse"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-input-title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Broker Manager Assigned
                  </label>
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-select-agent"
                  >
                    {agents.map((ag) => (
                      <option key={ag.id} value={ag.id}>
                        {ag.name} ({ag.agency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Listing Type
                  </label>
                  <div className="grid grid-cols-3 bg-slate-950 p-1.5 rounded-lg border border-slate-800 mt-1">
                    {(["buy", "rent", "lease"] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setListingType(t)}
                        className={`text-[10px] font-bold py-1.5 rounded-md uppercase tracking-wider font-mono transition-all ${
                          listingType === t
                            ? "bg-blue-600 text-white shadow"
                            : "hover:text-slate-150 text-slate-500"
                        }`}
                        id={`wizard-listing-type-${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Property Category
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-select-property-type"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="land">Develop Land</option>
                    <option value="commercial">Commercial Hub</option>
                    <option value="office">Corporate Office</option>
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sale/Rental Price *
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs">
                      $
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 850000"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 pl-7 py-2.5 text-white focus:outline-none focus:border-blue-500"
                      id="wizard-input-price"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street and lot building coordinates"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-input-address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Market Sector Region
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-select-city"
                  >
                    <option value="Marina Heights">Marina Heights</option>
                    <option value="Downtown Core">Downtown Core</option>
                    <option value="Pine Crest">Pine Crest</option>
                    <option value="Canyon View">Canyon View</option>
                    <option value="Industrial East">Industrial East</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Postal Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="90211"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-input-zipcode"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Listing Overview Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline construction methods, luxury fixtures, surrounding amenities, transit parameters, and lifestyle qualities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1 resize-none"
                  id="wizard-textarea-description"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in"
              id="wizard-step-2"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-bedrooms"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-bathrooms"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Property Size (Sq. Ft.)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2400"
                  value={sizeSqFt}
                  onChange={(e) =>
                    setSizeSqFt(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-sqft"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lot Area Acreage
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0.75 Acres or N/A"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-lotsize"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Year Built
                </label>
                <input
                  type="number"
                  min="1800"
                  max="2027"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                  id="wizard-yearbuilt"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Parking bays
                  </label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-parking"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Floors
                  </label>
                  <input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 mt-1"
                    id="wizard-floors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in" id="wizard-step-3">
              {/* Media simulated photo upload */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300">
                      Property Media Gallery Selection
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Toggle preset architectural items below or perform a
                      direct drag-over-drop of your custom pictures to list them
                      in the active album.
                    </p>
                  </div>
                </div>

                {/* Preset Picker */}
                <div
                  className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-slate-950/20 p-3 rounded-xl border border-slate-850"
                  id="pre-vetted-image-picker"
                >
                  {PRE_VETTED_PHOTOS.map((url, idx) => {
                    const isSelected = photos.includes(url);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleDragPhotoSelect(url)}
                        className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-95 transition-all ${
                          isSelected
                            ? "border-blue-500 ring-2 ring-blue-500/40 opacity-100 scale-102"
                            : "border-slate-800 opacity-60"
                        }`}
                        id={`mock-img-select-${idx}`}
                      >
                        <img
                          src={url}
                          alt={`Preset ${idx}`}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5 stroke-3" />
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1.5 text-[8px] bg-slate-950/80 px-1 rounded text-slate-300 font-mono">
                          Preset {idx + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Real Drag-and-Drop Image Dropzone */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handlePhotoFilesDrop}
                  className="border border-dashed border-slate-850 hover:border-blue-500/50 text-center py-7 rounded-xl bg-slate-950/30 hover:bg-slate-950/50 transition-all cursor-pointer relative group"
                  id="drag-drop-mimic-panel"
                  onClick={() =>
                    document.getElementById("photo-file-picker")?.click()
                  }
                >
                  <input
                    type="file"
                    id="photo-file-picker"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoFilesChange}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 mx-auto text-slate-500 group-hover:text-blue-400 mb-2 transition-colors animate-bounce-slow" />
                  <span className="text-xs text-slate-300 font-medium block">
                    Drag and drop image files here, or{" "}
                    <strong className="text-blue-400 group-hover:underline">
                      browse files
                    </strong>
                  </span>
                  <p className="text-[9px] text-slate-500 mt-1 font-mono">
                    Accepts PNG, JPG, JPEG, WEBP files. Dropped files load
                    instantly.
                  </p>
                </div>

                {/* Active Photo Album (Drag to Reorder) */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Image className="w-3.5 h-3.5 text-blue-400" />
                        <span>
                          Active Listing Gallery ({photos.length} item
                          {photos.length !== 1 ? "s" : ""})
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Hold and drag items below to change their display
                        sequence on the seeker carousel. The first photo will be
                        the Main cover.
                      </p>
                    </div>
                    {photos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setPhotos([])}
                        className="text-[10px] text-red-400 hover:text-red-300 transition-colors bg-red-950/20 px-2 py-0.5 rounded border border-red-900/40 font-mono font-medium cursor-pointer"
                      >
                        CLEAR ALBUM
                      </button>
                    )}
                  </div>

                  {photos.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800/80 rounded-lg">
                      <p className="text-xs text-slate-500 italic">
                        No images in your album. Click preset cards or drop
                        files above to populate.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="grid grid-cols-2 sm:grid-cols-5 gap-3"
                      id="active-gallery-reorder-grid"
                    >
                      {photos.map((url, idx) => {
                        const isDragging = draggingIndex === idx;
                        return (
                          <div
                            key={`${url.substring(0, 30)}-${idx}`}
                            draggable
                            onDragStart={(e) => handlePhotoDragStart(e, idx)}
                            onDragOver={handlePhotoDragOver}
                            onDrop={(e) => handlePhotoDrop(e, idx)}
                            onDragEnd={() => setDraggingIndex(null)}
                            className={`relative aspect-video rounded-lg overflow-hidden border bg-slate-900 group cursor-grab active:cursor-grabbing transition-all ${
                              isDragging
                                ? "border-blue-500 border-dashed opacity-40 scale-95 ring-2 ring-blue-500/20"
                                : "border-slate-800 hover:border-blue-500/50 hover:scale-[1.02] shadow-md"
                            }`}
                            id={`active-photo-${idx}`}
                          >
                            <img
                              src={url}
                              alt={`Catalog thumbnail ${idx}`}
                              className="w-full h-full object-cover select-none pointer-events-none"
                            />

                            {/* Overlay Badge for Title */}
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded select-none text-[8px] bg-slate-950/90 text-blue-400 font-mono font-black border border-slate-850">
                              #{idx + 1} {idx === 0 ? "MAIN" : ""}
                            </span>

                            {/* Remove Trigger */}
                            <button
                              type="button"
                              onClick={() =>
                                setPhotos(photos.filter((_, i) => i !== idx))
                              }
                              className="absolute top-1 right-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-500 text-white p-1 rounded-md shadow-md cursor-pointer"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>

                            {/* Reorder drag handle hint */}
                            <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 py-0.5 text-center text-[7px] text-slate-300 font-mono hidden sm:block pointer-events-none select-none">
                              DRAG TO MOVE
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload property video or link YouTube/Vimeo section */}
              <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload Property Video or Link YouTube/Vimeo</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Provide real video walkthroughs. Paste any public stream
                    link (YouTube / Vimeo) or drag over an MP4/MOV file.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Link stream option */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      Paste Stream URL link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        value={videoUrl.startsWith("data:") ? "" : videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg placeholder-slate-700 text-wrap text-xs pl-3.5 pr-20 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                        id="wizard-video-link-input"
                      />
                      <span className="absolute right-2 top-2 uppercase text-[8px] bg-slate-900 px-2 py-1 rounded text-slate-500 border border-slate-800 font-mono">
                        STREAM LINK
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      We support rendering embedded player windows for YouTube
                      (youtube.com, youtu.be) and Vimeo links.
                    </p>
                  </div>

                  {/* Local video uploader drop zone */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      Or Upload Local MP4 Video Asset
                    </label>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleVideoFileDrop}
                      onClick={() =>
                        document.getElementById("video-file-picker")?.click()
                      }
                      className="border border-dashed border-slate-850 hover:border-blue-500/50 bg-slate-950/20 text-center py-4 rounded-lg cursor-pointer transition-all group relative"
                    >
                      <input
                        type="file"
                        id="video-file-picker"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 mx-auto text-slate-500 group-hover:text-blue-400 mb-1" />
                      <span className="text-[10px] text-slate-300 font-medium block">
                        Drag & Drop Video file, or{" "}
                        <strong className="text-blue-400">Browse</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video Playback Dynamic Preview window */}
                {videoUrl && (
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        WALKTHROUGH MEDIA PREVIEW LOADED
                      </span>
                      <button
                        type="button"
                        onClick={() => setVideoUrl("")}
                        className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        Remove Video
                      </button>
                    </div>

                    <div className="aspect-video relative rounded-lg overflow-hidden bg-black border border-slate-900 shadow">
                      {(() => {
                        // YouTube embed check
                        const ytMatch = videoUrl.match(
                          /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
                        );
                        if (ytMatch && ytMatch[1]) {
                          return (
                            <iframe
                              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                              title="Youtube Live Preview"
                              className="absolute inset-0 w-full h-full border-none"
                              allowFullScreen
                            />
                          );
                        }

                        // Vimeo embed check
                        const vimeoMatch = videoUrl.match(
                          /vimeo\.com\/(?:video\/)?([0-9]+)/i,
                        );
                        if (vimeoMatch && vimeoMatch[1]) {
                          return (
                            <iframe
                              src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                              title="Vimeo Live Preview"
                              className="absolute inset-0 w-full h-full border-none"
                              allowFullScreen
                            />
                          );
                        }

                        // Local video file embed
                        return (
                          <video
                            src={videoUrl}
                            controls
                            muted
                            className="w-full h-full object-cover"
                          />
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-3">
                  Amenities List Features
                </label>
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                  id="amenities-wizard-checklist"
                >
                  {AVAILABLE_AMENITIES.map((am) => {
                    const hasAm = amenities.includes(am);
                    return (
                      <div
                        key={am}
                        onClick={() => toggleAmenity(am)}
                        className={`p-2.5 rounded-lg border text-[11px] font-semibold cursor-pointer select-none transition-all flex items-center justify-between ${
                          hasAm
                            ? "bg-blue-950/40 border-blue-900 text-blue-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                        id={`wizard-amenity-pill-${am.replace(/\s+/g, "-")}`}
                      >
                        <span>{am}</span>
                        {hasAm && (
                          <Check className="w-3.5 h-3.5 stroke-3 text-blue-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in" id="wizard-step-4">
              {/* Part A: Comprehensive Listing Status Selector */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Listing Status Index
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Define the lifecycle status of your property listing. This
                    updates instantly in search grids and applicant directories.
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  id="listing-status-cards"
                >
                  {[
                    {
                      val: "active",
                      label: "Active Listing",
                      desc: "Accepting applications",
                      color:
                        "border-emerald-500/30 text-emerald-400 bg-emerald-950/25",
                      icon: "🟢",
                    },
                    {
                      val: "pending",
                      label: "Pending Sale",
                      desc: "Under review or escrow",
                      color:
                        "border-amber-500/30 text-amber-400 bg-amber-950/25",
                      icon: "⏳",
                    },
                    {
                      val: "sold",
                      label: "Sold Out",
                      desc: "Ownership transferred",
                      color: "border-blue-500/30 text-blue-400 bg-blue-950/25",
                      icon: "🔑",
                    },
                    {
                      val: "rented",
                      label: "Rented / Leased",
                      desc: "Tenant successfully placed",
                      color:
                        "border-purple-500/30 text-purple-400 bg-purple-950/25",
                      icon: "✍️",
                    },
                    {
                      val: "off-market",
                      label: "Off-Market",
                      desc: "Temporarily deactivated",
                      color:
                        "border-slate-500/30 text-slate-400 bg-slate-950/25",
                      icon: "🚫",
                    },
                    {
                      val: "expired",
                      label: "Expired Listing",
                      desc: "Needs active renewal",
                      color: "border-red-500/30 text-red-400 bg-red-950/25",
                      icon: "⚠️",
                    },
                  ].map((st) => {
                    const isSelected = status === st.val;
                    return (
                      <div
                        key={st.val}
                        onClick={() => setStatus(st.val as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all select-none flex flex-col justify-between h-[85px] ${
                          isSelected
                            ? "bg-slate-950 border-blue-500 shadow-lg scale-[1.03] ring-2 ring-blue-500/10"
                            : "bg-slate-950/40 border-slate-850 hover:bg-slate-950 hover:border-slate-700"
                        }`}
                        id={`status-card-${st.val}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base select-none">
                            {st.icon}
                          </span>
                          {isSelected && (
                            <span className="text-[8px] bg-blue-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                              ACTIVE MODE
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold text-slate-150 leading-tight block">
                            {st.label}
                          </h4>
                          <span className="text-[9px] text-slate-400 leading-none truncate block mt-0.5">
                            {st.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part B: Paid Promotion Feature Booster */}
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Sovereign Search Result Promoter</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Elite listings receive priority placements in buyer
                      catalog results so you convert faster than local
                      competitors.
                    </p>
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                    BOOST INDEX
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Basic */}
                  <div
                    onClick={() => {
                      setIsFeatured(false);
                      setPaymentSuccess(false);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-left transition-all ${
                      !isFeatured
                        ? "bg-slate-950 border-slate-700 ring-2 ring-slate-800"
                        : "bg-slate-950/20 border-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Standard Package
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        Free
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Basic indexing. Lower view priorities. Listing expires on
                      scheduling date unless manually monitored.
                    </p>
                  </div>

                  {/* Option 2: Featured Booster */}
                  <div
                    onClick={() => {
                      setIsFeatured(true);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer text-left transition-all relative overflow-hidden ${
                      isFeatured
                        ? "bg-gradient-to-tr from-slate-950 to-blue-955/20 border-blue-500 ring-2 ring-blue-500/10"
                        : "bg-slate-950/20 border-slate-850 hover:border-blue-500/30"
                    }`}
                  >
                    <div className="absolute top-0 right-0 bg-blue-600 text-slate-950 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl-lg font-mono">
                      RECOMMENDED
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1">
                        🏆 Pinnacle Featured Upgrade
                      </span>
                      <span className="text-xs font-black text-white">
                        $49.00
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Highlight with Golden Badge. Display first on seek
                      results. Generates 4.5x more inquiries.
                    </p>
                  </div>
                </div>

                {isFeatured && (
                  <div
                    className="border border-slate-800 bg-slate-950 p-4 rounded-2xl space-y-3 animate-fade-in"
                    id="promos-checkout-node"
                  >
                    {paymentSuccess ? (
                      <div
                        className="flex items-start gap-3 bg-emerald-950/30 border border-emerald-900/60 p-3 rounded-xl"
                        id="checkout-completed-receipt"
                      >
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                            Stripe Payment Confirmed
                          </h5>
                          <p className="text-[10px] text-slate-305 mt-0.5">
                            Upgrade Active! Beautiful{" "}
                            <strong>Gold Pro badge</strong> matches this
                            property in search indexes.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] bg-emerald-950 border border-emerald-900 text-white font-mono px-1.5 py-0.5 rounded">
                              RECEIPT ID: #{Date.now().toString().substring(7)}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentSuccess(false);
                                setIsFeatured(false);
                              }}
                              className="text-[8px] text-red-400 hover:text-red-300 underline font-mono cursor-pointer"
                            >
                              Cancel promotion
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3" id="checkout-form-entry">
                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-300 font-mono">
                          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                          <span>Simulated Secure Checkout Portal</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[8px] text-slate-400 font-bold uppercase font-mono">
                              Simulated Card String
                            </label>
                            <input
                              type="text"
                              required={isFeatured}
                              placeholder="4111 •••• •••• 1111"
                              value={paymentCardNumber}
                              onChange={(e) => {
                                const val = e.target.value
                                  .replace(/\D/g, "")
                                  .substring(0, 16);
                                setPaymentCardNumber(
                                  val.replace(/(.{4})/g, "$1 ").trim(),
                                );
                              }}
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] text-slate-400 font-bold uppercase font-mono">
                              Expiry MM/YY
                            </label>
                            <input
                              type="text"
                              required={isFeatured}
                              placeholder="08/29"
                              value={paymentCardExpiry}
                              onChange={(e) =>
                                setPaymentCardExpiry(e.target.value)
                              }
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] text-slate-400 font-bold uppercase font-mono">
                              CVV Secure
                            </label>
                            <input
                              type="password"
                              required={isFeatured}
                              placeholder="•••"
                              value={paymentCardCvv}
                              onChange={(e) =>
                                setPaymentCardCvv(
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .substring(0, 3),
                                )
                              }
                              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 text-white font-mono"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!paymentCardNumber) {
                              alert(
                                "Please entering your credit card details to complete payment simulation.",
                              );
                              return;
                            }
                            setIsPaying(true);
                            setTimeout(() => {
                              setIsPaying(false);
                              setPaymentSuccess(true);
                              setIsFeatured(true);
                            }, 1000);
                          }}
                          disabled={isPaying}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-55 active:scale-95 text-white font-bold text-[10px] uppercase font-mono tracking-widest rounded-lg transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
                        >
                          {isPaying ? (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              Negotiating Authorization...
                            </span>
                          ) : (
                            <span>
                              Pay & Activate Sovereign promotion ($49.00 USD)
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Part C: Automatic Expiry Renewal Setting */}
              <div className="p-4 bg-slate-950/40 rounded-3xl border border-slate-850 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                      <span>Automatic Expiry Renewal Controller</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Avoid outdated listings. Keep property active on seekers’
                      catalog pages by enabling periodic micro-renewals.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select expiration date target */}
                  <div className="space-y-1">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase font-mono">
                      Original Expiration Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Toggle element */}
                  <div
                    onClick={() =>
                      setAutoRenewBeforeExpiry(!autoRenewBeforeExpiry)
                    }
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all select-none flex items-start gap-2.5 ${
                      autoRenewBeforeExpiry
                        ? "bg-blue-955/20 border-blue-500/50 text-blue-300"
                        : "bg-slate-950/20 border-slate-850 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                        autoRenewBeforeExpiry
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "border-slate-700"
                      }`}
                    >
                      {autoRenewBeforeExpiry && (
                        <Check className="w-3 h-3 stroke-3" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">
                        Enable Auto-Renewal Option
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">
                        Extend for 30 more days 24 hours prior to{" "}
                        {expiryDate || "expiry"}. Prevents converting status to
                        'Expired'.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Footer triggers */}
          <div
            className="bg-slate-950 -mx-6 -mb-6 p-4 border-t border-slate-800 flex justify-between items-center"
            id="wizard-navigation"
          >
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-xs font-bold font-mono transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
              id="wizard-step-prev"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1"
                id="wizard-step-next"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isPaying}
                className="px-4.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono shadow-md flex items-center gap-1 transition-all disabled:opacity-50"
                id="wizard-submit-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>
                  {editingProperty
                    ? "Apply Registry Changes"
                    : "Publish Property Live"}
                </span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
