import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  MapPin,
  Compass,
  FileText,
  Check,
  AlertCircle,
  User,
  HeartPulse,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SAMPLE_SCANS, POPULAR_LOCATIONS } from '../data/sampleScans';
import { SampleScan, PatientDemographics, MedicalHistory } from '../types/diagnostic';

interface UploadStageProps {
  onImageSelected: (base64: string, mimeType: string, fileTitle: string, sampleData?: SampleScan) => void;
  selectedSampleId: string | null;
  patientLocation: string;
  onLocationChange: (loc: string) => void;
  clinicalNotes: string;
  onClinicalNotesChange: (notes: string) => void;
  insuranceType: string;
  onInsuranceChange: (ins: string) => void;
  demographics: PatientDemographics;
  onDemographicsChange: (demographics: PatientDemographics) => void;
  medicalHistory: MedicalHistory;
  onMedicalHistoryChange: (history: MedicalHistory) => void;
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
  hasImageLoaded: boolean;
}

const COMMON_CLINICAL_FLAGS = [
  { id: 'Pacemaker / Metal Implant', label: 'Pacemaker / Metal Implant', critical: true, hint: 'MRI safety' },
  { id: 'Contrast Dye Allergy', label: 'Contrast Dye Allergy', critical: true, hint: 'Pre-med / non-contrast' },
  { id: 'Anticoagulant / Blood Thinners', label: 'Blood Thinners / Anticoagulants', critical: true, hint: 'Hemorrhage risk' },
  { id: 'Kidney / Renal Disease', label: 'Kidney / Renal Impairment', critical: false, hint: 'Contrast clearance' },
  { id: 'Diabetes Mellitus', label: 'Diabetes Mellitus', critical: false, hint: 'Metabolic care' },
  { id: 'COPD / Severe Asthma', label: 'COPD / Asthma', critical: false, hint: 'Respiratory airway' },
  { id: 'Hypertension / Heart Disease', label: 'Cardiovascular Disease', critical: false, hint: 'Cardiac monitoring' },
];

