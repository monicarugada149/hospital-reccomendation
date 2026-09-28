import React, { useState } from 'react';
import { HospitalFacility } from '../types/diagnostic';
import { Building2, Phone, MapPin, Clock, Shield, Award, CheckCircle, Scale, ExternalLink } from 'lucide-react';

interface FacilityListProps {
  facilities: HospitalFacility[];
  selectedForComparison: HospitalFacility[];
  onToggleComparison: (facility: HospitalFacility) => void;
  onOpenComparisonModal: () => void;
}

export const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  selectedForComparison,
  onToggleComparison,
  onOpenComparisonModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'emergency' | 'top' | 'second-opinion'>('all');

  const filteredFacilities = facilities.filter((fac) => {
    if (filter === 'emergency') return fac.emergencyService24_7;
    if (filter === 'top') return fac.matchScore >= 95;
    if (filter === 'second-opinion') return fac.secondOpinionAvailable;
    return true;
  });

  const isSelectedForComparison = (name: string) => {
    return selectedForComparison.some((f) => f.name === name);
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Recommended Medical Facilities</span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              ({filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} matched)
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked based on diagnostic scan modality, specialty capability, and clinical equipment.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'emergency'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24/7 Emergency
          </button>
          <button
            onClick={() => setFilter('top')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'top'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Top Match (95%+)
          </button>
          <button
            onClick={() => setFilter('second-opinion')}
            className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors ${
              filter === 'second-opinion'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Second Opinion
          </button>
        </div>
      </div>

      {/* Comparison Drawer Trigger if any facility is selected */}
      {selectedForComparison.length > 0 && (
        <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-700" />
            <span className="font-semibold">
              {selectedForComparison.length} {selectedForComparison.length === 1 ? 'facility' : 'facilities'} selected for side-by-side comparison
            </span>
          </div>
          <button
            onClick={onOpenComparisonModal}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Open Comparison Matrix →
          </button>
        </div>
      )}

      {/* Facilities Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFacilities.map((fac, idx) => {
          const inComparison = isSelectedForComparison(fac.name);

          return (
            <div
              key={idx}
              className={`p-5 rounded-xl bg-white border transition-all ${
                inComparison
                  ? 'border-teal-400 ring-2 ring-teal-500/10 shadow-sm'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Clean unboxed metadata kicker */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-medium text-teal-700">{fac.facilityType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {fac.addressOrDistance}
                    </span>
                    {fac.emergencyService24_7 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                          <Shield className="w-3 h-3" />
                          24/7 ER Available
                        </span>
                      </>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 tracking-tight">
                    {fac.name}
                  </h4>
                </div>

                {/* Score & Match Indicator */}
                <div className="flex items-center gap-3 shrink-0 self-start">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                      Specialty Match
                    </div>
                    <div className="text-xl font-bold font-mono text-teal-700 tabular-nums">
                      {fac.matchScore}%
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleComparison(fac)}
                    className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      inComparison
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title={inComparison ? 'Remove from comparison' : 'Compare with other facilities'}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {inComparison ? 'Selected' : 'Compare'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clinical Match Rationale for this Scan:</span>
                </div>
                <ul className="space-y-1">
                  {fac.matchReasons.map((reason, rIdx) => (
                    <li key={rIdx} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* On-Site Equipment & Key Departments */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Verified Equipment & Suites:</span>
                  <div className="flex flex-wrap gap-1 text-slate-600 mt-1">
                    {fac.keyEquipmentOnSite.map((eq, eIdx) => (
                      <span key={eIdx}>
                        {eq}{eIdx < fac.keyEquipmentOnSite.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Specialized Units:</span>
                  <div className="flex flex-wrap gap-1 text-slate-600 mt-1">
                    {fac.specializedDepartments.map((dept, dIdx) => (
                      <span key={dIdx}>
                        {dept}{dIdx < fac.specializedDepartments.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Access: <strong className="text-slate-700">{fac.estimatedWaitTime}</strong></span>
                  </span>
                  {fac.secondOpinionAvailable && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-teal-700 font-medium">Remote 2nd Opinion Available</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${fac.phoneContact.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{fac.phoneContact}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fac.name + ' ' + fac.addressOrDistance)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    title="View Hospital Location on Map"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
