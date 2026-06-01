import React, { useState } from "react";
import { Property, Agent, Inquiry } from "../types";
import {
  X,
  Calendar,
  MapPin,
  Check,
  Heart,
  Clipboard,
  Share2,
  AlertTriangle,
  ArrowRight,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import MortgageCalculator from "./MortgageCalculator";

interface PropertyDetailModalProps {
  property: Property;
  agent: Agent;
  similarProperties: Property[];
  onClose: () => void;
  onToggleFavorite: (propertyId: string) => void;
  isFavorited: boolean;
  isInCompare: boolean;
  onToggleCompare: (propertyId: string) => void;
  onSendInquiry: (inquiry: Omit<Inquiry, "id" | "createdDate">) => void;
  currentRole: "seeker" | "owner" | "agent" | "admin";
  onReportListing: (reason: string, details: string) => void;
}

export default function PropertyDetailModal({
  property,
  agent,
  similarProperties,
  onClose,
  onToggleFavorite,
  isFavorited,
  isInCompare,
  onToggleCompare,
  onSendInquiry,
  currentRole,
  onReportListing,
}: PropertyDetailModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "info" | "video" | "virtual" | "floorplan"
  >("info");

  // Contact form state
  const [fullName, setFullName] = useState<string>("Chibuike Eseagwu");
  const [emailAddress, setEmailAddress] = useState<string>(
    "chibuikeeseagwu02@gmail.com",
  );
  const [phoneNumber, setPhoneNumber] = useState<string>("+1 (555) 438-1920");
  const [clientMessage, setClientMessage] = useState<string>(
    `Hi ${agent.name}, I would appreciate more details on this listing.`,
  );
  const [scheduleDate, setScheduleDate] = useState<string>("2026-06-05");
  const [scheduleTime, setScheduleTime] = useState<string>("11:00 AM");
  const [isSuccessfullyInquired, setIsSuccessfullyInquired] =
    useState<boolean>(false);

  // Sharing trigger details
  const [showShareNotification, setShowShareNotification] =
    useState<boolean>(false);

  // Listing reporting state
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("Duplicate listing");
  const [reportDetails, setReportDetails] = useState<string>("");

  const submitContactRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !clientMessage) return;

    onSendInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyPhoto: property.photos[0],
      seekerName: fullName,
      seekerEmail: emailAddress,
      seekerPhone: phoneNumber,
      message: clientMessage,
      status: "new",
      preferredDate: scheduleDate || undefined,
      preferredTime: scheduleTime || undefined,
      notes: [],
      chatHistory: [
        {
          sender: "seeker",
          message: clientMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    setIsSuccessfullyInquired(true);
    setTimeout(() => {
      setIsSuccessfullyInquired(false);
    }, 5000);
  };

  const copyListingLink = () => {
    const fakeLink = `${window.location.origin}/properties/${property.id}`;
    navigator.clipboard.writeText(fakeLink);
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2000);
  };

  const submitFraudReport = (e: React.FormEvent) => {
    e.preventDefault();
    onReportListing(
      reportReason,
      reportDetails || "No supporting files provided.",
    );
    setIsReporting(false);
    alert("Listing successfully reported. Moderation teams will review.");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      id="listing-details-dialog"
    >
      <div
        className="bg-slate-900 border-none sm:border sm:border-slate-800 rounded-none sm:rounded-3xl w-full max-w-5xl h-full sm:h-[90vh] flex flex-col overflow-hidden text-slate-100 shadow-2xl relative"
        id="dialog-panel"
      >
        {/* Floating details cancel trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-all shadow-lg"
          id="dialog-close-btn"
          title="Exit Detail Modals"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable container holds information structure */}
        <div className="flex-1 overflow-y-auto" id="dialog-scroll-body">
          {/* Section 1: Hero slideshow & core summary badges */}
          <div
            className="relative h-64 sm:h-96 w-full bg-slate-950 flex"
            id="gallery-billboard"
          >
            {/* Main picture visualizer */}
            <img
              src={property.photos[activePhotoIdx]}
              alt={`Photo view ${activePhotoIdx + 1}`}
              className="w-full h-full object-cover transition-all"
            />

            {/* Gradient masking */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

            {/* Float selection overlay controls */}
            <div
              className="absolute inset-x-4 top-4 z-10 pointer-events-none flex justify-between"
              id="float-controls"
            >
              <div className="flex gap-2 pointer-events-auto">
                <span
                  className={`px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full shadow ${
                    property.listingType === "buy"
                      ? "bg-blue-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  For {property.listingType}
                </span>

                <span
                  className={`px-3 py-1 font-bold text-[9px] uppercase tracking-widest rounded-full shadow ${
                    property.status === "active"
                      ? "bg-emerald-600"
                      : property.status === "pending"
                        ? "bg-amber-500 text-slate-950 animate-pulse"
                        : property.status === "sold"
                          ? "bg-blue-500"
                          : property.status === "rented"
                            ? "bg-purple-600"
                            : property.status === "off-market"
                              ? "bg-slate-700 text-slate-200"
                              : "bg-red-650 text-white"
                  }`}
                >
                  {property.status || "Active"}
                </span>

                {property.isFeatured && (
                  <span className="bg-amber-500 text-amber-950 font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow animate-pulse">
                    Featured
                  </span>
                )}
              </div>

              {/* Interaction widgets (UE-01, UE-02) */}
              <div
                className="flex gap-2 pointer-events-auto"
                id="gallery-control-buttons"
              >
                {/* Compare toggle */}
                <button
                  onClick={() => onToggleCompare(property.id)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full border shadow transition-colors flex items-center gap-1 ${
                    isInCompare
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-slate-950/80 hover:bg-slate-950 text-slate-300 border-slate-800"
                  }`}
                  id="toggle-matrix-compare"
                >
                  {isInCompare ? "In Matrix Comparison" : "+ Compare"}
                </button>

                {/* Heart Saved property */}
                <button
                  onClick={() => onToggleFavorite(property.id)}
                  className={`px-3 py-2 rounded-full border shadow transition-colors flex items-center gap-1.5 text-[10px] font-bold ${
                    isFavorited
                      ? "bg-rose-600 border-rose-500 text-white"
                      : "bg-slate-950/80 hover:bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                  title="Bookmark to favorites list"
                  id="toggle-fav-btn"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`}
                  />
                  <span>{isFavorited ? "Saved" : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Photo Index pagination switches */}
            <div
              className="absolute bottom-4 left-4 z-10 flex gap-1.5"
              id="carousel-indicators"
            >
              {property.photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activePhotoIdx
                      ? "w-6 bg-blue-500"
                      : "w-2 bg-slate-600/80"
                  }`}
                  id={`dot-idx-${idx}`}
                />
              ))}
            </div>

            {/* Floated Pricing parameters */}
            <div
              className="absolute bottom-4 right-4 z-10 text-right"
              id="overlay-pricing-block"
            >
              <span className="text-[10px] text-slate-400 block tracking-widest font-mono font-bold uppercase">
                Asset Price Metrics
              </span>
              <p className="text-white text-3xl font-black tracking-tight mt-0.5">
                ${property.price.toLocaleString()}
                {property.listingType === "rent" ? "/mo" : ""}
              </p>
            </div>
          </div>

          {/* Section 2: Split columns layout */}
          <div
            className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
            id="details-cols"
          >
            {/* Column A: Information summary & Amenities */}
            <div className="lg:col-span-2 space-y-6" id="column-specifications">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">
                  {property.city} Area Catalog
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                  {property.title}
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>
                    {property.address} &bull; {property.zipCode}
                  </span>
                </p>
              </div>

              {/* Core Specs metrics block */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 gap-4 font-mono"
                id="numeric-metrics-block"
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">
                    Bedrooms
                  </span>
                  <p className="text-sm font-bold text-white">
                    {property.bedrooms} Bed
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">
                    Bathrooms
                  </span>
                  <p className="text-sm font-bold text-white">
                    {property.bathrooms} Bath
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">
                    Total Sizing
                  </span>
                  <p className="text-sm font-bold text-white">
                    {property.sizeSqFt.toLocaleString()} sqft
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-500 uppercase font-semibold">
                    Lot Spec Range
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {property.lotSize || "0.2 Acres"}
                  </p>
                </div>
              </div>

              {/* Extra specifications overview */}
              <div
                className="grid grid-cols-3 gap-3 text-xs bg-slate-950/20 p-3 rounded-xl text-slate-400"
                id="secondary-specs-block"
              >
                <span>
                  Year Built:{" "}
                  <strong className="text-slate-200">
                    {property.yearBuilt}
                  </strong>
                </span>
                <span>
                  Parking:{" "}
                  <strong className="text-slate-200">
                    {property.parkingSpaces} spaces
                  </strong>
                </span>
                <span>
                  Floors:{" "}
                  <strong className="text-slate-200">
                    {property.floors} levels
                  </strong>
                </span>
              </div>

              {/* Description body (PD-06) */}
              <div className="space-y-2" id="text-description-section">
                <h3 className="font-bold text-white text-xs tracking-wider uppercase font-mono">
                  Detailed Highlight Summary
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {property.description}
                </p>
              </div>

              {/* Navigation switches for: Amenities, Virtual Tour, Technical blueprints (PD-02, PD-03) */}
              <div
                className="space-y-4 border-t border-slate-800 pt-5"
                id="media-interactive-sub-tabs"
              >
                <div
                  className="flex border-b border-slate-800 pb-1 text-xs gap-4 overflow-x-auto scrollbar-none"
                  id="media-tabs-list"
                >
                  {[
                    { tag: "info", label: "Feature Checklist", icon: FileText },
                    { tag: "video", label: "Video Walkthrough", icon: Play },
                    { tag: "virtual", label: "360° Virtual walk", icon: Video },
                    {
                      tag: "floorplan",
                      label: "Architectural Blueprint",
                      icon: FileText,
                    },
                  ].map((sub) => (
                    <button
                      type="button"
                      key={sub.tag}
                      onClick={() => setActiveTab(sub.tag as any)}
                      className={`pb-2 select-none border-b-2 font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                        activeTab === sub.tag
                          ? "border-blue-500 text-blue-400"
                          : "border-transparent text-slate-500 hover:text-slate-300"
                      }`}
                      id={`media-sub-tab-btn-${sub.tag}`}
                    >
                      <sub.icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>

                {activeTab === "info" && (
                  /* Amenities list highlights */
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    id="amenity-highlight-checklist"
                  >
                    {property.amenities.map((am) => (
                      <div
                        key={am}
                        className="flex items-center gap-2 text-xs border border-slate-800 p-2 rounded-xl bg-slate-950/20"
                        id={`checklist-item-${am.replace(/\s+/g, "-")}`}
                      >
                        <span className="p-0.5 bg-blue-500/10 text-blue-400 rounded">
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </span>
                        <span className="text-slate-300 font-medium">{am}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "video" && (
                  /* Property Video Walkthrough Player */
                  <div className="space-y-3" id="video-walk-pane">
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
                          Walkthrough Media Stream
                        </span>
                        <h4 className="text-white font-semibold text-xs mt-0.5">
                          Interactive High Definition Video Tour
                        </h4>
                      </div>
                      <span className="text-[9px] bg-blue-600/10 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                        {property.videoUrl
                          ? "CUSTOM SELLER STREAM"
                          : "DEFAULT DEMO WALK"}
                      </span>
                    </div>

                    {(() => {
                      const targetUrl =
                        property.videoUrl ||
                        "https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-elegant-luxury-decor-41221-large.mp4";

                      // YouTube Embed Check
                      const ytMatch = targetUrl.match(
                        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
                      );
                      if (ytMatch && ytMatch[1]) {
                        return (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1`}
                              title="Property Video Walkthrough"
                              className="absolute inset-0 w-full h-full border-none"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }

                      // Vimeo Embed Check
                      const vimeoMatch = targetUrl.match(
                        /vimeo\.com\/(?:video\/)?([0-9]+)/i,
                      );
                      if (vimeoMatch && vimeoMatch[1]) {
                        return (
                          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                            <iframe
                              src={`https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`}
                              title="Property Video Walkthrough"
                              className="absolute inset-0 w-full h-full border-none"
                              allow="autoplay; fullscreen; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        );
                      }

                      // Standard Video Tag with controls
                      return (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                          <video
                            src={targetUrl}
                            controls
                            autoPlay
                            muted
                            loop
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })()}
                  </div>
                )}

                {activeTab === "virtual" && (
                  /* 360 virtual walk loop (PD-02) */
                  <div
                    className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col justify-center items-center text-center p-6"
                    id="virtual-tour-pane"
                  >
                    <img
                      src={property.photos[1] || property.photos[0]}
                      alt="Virtual loop"
                      className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xs animate-pulse-slow"
                    />
                    <div
                      className="relative space-y-2 z-10"
                      id="virtual-caption"
                    >
                      <div className="p-3 bg-blue-500/10 text-blue-400 inline-block rounded-full border border-blue-500/20 mb-1">
                        <Video className="w-6 h-6 stroke-2" />
                      </div>
                      <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                        360-Degree Interactive Walkthrough
                      </h5>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto font-mono">
                        * A private, high-framerate panoramic loop has been
                        rendered for this {property.city} estate. Click to
                        request dynamic HD access from Sarah.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "floorplan" && (
                  /* Blueprints & plans (PD-03) */
                  <div
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3"
                    id="blueprint-pane"
                  >
                    <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">
                      Ground Level Dimensions Blueprint
                    </span>
                    <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-4">
                      {/* Generates a vector wireframe mimicking blueprint lines */}
                      <svg
                        width="240"
                        height="150"
                        viewBox="0 0 240 150"
                        className="opacity-40"
                        stroke="#3b82f6"
                        strokeWidth="0.75"
                        fill="none"
                      >
                        <rect x="10" y="10" width="220" height="130" />
                        <line x1="120" y1="10" x2="120" y2="140" />
                        <line x1="10" y1="75" x2="230" y2="75" />
                        <rect x="30" y="30" width="60" height="30" />
                        <rect x="150" y="30" width="50" height="40" />
                        <text
                          x="40"
                          y="48"
                          fill="#3b82f6"
                          stroke="none"
                          className="text-[8px] font-mono"
                        >
                          Foyer
                        </text>
                        <text
                          x="160"
                          y="52"
                          fill="#3b82f6"
                          stroke="none"
                          className="text-[8px] font-mono"
                        >
                          Master Bed
                        </text>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Integrated Mortgage Helper Simulator! (PD-10) */}
              {property.listingType === "buy" && (
                <div
                  className="border-t border-slate-800 pt-5"
                  id="integrated-mortgage-nest"
                >
                  <MortgageCalculator initialPrice={property.price} />
                </div>
              )}
            </div>

            {/* Column B: Broker Contact Form & Viewing Scheduler */}
            <div className="space-y-6" id="column-actions-crm">
              {/* Profile Card context */}
              <div
                className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-4"
                id="broker-context-card"
              >
                <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest block font-mono">
                  {agent.agency === "Private Owner / Homeowner"
                    ? "★ Verified Private Seller"
                    : "Listing Broker Profile"}
                </span>

                <div className="flex items-center gap-3">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-800 shadowIndex"
                  />
                  <div>
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5 leading-tight">
                      <span>{agent.name}</span>
                      {agent.isVerified && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 px-1.5 rounded uppercase">
                          Anti-Scam Verified
                        </span>
                      )}
                    </h5>
                    <p className="text-[10px] text-slate-400 font-mono text-[9px]">
                      {agent.agency}
                    </p>
                    <p className="text-[9px] text-amber-500 font-bold mt-0.5 font-mono">
                      Rating: {agent.rating} ({agent.reviewCount} client
                      reviews)
                    </p>
                  </div>
                </div>

                {agent.agency === "Private Owner / Homeowner" && (
                  <div
                    className="p-2.5 bg-sky-950/20 border border-sky-900/40 rounded-xl space-y-1.5"
                    id="anti-scam-shield"
                  >
                    <span className="text-[8px] text-sky-400 font-mono uppercase tracking-widest block font-extrabold">
                      🛡️ Double-Lock Anti-Scam Standard
                    </span>
                    <p className="text-[9px] text-slate-300 leading-normal">
                      Photos and county recorder deeds have been successfully
                      validated by PropFind Staff Auditors.
                    </p>
                    <div className="border-t border-slate-850/65 pt-1.5 mt-1 space-y-1">
                      <span className="text-[8px] text-slate-500 font-mono uppercase font-bold block">
                        Verified Client Audit History:
                      </span>
                      <p className="text-[9px] text-slate-400 italic font-sans">
                        ★ ★ ★ ★ ★ &quot;Truly pristine. George Clooney of course
                        manages a gorgeous glass penthouse.&quot;{" "}
                        <span className="text-slate-650 text-[8px] font-mono font-bold">
                          — Alice M. (September 2025)
                        </span>
                      </p>
                      <p className="text-[9px] text-slate-400 italic font-sans mt-1">
                        ★ ★ ★ ★ ☆ &quot;Everything was exactly as advertised.
                        Avoids any fake picture issues!&quot;{" "}
                        <span className="text-slate-650 text-[8px] font-mono font-bold">
                          — Ken T. (November 2025)
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-500 italic border-t border-slate-900 pt-2.5">
                  &quot;{agent.bio}&quot;
                </div>
              </div>

              {/* Tour Appointment & Message Form (US-04) */}
              <div
                className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4"
                id="crm-contact-request-nest"
              >
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block font-mono">
                  Contact Broker & Tour Request
                </span>

                {isSuccessfullyInquired ? (
                  <div
                    className="p-4 bg-blue-950/40 border border-blue-900 rounded-xl space-y-2 text-center"
                    id="contact-success-notification"
                  >
                    <p className="font-bold text-white text-xs">
                      Tour request dispatched!
                    </p>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Your requested viewing for {scheduleDate} @ {scheduleTime}{" "}
                      has been wired to {agent.name}. Swap user role to "Agent"
                      from top dashboard menu to review CRM replies!
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={submitContactRequest}
                    className="space-y-3"
                    id="client-contact-form"
                  >
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase">
                        Seeker Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded placeholder-slate-700 text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1"
                        id="seeker-name-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded placeholder-slate-700 text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1 pr-1 font-mono"
                          id="seeker-email-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded placeholder-slate-700 text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1 font-mono"
                          id="seeker-phone-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase">
                          Preferred Tour Date
                        </label>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1 pr-1 font-mono"
                          id="seeker-date-input"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase">
                          Preferred Tour Time
                        </label>
                        <select
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1 font-mono"
                          id="seeker-time-input"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="01:00 PM">01:00 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="05:00 PM">05:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase">
                        Personal Message Inquiry
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded placeholder-slate-700 text-xs px-2.5 py-1.5 focus:outline-none focus:border-blue-500 text-white mt-1 resize-none"
                        id="seeker-message-input"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono py-2 rounded-lg transition-all shadow-md mt-1"
                      id="contact-submit-trigger"
                    >
                      Request Guided Tour Session
                    </button>
                  </form>
                )}
              </div>

              {/* Utility Sharing and Fraud Report launchers (PD-12, UE-08) */}
              <div className="flex gap-2" id="util-triggers">
                <button
                  onClick={copyListingLink}
                  className="flex-1 px-3 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 text-slate-300 transition-colors"
                  id="share-listing-btn"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-450" />
                  <span>
                    {showShareNotification ? "Link Copied!" : "Share Listing"}
                  </span>
                </button>

                <button
                  onClick={() => setIsReporting(!isReporting)}
                  className="px-3 py-2 bg-slate-950 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/50 text-[11px] font-bold rounded-xl flex items-center justify-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  id="report-listing-trigger"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-500 hover:text-red-400" />
                  <span>Report Fraud</span>
                </button>
              </div>

              {/* Inline micro report manager form */}
              {isReporting && (
                <form
                  onSubmit={submitFraudReport}
                  className="p-4 bg-red-950/10 border border-red-900/40 rounded-2xl space-y-3"
                  id="fraud-reporting-form"
                >
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block font-mono">
                    Flag Suspicious Activity
                  </span>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase">
                      Reporting Reason
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded text-xs px-2.5 py-1 focus:outline-none focus:border-red-500 text-white mt-1 font-mono"
                    >
                      <option value="Duplicate listing">
                        Duplicate listing / Spam
                      </option>
                      <option value="Outdated pricing">
                        Outdated listing / Sold already
                      </option>
                      <option value="Inaccurate location coordinates">
                        Inaccurate maps layout
                      </option>
                      <option value="Suspicious owner credential">
                        Fake photos / Fraud broker
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase">
                      Violations Context details
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Outline details on why this real estate contains violations..."
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded placeholder-slate-700 text-xs px-2.5 py-1 focus:outline-none focus:border-red-500 text-white mt-1 resize-none font-mono"
                    />
                  </div>

                  <div
                    className="flex gap-2 justify-end"
                    id="fraud-report-triggers"
                  >
                    <button
                      type="button"
                      onClick={() => setIsReporting(false)}
                      className="text-[10px] text-slate-400 font-semibold px-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] font-mono px-3 py-1 rounded"
                    >
                      File Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Section 3: Similar Properties nearby drawer (PD-11) */}
          <div
            className="p-6 md:p-8 border-t border-slate-800 bg-slate-950/20"
            id="similar-properties-drawer"
          >
            <h4 className="font-bold text-white text-xs tracking-wider uppercase font-mono mb-4 flex items-center justify-between">
              <span>Comparable Listings Nearby</span>
              <span className="text-[10px] text-blue-400 font-medium">
                Within 3-mile matrix range &bull; Selected
              </span>
            </h4>

            {similarProperties.length === 0 ? (
              <p className="text-slate-500 text-xs italic">
                No comparable luxury listings currently indexed in this
                neighborhood.
              </p>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                id="similar-cards-grid"
              >
                {similarProperties.slice(0, 3).map((sim) => (
                  <div
                    key={sim.id}
                    className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden shadowIndex group"
                    id={`similar-unit-${sim.id}`}
                  >
                    <div className="h-32 bg-slate-950 relative">
                      <img
                        src={sim.photos[0]}
                        alt={sim.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 right-2 bg-slate-950/90 text-[10px] text-blue-300 font-mono font-bold px-2 py-0.5 rounded shadow">
                        ${sim.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h5 className="font-bold text-slate-100 text-xs truncate leading-snug group-hover:text-blue-400 transition-colors">
                        {sim.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {sim.bedrooms} Bed &bull; {sim.bathrooms} Bath &bull;{" "}
                        {sim.sizeSqFt} sqft
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        <span>{sim.city}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