export const UploadStage: React.FC<UploadStageProps> = ({
  onImageSelected,
  selectedSampleId,
  patientLocation,
  onLocationChange,
  clinicalNotes,
  onClinicalNotesChange,
  insuranceType,
  onInsuranceChange,
  demographics,
  onDemographicsChange,
  medicalHistory,
  onMedicalHistoryChange,
  isAnalyzing,
  onRunAnalysis,
  hasImageLoaded,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemographicsExpanded, setIsDemographicsExpanded] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/') && !file.name.endsWith('.dcm')) {
      setErrorMessage('Please upload a standard diagnostic image (JPG, PNG, WEBP, or DICOM export).');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('File exceeds 30MB limit. Please upload a compressed medical image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result, file.type || 'image/jpeg', file.name);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleScan) => {
    setErrorMessage(null);
    onLocationChange(sample.suggestedLocation);
    onClinicalNotesChange(sample.defaultNotes);

    // Preset demographics and clinical context depending on the sample
    if (sample.id === 'knee-mri-orthopedic') {
      onDemographicsChange({ age: '29', sex: 'female', isPregnant: false });
      onMedicalHistoryChange({
        conditions: [],
        recentSurgeriesOrProcedures: 'Prior left knee ACL reconstruction 4 years ago',
        currentMedications: 'Ibuprofen 400mg as needed'
      });
    } else if (sample.id === 'brain-ct-neuro') {
      onDemographicsChange({ age: '67', sex: 'male', isPregnant: false });
      onMedicalHistoryChange({
        conditions: ['Anticoagulant / Blood Thinners', 'Hypertension / Heart Disease'],
        recentSurgeriesOrProcedures: 'Coronary angioplasty in 2023',
        currentMedications: 'Apixaban (Eliquis) 5mg, Amlodipine 10mg'
      });
    } else {
      onDemographicsChange({ age: '54', sex: 'male', isPregnant: false });
      onMedicalHistoryChange({
        conditions: ['COPD / Severe Asthma'],
        recentSurgeriesOrProcedures: 'None',
        currentMedications: 'Albuterol inhaler, Fluticasone'
      });
    }

    fetch(sample.imagePath)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          onImageSelected(base64data, blob.type || 'image/jpeg', sample.title, sample);
        };
        reader.readAsDataURL(blob);
      })
      .catch((err) => {
        console.error('Failed to load sample image:', err);
        onImageSelected(sample.imagePath, 'image/jpeg', sample.title, sample);
      });
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onLocationChange('Chicago, IL (Nearby)');
        },
        () => {
          onLocationChange('New York, NY');
        }
      );
    } else {
      onLocationChange('Chicago, IL');
    }
  };

  const toggleCondition = (conditionId: string) => {
    const current = medicalHistory.conditions || [];
    const exists = current.includes(conditionId);
    const updated = exists
      ? current.filter((c) => c !== conditionId)
      : [...current, conditionId];

    onMedicalHistoryChange({
      ...medicalHistory,
      conditions: updated,
    });
  };

  return (
    <div className="space-y-5">
      {/* 1-Click Sample Scans Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1-Click Sample Diagnostic Scans
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Instant demonstration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_SCANS.map((scan) => {
            const isSelected = selectedSampleId === scan.id;
            return (
              <button
                key={scan.id}
                onClick={() => handleSelectSample(scan)}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <img
                  src={scan.imagePath}
                  alt={scan.title}
                  className="w-12 h-12 rounded object-cover grayscale contrast-125 bg-slate-900 shrink-0 border border-slate-300"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {scan.title}
                  </div>
                  <div className="text-[11px] text-teal-700 font-medium truncate">
                    {scan.category}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Loc: {scan.suggestedLocation}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & Drop Upload Stage */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-teal-500 bg-teal-50/30'
            : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.dcm"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Upload Diagnostic Medical Image
          </h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Drag and drop your X-ray, MRI, CT scan, ultrasound, clinical photograph, or lab report here, or click to browse.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>PNG · JPG · WEBP · DICOM</span>
            <span>·</span>
            <span>Max 30MB</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center justify-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* NEW SECTION: Patient Demographics & Recent Medical History */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setIsDemographicsExpanded(!isDemographicsExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span>Patient Demographics & Medical History</span>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 font-medium">
                  Enhances Triage Accuracy
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Age, biological sex, surgical history & safety flags (e.g. Pacemaker, contrast allergy)
              </div>
            </div>
          </div>
          <div className="text-slate-400">
            {isDemographicsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isDemographicsExpanded && (
          <div className="p-4 pt-1 border-t border-slate-100 space-y-4 text-xs">
            {/* Demographics Row: Age & Biological Sex */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Age */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Age:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="125"
                    value={demographics.age}
                    onChange={(e) =>
                      onDemographicsChange({
                        ...demographics,
                        age: e.target.value,
                      })
                    }
                    placeholder="e.g. 45"
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 font-mono tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-mono">
                    years
                  </span>
                </div>
              </div>

              {/* Biological Sex */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Biological Sex:
                </label>
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 rounded-lg">
                  {(
                    [
                      { id: 'male', label: 'Male' },
                      { id: 'female', label: 'Female' },
                      { id: 'other', label: 'Other' },
                      { id: 'unspecified', label: 'Unspec.' },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        onDemographicsChange({
                          ...demographics,
                          sex: option.id,
                        })
                      }
                      className={`py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer text-center ${
                        demographics.sex === option.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pregnancy Checkbox (Crucial for radiation safety / CT / X-ray protocols) */}
            {(demographics.sex === 'female' || demographics.sex === 'other' || demographics.sex === 'unspecified') && (
              <div className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-xs text-amber-900">
                    Currently Pregnant or Potential Pregnancy?
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={demographics.isPregnant || false}
                    onChange={(e) =>
                      onDemographicsChange({
                        ...demographics,
                        isPregnant: e.target.checked,
                      })
                    }
                    className="rounded border-amber-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-amber-900">
                    {demographics.isPregnant ? 'Yes (Active Flag)' : 'No'}
                  </span>
                </label>
              </div>
            )}

            {/* Critical Clinical Safety Flags & Risk Factors */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
                  <span>Clinical Safety Flags & Chronic Conditions:</span>
                </label>
                <span className="text-[10px] text-slate-400">Click to toggle</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {COMMON_CLINICAL_FLAGS.map((flag) => {
                  const isActive = medicalHistory.conditions?.includes(flag.id);
                  return (
                    <button
                      key={flag.id}
                      type="button"
                      onClick={() => toggleCondition(flag.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? flag.critical
                            ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                            : 'bg-teal-50 text-teal-800 border-teal-300 ring-1 ring-teal-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                      title={flag.hint}
                    >
                      {isActive && <Check className="w-3 h-3 shrink-0" />}
                      <span>{flag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Surgeries or Interventions */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Recent Surgeries, Implants, or Procedures (Past 12-24 Months):
              </label>
              <input
                type="text"
                value={medicalHistory.recentSurgeriesOrProcedures}
                onChange={(e) =>
                  onMedicalHistoryChange({
                    ...medicalHistory,
                    recentSurgeriesOrProcedures: e.target.value,
                  })
                }
                placeholder="e.g. Left knee arthroscopy 6 mos ago, stent placed, fracture fixation..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800"
              />
            </div>

            {/* Current Active Medications */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Current Active Medications (Blood thinners, insulin, inhalers):
              </label>
              <input
                type="text"
                value={medicalHistory.currentMedications}
                onChange={(e) =>
                  onMedicalHistoryChange({
                    ...medicalHistory,
                    currentMedications: e.target.value,
                  })
                }
                placeholder="e.g. Eliquis 5mg, Metformin, Lisinopril, Albuterol..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        )}
      </div>

      {/* Patient Location & Clinical Routing Context */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Compass className="w-4 h-4 text-teal-600" />
          <span>Patient Location & Clinical Routing Context</span>
        </div>

        {/* Location Selector */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Patient City / Region for Hospital Matching:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientLocation}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="e.g. Chicago, IL or New York, NY"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800"
              />
            </div>
            <button
              type="button"
              onClick={handleDetectLocation}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
            >
              Auto-Locate
            </button>
          </div>

          {/* Quick city chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400">Quick hubs:</span>
            {POPULAR_LOCATIONS.slice(0, 6).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onLocationChange(loc)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  patientLocation.includes(loc.split(',')[0])
                    ? 'bg-teal-100 text-teal-900 border border-teal-300'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Clinical Symptoms / Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
            <span>Presenting Symptoms & Clinical Notes:</span>
            <span className="text-[11px] text-slate-400 font-normal">Assists specialty precision</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => onClinicalNotesChange(e.target.value)}
              placeholder="e.g. Acute knee injury after sports collision, severe swelling, cannot put weight on leg..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white text-slate-800 resize-none"
            />
          </div>
        </div>

        {/* Insurance Coverage Preference */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Insurance & Network Tier:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Commercial / Medicare', label: 'Commercial & Medicare' },
              { id: 'In-Network Priority', label: 'In-Network Tier' },
              { id: 'Self-Pay / International', label: 'Self-Pay / Global' },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => onInsuranceChange(tier.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                  insuranceType === tier.id
                    ? 'border-teal-500 bg-teal-50 text-teal-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={!hasImageLoaded || isAnalyzing}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Analyzing Scan & Querying Specialized Facilities...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Identify Medical Facilities for this Scan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
