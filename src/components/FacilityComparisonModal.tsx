import React from 'react';
import { HospitalFacility } from '../types/diagnostic';
import { X, Check, Phone, ShieldCheck, MapPin } from 'lucide-react';

interface FacilityComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilities: HospitalFacility[];
  onRemove: (facility: HospitalFacility) => void;
}

export const FacilityComparisonModal: React.FC<FacilityComparisonModalProps> = ({
  isOpen,
  onClose,
  facilities,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Hospital Facility Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side evaluation of capabilities, equipment, and access timelines for your scan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Table / Grid Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {facilities.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No facilities selected for comparison. Click "Compare" on any hospital card to evaluate them side-by-side.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-semibold text-slate-500 w-44">Metric / Feature</th>
                    {facilities.map((fac, idx) => (
                      <th key={idx} className="py-3 px-4 font-bold text-slate-900 min-w-[220px]">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-bold text-slate-900 leading-tight">{fac.name}</div>
                            <div className="text-[11px] font-normal text-slate-500 mt-0.5">{fac.facilityType}</div>
                          </div>
                          <button
                            onClick={() => onRemove(fac)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Match Score */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Scan Match Score</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <span className="font-mono text-base font-bold text-teal-700 tabular-nums">
                          {fac.matchScore}%
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Distance / Campus */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Location / Campus</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4 text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{fac.addressOrDistance}</span>
                      </td>
                    ))}
                  </tr>

                  {/* Wait Time */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Estimated Access</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4 text-slate-800 font-medium">
                        {fac.estimatedWaitTime}
                      </td>
                    ))}
                  </tr>

                  {/* 24/7 Emergency */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">24/7 Emergency Center</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        {fac.emergencyService24_7 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <Check className="w-3.5 h-3.5" /> Yes (Full ER)
                          </span>
                        ) : (
                          <span className="text-slate-400">Specialty Clinic Only</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Second Opinion */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Remote 2nd Opinion</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        {fac.secondOpinionAvailable ? (
                          <span className="inline-flex items-center gap-1 text-teal-700 font-medium">
                            <ShieldCheck className="w-3.5 h-3.5" /> Telehealth & DICOM Upload
                          </span>
                        ) : (
                          <span className="text-slate-400">In-Person Only</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Key Equipment */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Advanced Equipment</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <ul className="space-y-1">
                          {fac.keyEquipmentOnSite.map((eq, eIdx) => (
                            <li key={eIdx} className="text-slate-600">
                              • {eq}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Specialized Units */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Relevant Departments</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <ul className="space-y-1">
                          {fac.specializedDepartments.map((dept, dIdx) => (
                            <li key={dIdx} className="text-slate-600">
                              • {dept}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Phone / Contact */}
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-medium text-slate-500">Scheduling Hotline</td>
                    {facilities.map((fac, idx) => (
                      <td key={idx} className="py-3 px-4">
                        <a
                          href={`tel:${fac.phoneContact.replace(/[^0-9]/g, '')}`}
                          className="font-mono text-slate-900 font-semibold hover:text-teal-700 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{fac.phoneContact}</span>
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
