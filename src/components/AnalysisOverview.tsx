import React from 'react';
import { DiagnosticAnalysis, PatientDemographics, MedicalHistory } from '../types/diagnostic';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, Activity, Cpu, Stethoscope, Crosshair, UserCheck } from 'lucide-react';

interface AnalysisOverviewProps {
  analysis: DiagnosticAnalysis;
  demographics?: PatientDemographics;
  medicalHistory?: MedicalHistory;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  analysis,
  demographics,
  medicalHistory,
}) => {
  // Determine urgency styling with non-hue-only markers
  const getUrgencyConfig = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('emergency')) {
      return {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />,
        label: 'EMERGENCY TRIAGE · IMMEDIATE ACTION REQUIRED',
        border: 'border-rose-200 bg-rose-50/40',
        marker: '✖',
      };
    }
    if (l.includes('urgent')) {
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
        label: 'URGENT ACUITY · EVALUATE WITHIN 24-48 HOURS',
        border: 'border-amber-200 bg-amber-50/40',
        marker: '▲',
      };
    }
    if (l.includes('semi')) {
      return {
        badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
        icon: <Clock className="w-5 h-5 text-sky-600 shrink-0" />,
        label: 'SEMI-URGENT · SPECIALIST APPOINTMENT WITHIN 1-2 WEEKS',
        border: 'border-sky-200 bg-sky-50/40',
        marker: '●',
      };
    }
    return {
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      label: 'ROUTINE / ELECTIVE OUTPATIENT ROUTING',
      border: 'border-emerald-200 bg-emerald-50/40',
      marker: '●',
    };
  };

  const urgency = getUrgencyConfig(analysis.urgencyLevel);

  return (
    <div className="space-y-4">
      {/* Urgency Alert Bar */}
      <div className={`p-4 rounded-xl border ${urgency.border} transition-all`}>
        <div className="flex items-start gap-3">
          {urgency.icon}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold tracking-wider">
                {urgency.marker} {urgency.label}
              </span>
              <span className="text-slate-400 font-mono text-xs">·</span>
              <span className="text-xs text-slate-600 font-medium">
                {analysis.urgencyLevel}
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {analysis.triageReasoning}
            </p>

            {/* Factored Demographics & Medical History Badge */}
            {(demographics?.age || demographics?.sex !== 'unspecified' || (medicalHistory?.conditions && medicalHistory.conditions.length > 0) || medicalHistory?.recentSurgeriesOrProcedures) && (
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-teal-600" />
                  <span>Patient Profile Factored:</span>
                </span>
                {demographics?.age && <span>{demographics.age} yrs</span>}
                {demographics?.sex && demographics.sex !== 'unspecified' && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="capitalize">{demographics.sex}</span>
                  </>
                )}
                {demographics?.isPregnant && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-semibold text-amber-700">Pregnancy Protocol Active</span>
                  </>
                )}
                {medicalHistory?.conditions && medicalHistory.conditions.length > 0 && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-700">{medicalHistory.conditions.join(', ')}</span>
                  </>
                )}
                {medicalHistory?.recentSurgeriesOrProcedures && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 italic">Hx: {medicalHistory.recentSurgeriesOrProcedures}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Diagnostic Findings & Clinical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Imaging Profile */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
            <Crosshair className="w-3.5 h-3.5 text-teal-600" />
            <span>Image Modality & Anatomical Focus</span>
          </div>

          <div>
            <div className="text-base font-semibold text-slate-900 leading-snug">
              {analysis.modality}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Region: <span className="font-medium text-slate-700">{analysis.anatomicalRegion}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-600 mb-1">Radiologic Observations:</div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
              {analysis.observedFindings}
            </p>
          </div>
        </div>

        {/* Required Specialty & Hospital Capabilities */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Recommended Clinical Specialty</span>
          </div>

          <div>
            <div className="text-base font-semibold text-slate-900 leading-snug">
              {analysis.suspectedSpecialty}
            </div>
            {analysis.secondarySpecialties && analysis.secondarySpecialties.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-1">
                <span>Allied:</span>
                {analysis.secondarySpecialties.map((spec, i) => (
                  <span key={i} className="text-slate-700">
                    {spec}{i < analysis.secondarySpecialties.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Mandatory Hospital Facilities & Medical Gear:</span>
            </div>
            <ul className="space-y-1 mt-1.5">
              {analysis.requiredEquipmentAndCapabilities.slice(0, 3).map((item, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
