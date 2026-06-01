import React from "react";
import { Agent, Property } from "../types";
import { X, ShieldCheck, MapPin, Star, Building2, Phone, Mail, Award, Clock } from "lucide-react";

interface AgentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
  properties: Property[];
  onSelectProperty: (propertyId: string) => void;
  onMessageAgent: (agentId: string) => void;
}

export default function AgentProfileModal({
  isOpen,
  onClose,
  agent,
  properties,
  onSelectProperty,
  onMessageAgent,
}: AgentProfileModalProps) {
  if (!isOpen || !agent) return null;

  // Filter properties belonging to this agent
  const agentProperties = properties.filter((p) => p.agentId === agent.id && p.status === "active");

  const mockReviews = [
    {
      author: "Sarah Jenkins",
      rating: 5,
      date: "2 months ago",
      text: `${agent.name} was incredibly helpful in finding our dream home. Highly recommended!`,
    },
    {
      author: "Marcus T.",
      rating: agent.rating >= 4.5 ? 5 : 4,
      date: "4 months ago",
      text: "Very professional and responsive. Guided us through the whole process seamlessly.",
    },
    {
      author: "Emily R.",
      rating: 4,
      date: "6 months ago",
      text: "Great experience overall. Knows the local market very well.",
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col relative overflow-hidden shadow-2xl animate-entrance-3d-effect my-4">
        
        {/* Header Cover */}
        <div className="h-24 md:h-36 bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-950 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/50 hover:bg-slate-900 border border-slate-800/50 text-slate-300 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-8">
          <div className="px-5 md:px-8 -mt-12 md:-mt-16 relative z-10">
            {/* Profile Info Header */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-4 border-slate-950 object-cover shadow-xl bg-slate-900"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                    {agent.name}
                  </h2>
                  {agent.isVerified && (
                    <div className="flex items-center gap-1 bg-blue-950/50 border border-blue-900/50 px-2 py-1 rounded-lg">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-lg text-slate-400 font-medium">{agent.agency}</p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-1.5 bg-amber-950/30 border border-amber-900/50 px-3 py-1.5 rounded-xl">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-amber-300">{agent.rating}</span>
                    <span className="text-xs text-amber-500">({agent.reviewCount} Reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/50 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold">{agent.areasServed[0]} & More</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMessageAgent(agent.id)}
                  className="flex-1 md:flex-none p-3 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  <span className="ml-2 text-sm font-bold font-mono">Message</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: About & Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Building2 className="w-6 h-6 text-slate-500 mb-2" />
                    <span className="text-xl font-bold text-white">{agent.performance.propertiesSold}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Properties Sold</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <Clock className="w-6 h-6 text-slate-500 mb-2" />
                    <span className="text-xl font-bold text-white">{agent.performance.avgDaysOnMarket}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Avg Days/Market</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center col-span-2">
                    <Award className="w-6 h-6 text-slate-500 mb-2" />
                    <span className="text-xl font-bold text-white">{agent.performance.responseRate}%</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Response Rate</span>
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">About {agent.name.split(" ")[0]}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {agent.bio}
                  </p>
                  
                  {agent.specialties && (
                    <div className="pt-2">
                      <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Specialties</h5>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map(spec => (
                          <span key={spec} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Areas Served</h5>
                    <div className="flex flex-wrap gap-2">
                      {agent.areasServed.map(area => (
                        <span key={area} className="px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[10px] text-slate-300">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Listings & Reviews */}
              <div className="lg:col-span-2 space-y-8">
                {/* Listings */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white tracking-tight">Active Listings</h3>
                    <span className="text-xs text-blue-400 font-semibold bg-blue-950/30 px-2 py-1 rounded-lg">
                      {agentProperties.length} Properties
                    </span>
                  </div>
                  
                  {agentProperties.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                      <Building2 className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-300">No active listings</p>
                      <p className="text-xs text-slate-500 mt-1">Check back later for new properties.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {agentProperties.map(prop => (
                        <div
                          key={prop.id}
                          onClick={() => {
                            onClose();
                            onSelectProperty(prop.id);
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer group flex flex-col"
                        >
                          <div className="h-32 relative overflow-hidden">
                            <img src={prop.photos[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-white border border-slate-800">
                              ${prop.price.toLocaleString()}
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-slate-200 text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">{prop.title}</h4>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" /> {prop.city}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reviews */}
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-4">Client Reviews</h3>
                  <div className="space-y-3">
                    {mockReviews.map((rev, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-bold text-sm text-white">{rev.author}</span>
                            <p className="text-[10px] text-slate-500">{rev.date}</p>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
