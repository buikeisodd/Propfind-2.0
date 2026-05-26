import React from 'react';
import { Property } from '../types';
import { X, Check, Scale, BookmarkMinus, Sofa, Compass } from 'lucide-react';

interface PropertyCompareProps {
  properties: Property[];
  onRemoveFromCompare: (propertyId: string) => void;
  onSelectProperty: (propertyId: string) => void;
}

export default function PropertyCompare({
  properties,
  onRemoveFromCompare,
  onSelectProperty
}: PropertyCompareProps) {
  if (properties.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-2xl p-8 text-center text-slate-400 font-medium" id="empty-compare">
        <Scale className="w-8 h-8 mx-auto stroke-slate-500 mb-2" />
        <p className="text-sm">Click "Compare" on up to 4 listings to evaluate side-by-side attributes</p>
      </div>
    );
  }

  // Extract union of all unique amenities across these properties for the checklist comparison
  const allAmenities = Array.from(
    new Set(properties.flatMap((p) => p.amenities))
  ).sort().slice(0, 10); // Limit to top 10 for keeping summary elegant

  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl" id="compare-dashboard">
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between" id="compare-header">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Scale className="w-5 h-5" />
          </span>
          <h3 className="font-semibold text-white text-sm">Side-by-Side Property Matrix</h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 font-medium">
          {properties.length} of 4 Selected
        </span>
      </div>

      <div className="overflow-x-auto" id="compare-table-wrapper">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/40">
              <th className="p-4 font-semibold text-slate-400 w-1/5">Attributes</th>
              {properties.map((prop) => (
                <th key={prop.id} className="p-4 w-1/4 relative group min-w-[160px]">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromCompare(prop.id)}
                    className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-red-950/80 hover:text-red-400 rounded-full border border-slate-700/60 transition-colors"
                    title="Remove from comparison list"
                    id={`remove-compare-${prop.id}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex flex-col pt-3">
                    <img
                      src={prop.photos[0]}
                      alt={prop.title}
                      className="w-full h-24 object-cover rounded-lg mb-2 shadowIndex cursor-pointer hover:opacity-90"
                      onClick={() => onSelectProperty(prop.id)}
                    />
                    <h5
                      onClick={() => onSelectProperty(prop.id)}
                      className="font-bold text-white leading-snug tracking-tight hover:text-blue-400 cursor-pointer line-clamp-1"
                    >
                      {prop.title}
                    </h5>
                    <p className="text-blue-400 font-bold mt-1 tracking-tight font-mono">
                      {prop.listingType === 'rent'
                        ? `$${prop.price.toLocaleString()}/mo`
                        : prop.listingType === 'lease'
                        ? `$${prop.price.toLocaleString()}/lease`
                        : `$${prop.price.toLocaleString()}`}
                    </p>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                      {prop.city} &bull; {prop.propertyType}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {/* Core Specs */}
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Beds / Baths</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 font-semibold text-white">
                  {prop.bedrooms} Bed / {prop.bathrooms} Bath
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Square Footage</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 font-mono">
                  {prop.sizeSqFt.toLocaleString()} sqft
                  <span className="text-[10px] text-slate-500 block">
                    (${Math.round(prop.price / (prop.sizeSqFt || 1))}/sqft)
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Year Built</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 font-mono">{prop.yearBuilt}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Lot Size</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 text-slate-400">{prop.lotSize || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Status</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                    prop.status === 'active'
                      ? 'bg-blue-950 text-blue-400 border-blue-900/50'
                      : 'bg-amber-950 text-amber-500 border-amber-900/50'
                  }`}>
                    {prop.status}
                  </span>
                </td>
              ))}
            </tr>

            {/* Neighborhood Indexes */}
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">Walk & Transit Score</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4">
                  <div className="flex gap-2 text-[10px]" id={`scores-v3-${prop.id}`}>
                    <span className="bg-slate-900 p-1 px-1.5 rounded text-white border border-slate-800">
                      Walk: <strong className="text-blue-400">{prop.walkScore}</strong>
                    </span>
                    <span className="bg-slate-900 p-1 px-1.5 rounded text-white border border-slate-800">
                      Transit: <strong className="text-emerald-400">{prop.transitScore}</strong>
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* School Rating */}
            <tr>
              <td className="p-4 font-medium text-slate-400 bg-slate-900/10">School District Rating</td>
              {properties.map((prop) => (
                <td key={prop.id} className="p-4 font-semibold text-slate-300">
                  {prop.schoolRating}/10 Quality Index
                </td>
              ))}
            </tr>

            {/* Amenities Comparison Checklist */}
            <tr className="bg-slate-900/30">
              <td className="p-4 font-semibold text-white uppercase tracking-wider text-[10px]" colSpan={properties.length + 1}>
                Amenities Highlights
              </td>
            </tr>
            {allAmenities.map((amenity) => (
              <tr key={amenity}>
                <td className="p-4 text-slate-400 font-medium pl-6">{amenity}</td>
                {properties.map((prop) => {
                  const hasAmenity = prop.amenities.includes(amenity);
                  return (
                    <td key={prop.id} className="p-4">
                      {hasAmenity ? (
                        <div className="flex items-center gap-1.5 text-blue-400" id={`amenity-has-${prop.id}`}>
                          <Check className="w-4 h-4 stroke-2" />
                          <span className="text-[10px] text-slate-300 hidden sm:inline">Included</span>
                        </div>
                      ) : (
                        <div className="text-slate-600 font-mono text-[11px]" id={`amenity-no-${prop.id}`}>
                          &mdash;
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
