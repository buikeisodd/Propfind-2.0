import React, { useState } from "react";
import { Agent } from "../types";
import { User, ShieldCheck, MapPin, Star, Trophy, Search } from "lucide-react";

interface AgentDirectoryProps {
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
}

export default function AgentDirectory({ agents, onSelectAgent }: AgentDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");

  // Get unique locations
  const allLocations = Array.from(
    new Set(agents.flatMap((agent) => agent.areasServed))
  ).sort();

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.specialties && agent.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesLocation =
      selectedLocation === "all" || agent.areasServed.includes(selectedLocation);

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="animate-entrance-3d-effect">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h3 className="font-extrabold text-white text-2xl tracking-tight">Verified Agencies</h3>
          <p className="text-sm text-slate-400 mt-1">Connect with top-rated brokers and property specialists</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search names or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Service Areas</option>
            {allLocations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-slate-900">
          <User className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h4 className="text-white font-bold">No agencies found</h4>
          <p className="text-xs text-slate-500">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className="h-24 bg-gradient-to-r from-blue-900/20 to-slate-900/50 relative">
                {agent.isVerified && (
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur border border-slate-800 p-1.5 rounded-lg flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[9px] font-bold text-slate-300 tracking-wider uppercase">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col">
                <div className="flex justify-between items-end mb-3">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full border-4 border-slate-950 object-cover -mt-8 relative z-10 bg-slate-900"
                  />
                  <div className="flex items-center gap-1 bg-amber-950/30 border border-amber-900/50 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-amber-300">{agent.rating}</span>
                    <span className="text-[9px] text-amber-500">({agent.reviewCount})</span>
                  </div>
                </div>

                <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                  {agent.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium">{agent.agency}</p>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="line-clamp-1">{agent.areasServed.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Trophy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{agent.performance.propertiesSold} sales • {agent.performance.avgDaysOnMarket} days avg</span>
                  </div>
                </div>

                {agent.specialties && (
                  <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                    {agent.specialties.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px] font-mono">
                        {s}
                      </span>
                    ))}
                    {agent.specialties.length > 2 && (
                      <span className="bg-slate-900 border border-slate-800 text-slate-500 px-1 py-0.5 rounded text-[9px] font-mono">
                        +{agent.specialties.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
