export interface PatientDemographics {
  age: string;
  sex: 'unspecified' | 'female' | 'male' | 'other';
  isPregnant?: boolean;
}

export interface MedicalHistory {
  conditions: string[];
  recentSurgeriesOrProcedures: string;
  currentMedications: string;
}

export interface HospitalFacility {
  name: string;
  facilityType: string;
  matchScore: number;
  matchReasons: string[];
  specializedDepartments: string[];
  keyEquipmentOnSite: string[];
  estimatedWaitTime: string;
  addressOrDistance: string;
  emergencyService24_7: boolean;
  phoneContact: string;
  secondOpinionAvailable: boolean;
}

export interface DiagnosticAnalysis {
  modality: string;
  anatomicalRegion: string;
  observedFindings: string;
  suspectedSpecialty: string;
  secondarySpecialties: string[];
  urgencyLevel: 'Emergency (Immediate / Call 911/112)' | 'Urgent (< 24-48 hours)' | 'Semi-Urgent (Within 1-2 weeks)' | 'Elective / Routine Outpatient' | string;
  triageReasoning: string;
  requiredEquipmentAndCapabilities: string[];
  recommendedFacilities: HospitalFacility[];
  clinicalQuestionsForPhysician: string[];
  preparationChecklist: string[];
  medicalDisclaimer: string;
}

export interface SampleScan {
  id: string;
  title: string;
  category: string;
  modality: string;
  anatomy: string;
  imagePath: string;
  defaultNotes: string;
  suggestedLocation: string;
  fallbackAnalysis: DiagnosticAnalysis;
}
