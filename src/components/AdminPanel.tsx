import React, { useState } from "react";
import { Property, Agent, ReportedListing, Inquiry } from "../types";
import {
  ShieldCheck,
  UserX,
  AlertOctagon,
  LineChart,
  CheckCircle2,
  Ban,
  Eye,
  MailCheck,
  Trophy,
  Sparkles,
  Building,
  Trash2,
} from "lucide-react";

interface AdminPanelProps {
  properties: Property[];
  agents: Agent[];
  reportedListings: ReportedListing[];
  inquiries: Inquiry[];
  supportTickets: Array<{
    userEmail: string;
    userName: string;
    userRole: string;
    messages: Array<{
      sender: "user" | "admin" | "bot";
      text: string;
      timestamp: string;
    }>;
  }>;
  onApproveProperty: (propertyId: string) => void;
  onModifyPropertyStatus: (
    propertyId: string,
    status: Property["status"],
  ) => void;
  onVerifyAgent: (agentId: string) => void;
  onReviewReport: (reportId: string, action: "dismissed" | "removed") => void;
  onSuspendUser: (email: string) => void;
  onReplyTicket: (userEmail: string, text: string) => void;
}

export default function AdminPanel({
  properties,
  agents,
  reportedListings,
  inquiries,
  supportTickets,
  onApproveProperty,
  onModifyPropertyStatus,
  onVerifyAgent,
  onReviewReport,
  onSuspendUser,
  onReplyTicket,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "moderation" | "users" | "reports" | "analytics" | "tickets"
  >("moderation");
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedTicketEmail, setSelectedTicketEmail] = useState<string | null>(
    null,
  );
  const [adminReplyText, setAdminReplyText] = useState("");

  const showFeedback = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 3000);
  };

  // Math totals for the platform metrics
  const totalViews = properties.reduce((acc, p) => acc + p.views, 0);
  const totalSaves = properties.reduce((acc, p) => acc + p.saves, 0);
  const totalInquiries = inquiries.length;

  // Render responsive mini SVG metric trend line chart helper
  const renderTrendLine = (points: number[]) => {
    const width = 140;
    const height = 35;
    const maxVal = Math.max(...points) || 1;
    const minVal = Math.min(...points) || 0;
    const delta = maxVal - minVal || 1;

    const coords = points
      .map((p, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((p - minVal) / delta) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2.5"
          points={coords}
        />
        {/* Soft shadow filling below */}
        <path
          d={`M0,${height} L${coords} L${width},${height} Z`}
          fill="rgba(59, 130, 246, 0.08)"
        />
      </svg>
    );
  };

  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100"
      id="platform-admin-panel"
    >
      {/* Admin Top Banner */}
      <div
        className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        id="admin-banner"
      >
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-1.5">
              <span>PropFind Moderator Core Desk</span>
              <span className="text-[9px] bg-red-950 text-red-500 px-2 py-0.5 rounded border border-red-950 uppercase font-mono tracking-wider">
                Secure Access
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Moderating quality metrics, auditing brokers, and preventing fraud
            </p>
          </div>
        </div>

        {/* Floating feedback alert */}
        {notification && (
          <div
            className="bg-emerald-950/90 border border-emerald-800/80 px-3.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 animate-pulse text-center"
            id="admin-alert"
          >
            {notification}
          </div>
        )}

        {/* Tab Selection Row */}
        <div
          className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs self-start sm:self-auto"
          id="admin-tab-selection"
        >
          {[
            { tag: "moderation", label: "Moderation Q" },
            { tag: "users", label: "Audits / Agents" },
            { tag: "reports", label: "Report Flags" },
            { tag: "analytics", label: "Live KPIs" },
            { tag: "tickets", label: "User Chat Tickets" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.tag}
              onClick={() => setActiveTab(tab.tag as any)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                activeTab === tab.tag
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
              id={`admin-tab-btn-${tab.tag}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Platform KPI Metric widgets (AD-06) */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-800 bg-slate-950/30 font-mono"
        id="admin-kpis-grid"
      >
        <div className="p-4 border-r border-slate-800 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
            Database Items
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {properties.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              +4% PM
            </span>
          </div>
          <div className="pt-2">
            {renderTrendLine([4, 5, 5, 6, 7, properties.length])}
          </div>
        </div>

        <div className="p-4 border-r border-slate-800 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
            Total Traffic Views
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {totalViews.toLocaleString()}
            </span>
            <span className="text-[10px] text-blue-400 font-semibold">
              +18% WK
            </span>
          </div>
          <div className="pt-2">
            {renderTrendLine([900, 1100, 1500, 1800, 2400, totalViews])}
          </div>
        </div>

        <div className="p-4 border-r border-slate-800 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
            Platform Favorites
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{totalSaves}</span>
            <span className="text-[10px] text-rose-400 font-semibold">
              +8% PM
            </span>
          </div>
          <div className="pt-2">
            {renderTrendLine([150, 180, 240, 210, 310, totalSaves])}
          </div>
        </div>

        <div className="p-4 space-y-1">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold block">
            Inquiry Capture Ratio
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">
              {totalInquiries}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">
              94.2% CR
            </span>
          </div>
          <div className="pt-2">
            {renderTrendLine([12, 18, 15, 23, 28, totalInquiries])}
          </div>
        </div>
      </div>

      <div className="p-6" id="admin-tab-viewport">
        {activeTab === "moderation" && (
          /* Listing status edit, moderation block (AD-01, AD-05) */
          <div className="space-y-4" id="admin-moderation-list">
            <div
              className="flex justify-between items-center mb-2"
              id="mod-hdr"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Listings Audit Catalog ({properties.length})
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">
                Status Toggle Workspace
              </span>
            </div>

            <div
              className="overflow-x-auto rounded-xl border border-slate-800"
              id="mod-list"
            >
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#131d31] font-mono font-medium text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Property Name</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Price Metric</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-950/40 group">
                      <td className="p-3 font-semibold text-white flex items-center gap-2 max-w-[200px]">
                        <img
                          src={prop.photos[0]}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="truncate">{prop.title}</span>
                      </td>
                      <td className="p-3 font-mono">{prop.city}</td>
                      <td className="p-3 font-mono text-blue-400 font-bold">
                        ${prop.price.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold border ${
                            prop.status === "active"
                              ? "bg-blue-950 text-blue-400 border-blue-900/60"
                              : prop.status === "pending"
                                ? "bg-amber-950 text-amber-500 border-amber-900/60"
                                : "bg-slate-950 text-slate-400 border-slate-800"
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {prop.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => {
                              onApproveProperty(prop.id);
                              showFeedback(
                                `Approve success for listing ${prop.id}`,
                              );
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors"
                            id={`mod-approve-${prop.id}`}
                          >
                            Approve
                          </button>
                        )}
                        <select
                          value={prop.status}
                          onChange={(e) => {
                            onModifyPropertyStatus(
                              prop.id,
                              e.target.value as any,
                            );
                            showFeedback(
                              `Set status ${e.target.value} on ${prop.id}`,
                            );
                          }}
                          className="bg-slate-950 border border-slate-800 font-semibold focus:outline-none focus:border-blue-500 rounded text-[10px] p-1 text-slate-300"
                        >
                          <option value="active">Make Active</option>
                          <option value="pending">Set Pending</option>
                          <option value="sold">Mark Sold</option>
                          <option value="rented">Mark Rented</option>
                          <option value="off-market">Off Market</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          /* User management table, broker audits & agent badge approvals (AD-02, AD-03) */
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            id="admin-user-flow"
          >
            {/* Broker Verification Desk */}
            <div className="space-y-3" id="broker-verify-queue">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Broker Verification Audits</span>
              </h4>
              <p className="text-[11px] text-slate-500 pb-1">
                Grant verification badges to pre-vetted real estate brokers
              </p>

              <div className="space-y-2.5" id="agent-auditing-list">
                {agents.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={ag.photo}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h6 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{ag.name}</span>
                          {ag.isVerified && (
                            <span className="text-[9px] bg-blue-900 border border-blue-900 text-blue-300 px-1.5 py-0.2 rounded font-bold uppercase">
                              Verified
                            </span>
                          )}
                        </h6>
                        <p className="text-[10px] text-slate-400">
                          {ag.agency} &bull; {ag.reviewCount} Client Reviews
                        </p>
                      </div>
                    </div>

                    {!ag.isVerified ? (
                      <button
                        type="button"
                        onClick={() => {
                          onVerifyAgent(ag.id);
                          showFeedback(
                            `Verification badge granted to ${ag.name}!`,
                          );
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1"
                        id={`verify-badge-btn-${ag.id}`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>Verify Broker</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono uppercase font-bold pr-2 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />{" "}
                        Pre-Vetted
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Seeker/Admin account profiles */}
            <div className="space-y-3" id="general-users-audit">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <UserX className="w-4 h-4 text-red-500" />
                <span>General Seekers & land owner profiles</span>
              </h4>
              <p className="text-[11px] text-slate-500 pb-1">
                Suspend fraudulent accounts or restrict user activities
              </p>

              <div className="space-y-2" id="general-users-table">
                {[
                  {
                    name: "Chibuike Eseagwu",
                    email: "chibuikeeseagwu02@gmail.com",
                    role: "seeker",
                    status: "active",
                  },
                  {
                    name: "George Clooney",
                    email: "george.clooney@hollywood.com",
                    role: "owner",
                    status: "active",
                  },
                  {
                    name: "Robert Vance Jr.",
                    email: "robert.vance@vancerefrigi.com",
                    role: "seeker",
                    status: "active",
                  },
                  {
                    name: "Diana Prince",
                    email: "diana.prince@themiscyra.io",
                    role: "seeker",
                    status: "active",
                  },
                ].map((usr, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h6 className="text-xs font-bold text-white">
                        {usr.name}
                      </h6>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {usr.email} &bull;{" "}
                        <span className="uppercase text-blue-400">
                          {usr.role}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSuspendUser(usr.email);
                        showFeedback(
                          `Successfully sent suspension warning to ${usr.email}`,
                        );
                      }}
                      className="text-[10px] border border-red-950 hover:bg-red-950/20 text-red-400 px-2.5 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1"
                      id={`suspend-user-${i}`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Restrict User</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          /* Reported Listings flags queue (AD-04) */
          <div className="space-y-4" id="reported-listings-audit">
            <div
              className="flex justify-between items-center mb-2"
              id="rep-sub-hdr"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Fraud Flag reported queues ({reportedListings.length})
              </h4>
              <span className="text-[10px] text-red-500 bg-red-950 font-mono font-bold px-2 py-0.5 rounded border border-red-900/60 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 animate-bounce" />{" "}
                Attention Mandatory
              </span>
            </div>

            {reportedListings.length === 0 ? (
              <div
                className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl"
                id="no-reports"
              >
                Zero client safety violations active. Core database verified
                clean!
              </div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                id="reports-grid"
              >
                {reportedListings.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between"
                    id={`report-card-${rep.id}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono font-bold border border-red-900/50">
                          {rep.reason}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {rep.createdDate}
                        </span>
                      </div>

                      <h5 className="font-bold text-white text-xs">
                        {rep.propertyTitle}
                      </h5>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        &quot;{rep.details}&quot;
                      </p>

                      <p className="text-[9px] text-slate-500 italic">
                        Reported by: {rep.reporterName}
                      </p>
                    </div>

                    <div
                      className="flex justify-end gap-2 pt-2 border-t border-slate-900"
                      id={`report-actions-${rep.id}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onReviewReport(rep.id, "dismissed");
                          showFeedback("Flag dismissed. Property retained.");
                        }}
                        className="px-2.5 py-1.5 bg-slate-900 text-[10px] border border-slate-800 text-slate-400 rounded hover:text-white transition-colors"
                        id={`dismiss-flag-${rep.id}`}
                      >
                        Dismiss Flag
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onReviewReport(rep.id, "removed");
                          showFeedback("Property taken down. Flag archived.");
                        }}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded transition-colors flex items-center gap-1"
                        id={`delete-listing-${rep.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Property
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          /* Live KPI analytics performance vectors (AD-06) */
          <div className="space-y-6" id="analytics-overview-dashboard">
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              id="analytics-details"
            >
              {/* Regional allocation chart */}
              <div
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                id="regional-spread"
              >
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono block">
                  Regional Property Count Matrix
                </span>

                <div className="space-y-2.5 pt-1" id="bars-alloc">
                  {[
                    {
                      label: "Marina Heights",
                      value: 3,
                      total: 7,
                      pct: "43%",
                      color: "bg-sky-500",
                    },
                    {
                      label: "Downtown Core",
                      value: 2,
                      total: 7,
                      pct: "28%",
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Pine Crest",
                      value: 1,
                      total: 7,
                      pct: "14%",
                      color: "bg-emerald-600",
                    },
                    {
                      label: "Canyon View",
                      value: 1,
                      total: 7,
                      pct: "14%",
                      color: "bg-amber-600",
                    },
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1" id={`region-bar-${i}`}>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-semibold">
                          {bar.label}
                        </span>
                        <span className="text-white font-bold">
                          {bar.value} listings ({bar.pct})
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full`}
                          style={{ width: bar.pct }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRM Leads status funnel breakdown */}
              <div
                className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3"
                id="leads-funnel"
              >
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase font-mono block">
                  Leads Funnel Conversion Rate
                </span>

                <div className="space-y-2 text-xs" id="funnel-rows">
                  {[
                    {
                      label: "Incoming Leads",
                      num: totalInquiries,
                      width: "100%",
                      base: "bg-blue-600",
                    },
                    {
                      label: "Responded / Contacted",
                      num: 2,
                      width: "66%",
                      base: "bg-indigo-600",
                    },
                    {
                      label: "Viewing Scheduled",
                      num: 1,
                      width: "33%",
                      base: "bg-amber-500",
                    },
                  ].map((fun, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2"
                      id={`fun-step-${idx}`}
                    >
                      <span className="text-[10px] text-slate-500 w-32 font-mono truncate">
                        {fun.label}
                      </span>
                      <div className="flex-1 h-6 bg-slate-900 rounded overflow-hidden relative flex items-center px-2">
                        <div
                          className={`absolute left-0 top-0 bottom-0 ${fun.base} opacity-20`}
                          style={{ width: fun.width }}
                        />
                        <span className="text-[10px] font-bold text-white z-10 font-mono pr-2">
                          {fun.num} Conversions
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tickets" && (
          /* Two-way live-updated support chatbot ticket console */
          <div
            className="space-y-4 font-sans text-xs"
            id="moderator-tickets-center"
          >
            <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-850">
              <div>
                <h4 className="text-white font-bold">
                  User Chatbot Service Tickets
                </h4>
                <p className="text-[10px] text-slate-400">
                  Moderating reported violations and landlord verification chats
                </p>
              </div>
              <span className="bg-blue-950 text-blue-400 text-[10px] font-bold uppercase font-mono px-3 py-1 rounded border border-blue-900/60">
                Live Support Routing
              </span>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              id="tickets-split-matrix"
            >
              {/* Left Column list */}
              <div
                className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
                id="tickets-pipeline-col"
              >
                {supportTickets.length === 0 ? (
                  <p className="text-slate-500 italic p-3 text-center border border-slate-800 rounded-lg">
                    Zero assistance tickets active.
                  </p>
                ) : (
                  supportTickets.map((t) => {
                    const isSelected = selectedTicketEmail === t.userEmail;
                    const lastMsg = t.messages[t.messages.length - 1];

                    return (
                      <div
                        key={t.userEmail}
                        onClick={() => setSelectedTicketEmail(t.userEmail)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                          isSelected
                            ? "bg-blue-950/50 border-blue-800/80 text-white"
                            : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[11px] truncate block max-w-[130px]">
                            {t.userName}
                          </span>
                          <span className="text-[8px] uppercase tracking-widest bg-slate-900 px-1.5 py-0.2 rounded font-mono text-blue-400">
                            {t.userRole}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 font-mono truncate">
                          {t.userEmail}
                        </p>
                        {lastMsg && (
                          <p className="text-[10px] text-slate-300 line-clamp-1 mt-1.5 italic">
                            &quot;{lastMsg.text}&quot;
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat threads details column */}
              <div
                className="md:col-span-2 bg-slate-950 rounded-xl border border-slate-850 p-4 min-h-[300px] flex flex-col justify-between"
                id="active-ticket-terminal"
              >
                {(() => {
                  const selTicket = supportTickets.find(
                    (t) => t.userEmail === selectedTicketEmail,
                  );
                  if (!selTicket) {
                    return (
                      <div className="flex-1 flex flex-col justify-center items-center text-slate-500 text-center gap-1">
                        <AlertOctagon className="w-8 h-8 text-slate-700 animate-pulse-slow" />
                        <h6 className="font-bold text-white text-[11px]">
                          Select Support Correspondence
                        </h6>
                        <p className="text-[10px] max-w-xs">
                          Select any active user complaint or landlord registry
                          ticket in the left column to initiate live replies.
                        </p>
                      </div>
                    );
                  }

                  const handleAdminSendLocalReply = () => {
                    if (!adminReplyText.trim()) return;
                    onReplyTicket(selTicket.userEmail, adminReplyText.trim());
                    setAdminReplyText("");
                    showFeedback(
                      `Dispatched live support response to ${selTicket.userName}`,
                    );
                  };

                  return (
                    <div
                      className="flex-1 flex flex-col justify-between h-full space-y-3"
                      id="active-reply-workspace"
                    >
                      <div>
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-1.5">
                          <div>
                            <h6 className="font-bold text-white text-xs">
                              {selTicket.userName}
                            </h6>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {selTicket.userEmail} &bull;{" "}
                              <span className="uppercase text-blue-400">
                                {selTicket.userRole}
                              </span>
                            </p>
                          </div>
                          <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold uppercase font-mono">
                            Live Session
                          </span>
                        </div>

                        {/* Thread panel scroll */}
                        <div
                          className="space-y-2 max-h-[160px] overflow-y-auto p-2 bg-slate-900/60 rounded-lg"
                          id="mod-ticket-scroll"
                        >
                          {selTicket.messages.map((m, mIdx) => {
                            const isMe = m.sender === "admin";
                            return (
                              <div
                                key={mIdx}
                                className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
                              >
                                <div
                                  className={`p-2 rounded-lg text-[10px] ${
                                    isMe
                                      ? "bg-blue-600 text-white rounded-br-none"
                                      : m.sender === "bot"
                                        ? "bg-slate-950 text-slate-500 italic font-mono"
                                        : "bg-slate-950 border border-slate-850 text-slate-300 rounded-bl-none"
                                  }`}
                                >
                                  <p>{m.text}</p>
                                </div>
                                <span className="text-[8px] text-slate-600 mt-0.5 font-mono">
                                  {m.sender === "admin"
                                    ? "Moderator Admin"
                                    : m.sender === "bot"
                                      ? "Safety Bot"
                                      : selTicket.userName}{" "}
                                  &bull;{" "}
                                  {new Date(m.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reply Input console */}
                      <div
                        className="flex gap-2 pt-2 border-t border-slate-900"
                        id="mod-reply-composer-bar"
                      >
                        <input
                          type="text"
                          placeholder={`Type direct audit response back to ${selTicket.userName}...`}
                          value={adminReplyText}
                          onChange={(e) => setAdminReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdminSendLocalReply();
                          }}
                          className="flex-1 bg-slate-900 border border-slate-850 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none"
                          id="mod-ticket-reply-input"
                        />
                        <button
                          onClick={handleAdminSendLocalReply}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase font-mono px-4 py-1.5 rounded transition-all"
                          id="mod-ticket-reply-btn"
                        >
                          Send Response
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
