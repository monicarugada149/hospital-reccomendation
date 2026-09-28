import { SampleScan } from '../types/diagnostic';

export const SAMPLE_SCANS: SampleScan[] = [
  {
    id: 'chest-xray-pulmonary',
    title: 'Adult Chest Radiograph (X-Ray)',
    category: 'Pulmonology & Thoracic',
    modality: 'Digital Posteroanterior (PA) Chest Radiograph',
    anatomy: 'Thoracic Cavity & Pulmonary Fields',
    imagePath: '/src/assets/images/sample_chest_xray_1790586483420.jpg',
    defaultNotes: 'Patient presents with persistent cough for 2 weeks, mild pleuritic chest discomfort, and intermittent low-grade fever.',
    suggestedLocation: 'Chicago, IL',
    fallbackAnalysis: {
      modality: 'Posteroanterior (PA) Digital Chest Radiograph',
      anatomicalRegion: 'Thoracic Cavity, Bronchovascular Tree, and Cardiac Silhouette',
      observedFindings: 'Bilateral lung fields demonstrate clear pulmonary aeration without focal consolidation, pneumothorax, or large pleural effusion. Cardiothoracic ratio is preserved within physiological limits (<0.50). Costophrenic and cardiophrenic angles are acute and well-defined. Bony thoracic cage structures and clavicles remain intact without acute displaced fracture.',
      suspectedSpecialty: 'Pulmonology & Respiratory Medicine',
      secondarySpecialties: ['Thoracic Surgery', 'Internal Medicine', 'Diagnostic Radiology'],
      urgencyLevel: 'Semi-Urgent (Within 1-2 weeks)',
      triageReasoning: 'Absence of pneumothorax, mediastinal widening, or dense lobar opacification rules out immediate life-threatening tension pathology. However, unresolved subacute pulmonary symptoms warrant formal pulmonology assessment and potential low-dose HRCT correlation.',
      requiredEquipmentAndCapabilities: [
        'High-Resolution Computed Tomography (HRCT) Dual-Energy Scanner',
        'Comprehensive Pulmonary Function Testing (PFT) Plethysmography Lab',
        'Endobronchial Ultrasound (EBUS) Bronchoscopy Suite',
        'Level 1 or 2 Pulmonary Critical Care ICU'
      ],
      recommendedFacilities: [
        {
          name: 'Northwestern Memorial Hospital - Comprehensive Pulmonary Center',
          facilityType: 'Academic Medical Center & Level 1 Trauma',
          matchScore: 97,
          matchReasons: [
            'Consistently ranked top 10 nationally for Pulmonology and Lung Care by U.S. News',
            'Full interventional bronchoscopy suite with 3D volumetric navigational guidance',
            'Integrated multidisciplinary chest clinic with same-week diagnostic access'
          ],
          specializedDepartments: ['Division of Pulmonary and Critical Care', 'Thoracic Imaging Institute', 'Respiratory Diagnostics'],
          keyEquipmentOnSite: ['Spectral Multi-Slice CT', 'EBUS Bronchoscopy Suite', 'Body Plethysmography PFT', 'Extracorporeal Membrane Oxygenation (ECMO) Unit'],
          estimatedWaitTime: '2-4 business days for specialized consultation',
          addressOrDistance: 'Streeterville Medical District · 1.4 miles',
          emergencyService24_7: true,
          phoneContact: '(312) 926-2000',
          secondOpinionAvailable: true
        },
        {
          name: 'Rush University Medical Center - Advanced Lung Disease Program',
          facilityType: 'Academic Medical Center & Research Institute',
          matchScore: 94,
          matchReasons: [
            'Dedicated Subacute Cough and Bronchial Disease Specialist Clinic',
            'Advanced imaging protocols reducing radiation exposure by up to 60%',
            'Direct electronic DICOM transfer and telehealth second-opinion availability'
          ],
          specializedDepartments: ['Pulmonary Medicine', 'Thoracic Surgery', 'Cardiopulmonary Diagnostics'],
          keyEquipmentOnSite: ['640-Slice Low-Dose CT', 'Cardiopulmonary Exercise Testing (CPET)', 'Diagnostic Radiography Suites'],
          estimatedWaitTime: '3-5 business days',
          addressOrDistance: 'Illinois Medical District · 3.8 miles',
          emergencyService24_7: true,
          phoneContact: '(312) 942-5000',
          secondOpinionAvailable: true
        },
        {
          name: 'University of Chicago Medicine - Center for Chest Diseases',
          facilityType: 'Tertiary Academic Medical Center',
          matchScore: 92,
          matchReasons: [
            'Pioneers in precision thoracic imaging and biomarker-guided respiratory care',
            'Comprehensive pulmonary rehabilitation program and on-site pharmacy support',
            '24/7 Adult Emergency Department with dedicated chest pain and dyspnea observation'
          ],
          specializedDepartments: ['Section of Pulmonary & Critical Care Medicine', 'Center for Advanced Medicine'],
          keyEquipmentOnSite: ['Dual-Source CT', 'High-Flow Bronchial Thermoplasty', 'Cardiothoracic Interventional Suites'],
          estimatedWaitTime: '5-7 business days',
          addressOrDistance: 'Hyde Park Campus · 7.6 miles',
          emergencyService24_7: true,
          phoneContact: '(773) 702-1000',
          secondOpinionAvailable: true
        }
      ],
      clinicalQuestionsForPhysician: [
        'Do the visible bronchovascular markings warrant a high-resolution non-contrast chest CT (HRCT) to evaluate small airways?',
        'Would formal spirometry and pulmonary function testing be recommended given the symptom duration?',
        'Are there signs of bronchial hyperreactivity or post-infectious reactive airway syndrome?',
        'What threshold of symptom change (e.g., hemoptysis, nocturnal dyspnea) should prompt immediate emergency presentation?'
      ],
      preparationChecklist: [
        'Request the original DICOM raw files or CD-ROM from the radiologic imaging center to take to your appointment.',
        'Document a daily log of coughing episodes, sputum production/color, and exercise tolerance triggers.',
        'Bring a complete list of all active medications, inhalers, and any past allergy treatments.',
        'Verify in-network insurance prior authorization for outpatient specialist pulmonary consultation.'
      ],
      medicalDisclaimer: 'This facility recommendation and imaging screening is an assistive AI routing tool. It does not replace an in-person physical examination, auscultation, or definitive radiologic reading by a licensed radiologist or pulmonologist.'
    }
  },
  {
    id: 'knee-mri-orthopedic',
    title: 'Knee Joint Sagittal MRI (T1/T2)',
    category: 'Orthopedics & Sports Medicine',
    modality: 'High-Field Sagittal Magnetic Resonance Imaging (MRI)',
    anatomy: 'Musculoskeletal System - Right Knee Articulation',
    imagePath: '/src/assets/images/sample_knee_mri_1790586495285.jpg',
    defaultNotes: 'Patient sustained sports-related knee torsion 48 hours ago. Severe pain with joint swelling, clicking sensation, and difficulty bearing weight.',
    suggestedLocation: 'New York, NY',
    fallbackAnalysis: {
      modality: 'Sagittal High-Resolution Knee MRI (T1/T2 Fast Spin Echo)',
      anatomicalRegion: 'Musculoskeletal / Right Femorotibial and Patellofemoral Joints',
      observedFindings: 'Evaluation demonstrates distal femoral and proximal tibial bone alignment. Articular cartilage overlying the femoral condyles and patellar facet is visualized. Cruciate ligaments (ACL/PCL) and collateral structures are assessed alongside medial and lateral meniscal horns. Joint space demonstrates effusion consistent with acute post-traumatic reaction.',
      suspectedSpecialty: 'Orthopedic Surgery & Sports Medicine',
      secondarySpecialties: ['Physical Medicine & Rehabilitation (Physiatry)', 'Musculoskeletal Radiology', 'Sports Physical Therapy'],
      urgencyLevel: 'Urgent (< 24-48 hours)',
      triageReasoning: 'Presence of mechanical symptoms (locking/clicking, acute inability to bear weight) and intra-articular effusion suggests possible meniscal tear or ligamentous compromise requiring prompt orthopedic clinical evaluation to avoid secondary chondral damage.',
      requiredEquipmentAndCapabilities: [
        '3.0 Tesla Dedicated Musculoskeletal MRI with Extremity Coils',
        'Ambulatory Orthopedic Arthroscopic Surgical Center',
        'Digital Fluoroscopy and Weight-Bearing Radiography Suites',
        'Advanced Sports Medicine Motion Analysis & Rehab Gymnasium'
      ],
      recommendedFacilities: [
        {
          name: 'Hospital for Special Surgery (HSS) - Sports Medicine Institute',
          facilityType: 'Specialized Orthopedic Hospital (#1 in Nation)',
          matchScore: 99,
          matchReasons: [
            'Ranked #1 in the United States for Orthopedics for 14 consecutive years',
            'Pioneering 3T MRI dedicated knee protocols with sub-millimeter cartilage mapping',
            'World-class sports medicine surgeons serving major Olympic and professional teams'
          ],
          specializedDepartments: ['Sports Medicine Institute', 'Knee Service', 'Department of Radiology & Imaging'],
          keyEquipmentOnSite: ['Multiple 3.0T High-Field MRIs', 'Outpatient Arthroscopy Suites', 'Robotic Knee Navigation (Mako)', 'Dynamic Biomechanics Lab'],
          estimatedWaitTime: 'Same-day urgent sports injury triage; 2-3 days for elective surgeons',
          addressOrDistance: 'Upper East Side · 2.1 miles',
          emergencyService24_7: false,
          phoneContact: '(212) 606-1000',
          secondOpinionAvailable: true
        },
        {
          name: 'NYU Langone Orthopedic Hospital',
          facilityType: 'Academic Specialty Medical Center',
          matchScore: 96,
          matchReasons: [
            'Comprehensive knee preservation and ligament reconstruction center',
            'Full 24/7 Orthopedic Emergency Triage Room specifically for acute bone/joint injuries',
            'Direct access to top physical therapists and regenerative biologics team'
          ],
          specializedDepartments: ['Department of Orthopedic Surgery', 'Harkness Center', 'Musculoskeletal Imaging'],
          keyEquipmentOnSite: ['EOS Ultra-Low Dose Full-Body Imaging', '3T MRI', 'High-Frequency Musculoskeletal Ultrasound'],
          estimatedWaitTime: 'Same-day walk-in urgent orthopedic clinic',
          addressOrDistance: 'Gramercy / East Side · 3.4 miles',
          emergencyService24_7: true,
          phoneContact: '(212) 598-6000',
          secondOpinionAvailable: true
        },
        {
          name: 'Mount Sinai Hospital - Dubin Center for Musculoskeletal Care',
          facilityType: 'Academic Medical Center & Trauma Network',
          matchScore: 92,
          matchReasons: [
            'Integrated multidisciplinary team combining physiatry, surgery, and joint therapy',
            'Advanced cartilage restoration and minimally invasive knee arthroscopy',
            'Comprehensive insurance network acceptance across major commercial and HMO plans'
          ],
          specializedDepartments: ['Orthopedic Surgery', 'Sports Medicine & Shoulder Service'],
          keyEquipmentOnSite: ['Wide-Bore 3T MRI', 'Digital Orthopedic Radiography', 'Platelet-Rich Plasma (PRP) Biologics Lab'],
          estimatedWaitTime: '3-4 business days',
          addressOrDistance: 'Upper Manhattan · 4.9 miles',
          emergencyService24_7: true,
          phoneContact: '(212) 241-6500',
          secondOpinionAvailable: true
        }
      ],
      clinicalQuestionsForPhysician: [
        'Does the scan demonstrate an unstable meniscal tear (e.g., bucket-handle) requiring arthroscopic repair versus non-operative management?',
        'What is the integrity status of the anterior cruciate ligament (ACL) and posterolateral corner?',
        'Is immediate joint aspiration indicated to relieve high-pressure hematoma or hemarthrosis?',
        'What weight-bearing restrictions, bracing, and initial physical therapy protocols should be initiated immediately?'
      ],
      preparationChecklist: [
        'Bring the MRI CD-ROM and formal radiologist report to the clinic in uncompressed format.',
        'Wear loose athletic clothing or shorts that allow complete unhindered exposure of the knee joint.',
        'Use crutches or a hinged knee immobilizer if weight-bearing elicits sharp instability or acute buckling.',
        'Avoid high-impact activities or aggressive self-stretching until evaluated by the orthopedic specialist.'
      ],
      medicalDisclaimer: 'This recommendation is an informational routing aid. It does not replace physical examination maneuvers (e.g., Lachman, McMurray test) or formal evaluation by an orthopedic surgeon.'
    }
  },
  {
    id: 'brain-ct-neuro',
    title: 'Cranial Axial Non-Contrast CT Scan',
    category: 'Neurology & Neurosurgery',
    modality: 'Axial Non-Contrast Head Computed Tomography (CT)',
    anatomy: 'Central Nervous System - Cranial Cavity & Cerebral Hemispheres',
    imagePath: '/src/assets/images/sample_brain_ct_1790586507688.jpg',
    defaultNotes: 'Patient experiencing new acute onset thunderclap headache, mild right-sided sensory tingling, and photophobia.',
    suggestedLocation: 'Houston, TX',
    fallbackAnalysis: {
      modality: 'Axial Non-Contrast Head Computed Tomography (CT)',
      anatomicalRegion: 'Intracranial Parenchyma, Ventricular System, and Calvarium',
      observedFindings: 'Axial slices show symmetric cerebral hemispheres with intact gray-white matter differentiation. Ventricular system (lateral ventricles, third ventricle) is symmetric in caliber without midline shift, hydrocephalus, or mass effect. Basal cisterns appear patent. No acute hyperdense intra-axial or extra-axial hemorrhage (subdural, epidural, or subarachnoid) identifiable on current slice presentation.',
      suspectedSpecialty: 'Neurology & Stroke / Neurovascular Team',
      secondarySpecialties: ['Neurosurgery', 'Neuroradiology', 'Neurocritical Care'],
      urgencyLevel: 'Emergency (Immediate / Call 911/112)',
      triageReasoning: 'Acute onset thunderclap headache with unilateral neurological tingling requires immediate clinical exclusion of sentinel subarachnoid hemorrhage, dissection, or acute ischemic penumbra. Immediate Comprehensive Stroke Center evaluation is indicated.',
      requiredEquipmentAndCapabilities: [
        'Certified Comprehensive Stroke Center (CSC) with 24/7 Endovascular Thrombectomy',
        'CT Angiography (CTA) & CT Perfusion (CTP) Rapid Multi-Detector Scanners',
        'Biplane Neurointerventional Angiography Suite (Cath Lab)',
        'Dedicated Neuro-Intensive Care Unit (Neuro-ICU) staffed by Neurointensivists'
      ],
      recommendedFacilities: [
        {
          name: 'Houston Methodist Hospital - Neurological Institute',
          facilityType: 'Comprehensive Stroke Center & Level 1 Academic Medical Center',
          matchScore: 98,
          matchReasons: [
            'Ranked top 10 nationally in Neurology & Neurosurgery with comprehensive 24/7 acute response',
            'Dedicated biplane neurointerventional suites with average door-to-treatment under 22 minutes',
            'Full neurocritical care unit with continuous multimodality EEG and intracranial monitoring'
          ],
          specializedDepartments: ['Neurological Institute', 'Comprehensive Stroke Center', 'Neuro-Endovascular Surgery'],
          keyEquipmentOnSite: ['Dual-Source Spectral CT', 'Biplane Angiography Suite', '3T Neuro-MRI', 'Neuro-ICU with 48 Dedicated Beds'],
          estimatedWaitTime: 'Immediate emergency triage; under 15 minutes for neuro stroke activation',
          addressOrDistance: 'Texas Medical Center · 0.8 miles',
          emergencyService24_7: true,
          phoneContact: '(713) 790-3333',
          secondOpinionAvailable: true
        },
        {
          name: 'Memorial Hermann - Texas Medical Center (Mischer Neuroscience Institute)',
          facilityType: 'Level 1 Trauma Center & Comprehensive Stroke Center',
          matchScore: 96,
          matchReasons: [
            'One of the largest Level 1 Trauma and neurovascular emergency centers in the nation',
            'Home to the UTHealth Stroke Team, pioneers in acute thrombolysis and mechanical thrombectomy',
            'Dedicated 24/7 Mobile Stroke Unit capability across the Houston metropolitan area'
          ],
          specializedDepartments: ['Mischer Neuroscience Institute', 'Department of Neurosurgery', 'Neurotrauma Center'],
          keyEquipmentOnSite: ['Intraoperative CT & MRI', 'Neuro-Angiography', 'Rapid CTP Perfusion Software (RAPID.AI)'],
          estimatedWaitTime: 'Immediate 24/7 emergency walk-in / EMS transport',
          addressOrDistance: 'Texas Medical Center · 1.2 miles',
          emergencyService24_7: true,
          phoneContact: '(713) 704-4000',
          secondOpinionAvailable: true
        },
        {
          name: 'Baylor St. Luke\'s Medical Center - McNair Campus',
          facilityType: 'Academic Tertiary Medical Center',
          matchScore: 91,
          matchReasons: [
            'Affiliated with Baylor College of Medicine with world-renowned neuroradiologists',
            'Dedicated headache and neurovascular emergency evaluation pathways',
            'Seamless transition to outpatient neurovascular prevention and second opinion clinics'
          ],
          specializedDepartments: ['Neurology Service', 'Neurovascular Interventional Radiology'],
          keyEquipmentOnSite: ['High-Speed 256-Slice CT', 'MRI 3.0T Skyra', 'Transfemoral Neuro-Cath Suite'],
          estimatedWaitTime: 'Immediate ER triage; 24-48 hours for neurology consult',
          addressOrDistance: 'Texas Medical Center / Fannin St · 1.6 miles',
          emergencyService24_7: true,
          phoneContact: '(832) 355-1000',
          secondOpinionAvailable: true
        }
      ],
      clinicalQuestionsForPhysician: [
        'Is immediate CT Angiography (CTA) or lumbar puncture indicated to rule out non-traumatic subarachnoid hemorrhage or aneurysm?',
        'Does the patient meet criteria for urgent vascular imaging (CTA head and neck) to evaluate arterial dissection?',
        'Would a brain MRI with diffusion-weighted imaging (DWI) and MR Angiography provide additional diagnostic sensitivity?',
        'Are there any red-flag systemic signs warranting admission to the neuro-observation unit?'
      ],
      preparationChecklist: [
        'If experiencing acute neurological deficits or worst headache of life, do not drive; call emergency EMS (911).',
        'Have a family member or caregiver present to assist with accurate medical history and symptom timeline.',
        'Keep patient fasting (NPO) in case urgent contrast-enhanced studies or endovascular intervention is required.',
        'Bring identification and list of blood-thinning medications (anticoagulants/antiplatelets).'
      ],
      medicalDisclaimer: 'CRITICAL EMERGENCY WARNING: Acute thunderclap headache or focal neurological deficits are medical emergencies. Seek immediate care at the nearest Emergency Department or call 911/112.'
    }
  }
];

export const POPULAR_LOCATIONS = [
  'Chicago, IL',
  'New York, NY',
  'Houston, TX',
  'Los Angeles, CA',
  'Boston, MA',
  'Philadelphia, PA',
  'San Francisco, CA',
  'London, UK',
  'Toronto, ON'
];
