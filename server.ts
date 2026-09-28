import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with 35MB limit for high-resolution medical imaging uploads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize Gemini client strictly with User-Agent as instructed by gemini-api skill
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY environment variable is not defined.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Response schema for structured diagnostic analysis and hospital recommendations
const diagnosticRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    modality: {
      type: Type.STRING,
      description: 'The identified imaging modality (e.g. Chest Radiograph (X-Ray), Knee MRI (Sagittal T1), Non-Contrast Axial Head CT, Abdominal Ultrasound, ECG Strip, etc.)',
    },
    anatomicalRegion: {
      type: Type.STRING,
      description: 'The body region/part shown in the scan (e.g. Thorax / Pulmonary Fields, Musculoskeletal / Right Knee Joint, Cranial / Neurovascular, Abdomen, etc.)',
    },
    observedFindings: {
      type: Type.STRING,
      description: 'Detailed radiologic and clinical observations from the image, describing visible anatomical structures and any identifiable indicators.',
    },
    suspectedSpecialty: {
      type: Type.STRING,
      description: 'Primary medical specialty recommended for consultation (e.g. Pulmonology, Orthopedic Surgery, Neurology, Cardiology, Gastroenterology, Oncology).',
    },
    secondarySpecialties: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Secondary or allied medical specialties (e.g. Physical Therapy, Interventional Radiology, Rheumatology).',
    },
    urgencyLevel: {
      type: Type.STRING,
      description: 'Triage acuity: "Emergency (Immediate / Call 911/112)", "Urgent (< 24-48 hours)", "Semi-Urgent (Within 1-2 weeks)", or "Elective / Routine Outpatient".',
    },
    triageReasoning: {
      type: Type.STRING,
      description: 'Clinical justification for why this urgency level was selected based on the findings.',
    },
    requiredEquipmentAndCapabilities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Crucial hospital facilities and medical equipment required (e.g., 3.0T High-field MRI, Level 1 Trauma Center, Dual-source CT, 24/7 Cath Lab, Robotic Surgery Suite).',
    },
    recommendedFacilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Hospital or Medical Center Name' },
          facilityType: { type: Type.STRING, description: 'e.g. Academic Medical Center & Level 1 Trauma, Specialized Orthopedic Institute, Comprehensive Cancer Center' },
          matchScore: { type: Type.INTEGER, description: 'Percentage match score between 80 and 99' },
          matchReasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '2 to 3 bullet points detailing why this facility is best matched to this diagnostic scan and specialty'
          },
          specializedDepartments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Relevant departments at this hospital'
          },
          keyEquipmentOnSite: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Advanced diagnostic equipment and clinical suites available'
          },
          estimatedWaitTime: { type: Type.STRING, description: 'Estimated wait time or appointment turnaround' },
          addressOrDistance: { type: Type.STRING, description: 'Location, campus address, or relative distance' },
          emergencyService24_7: { type: Type.BOOLEAN, description: 'Whether the hospital has a 24/7 Emergency Department' },
          phoneContact: { type: Type.STRING, description: 'Scheduling or patient helpline phone number' },
          secondOpinionAvailable: { type: Type.BOOLEAN, description: 'Whether remote or in-person second opinion consultations are supported' }
        },
        required: [
          'name',
          'facilityType',
          'matchScore',
          'matchReasons',
          'specializedDepartments',
          'keyEquipmentOnSite',
          'estimatedWaitTime',
          'addressOrDistance',
          'emergencyService24_7',
          'phoneContact',
          'secondOpinionAvailable'
        ]
      },
      description: 'List of 3 to 4 recommended hospitals specialized in treating this condition.'
    },
    clinicalQuestionsForPhysician: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '4 to 5 targeted questions the patient should bring to their specialist appointment.'
    },
    preparationChecklist: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Patient preparation steps prior to arriving at the recommended facility.'
    },
    medicalDisclaimer: {
      type: Type.STRING,
      description: 'Standard clinical disclaimer emphasizing that this analysis is an informational triaging aid and not a final medical diagnosis.'
    }
  },
  required: [
    'modality',
    'anatomicalRegion',
    'observedFindings',
    'suspectedSpecialty',
    'secondarySpecialties',
    'urgencyLevel',
    'triageReasoning',
    'requiredEquipmentAndCapabilities',
    'recommendedFacilities',
    'clinicalQuestionsForPhysician',
    'preparationChecklist',
    'medicalDisclaimer'
  ]
};

// API Route: Analyze diagnostic imagery & recommend specialized medical facilities
app.post('/api/analyze-diagnostic', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      patientLocation,
      clinicalNotes,
      insuranceType,
      triagePreference,
      patientDemographics,
      medicalHistory,
    } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Diagnostic image data is required (imageBase64).' });
    }

    // Strip data URL prefix if provided
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

    const ai = getGeminiClient();

    const demographicsText = patientDemographics
      ? `Age: ${patientDemographics.age || 'Unspecified'}, Biological Sex: ${patientDemographics.sex || 'Unspecified'}${
          patientDemographics.isPregnant ? ' [PREGNANCY STATUS: Currently Pregnant / Possible Pregnancy - Radiation Safety Notice]' : ''
        }`
      : 'Not provided';

    const historyText = medicalHistory
      ? `Chronic Conditions & Clinical Risk Flags: ${
          medicalHistory.conditions && medicalHistory.conditions.length > 0
            ? medicalHistory.conditions.join(', ')
            : 'None reported'
        }
- Recent Surgeries / Procedures: ${medicalHistory.recentSurgeriesOrProcedures || 'None reported'}
- Current Active Medications: ${medicalHistory.currentMedications || 'None reported'}`
      : 'None provided';

    const promptText = `
You are the DiagHospital Clinical Intelligence Engine, a board-certified medical triage and hospital recommendation system.
Analyze the attached diagnostic medical image (e.g. X-ray radiograph, MRI, CT scan, ultrasound, clinical photograph, histology, dental panoramic, or ECG strip).

User & Patient Clinical Context:
- Patient Location: ${patientLocation ? patientLocation : 'Default to prominent regional and national academic centers / specialized hospitals'}
- Patient Demographics: ${demographicsText}
- Recent Medical History & Safety Flags: ${historyText}
- Presenting Clinical Symptoms / Notes: ${clinicalNotes ? clinicalNotes : 'None provided'}
- Insurance / Network Consideration: ${insuranceType ? insuranceType : 'General / Major Commercial & Public'}
- Patient Perceived Acuity: ${triagePreference ? triagePreference : 'Standard triage assessment'}

CRITICAL CLINICAL SAFETY RULES:
- If 'Pacemaker / Metal Implant' is noted, explicitly check for MRI contraindications or specify hospitals with accredited MRI-conditional monitoring protocols and cardiac electrophysiology backup.
- If 'Contrast Dye Allergy' or 'Kidney / Renal Disease' is flagged, account for non-contrast imaging pathways or specialized pre-medication capabilities in the facility equipment list.
- If 'Anticoagulant / Blood Thinners' is present with acute trauma or neurovascular headache/symptoms, evaluate for elevated intracranial/internal hemorrhage risk and upgrade triage acuity if indicated.
- If pregnancy is indicated, prioritize facilities equipped with high-resolution diagnostic ultrasound, fetal monitoring, or radiation-sparing diagnostic pathways.

Analysis Tasks:
1. Identify the exact imaging modality and anatomical region.
2. Outline observed radiologic and anatomical findings in clear, objective terms.
3. Determine the primary clinical specialty and allied secondary specialties needed.
4. Assess triage urgency (Emergency, Urgent, Semi-Urgent, or Elective/Routine) with clinical reasoning that incorporates the patient's demographics and risk profile.
5. Specify the mandatory hospital capabilities, diagnostic equipment, and surgical suites needed for this condition and patient profile.
6. Recommend 3 to 4 reputable, specialized hospital facilities that excel in this specific domain (especially matching the patient location "${patientLocation || 'metropolitan medical hubs'}"). Include realistic match scores (82%-99%), key equipment on-site, contact lines, and wait time indicators.
7. Provide practical questions for the doctor and a preparation checklist.

Be precise, respectful, and clinically sound.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: 'You are DiagHospital Clinical Intelligence Engine, providing structured medical facility recommendations and imaging analysis. You always output valid structured JSON matching the provided schema.',
        responseMimeType: 'application/json',
        responseSchema: diagnosticRecommendationSchema,
        temperature: 0.2,
      },
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON directly, attempting recovery:', parseError);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Unable to extract structured data from model output.');
      }
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing diagnostic imagery:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to complete diagnostic facility recommendation.',
    });
  }
});

// API Route: Interactive facility inquiry & consultation assistant
app.post('/api/chat-facility-query', async (req, res) => {
  try {
    const { message, diagnosticContext, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `
You are the DiagHospital Facility Concierge and Medical Navigation Assistant.
You assist patients in understanding their recommended hospitals, diagnostic scan findings, hospital amenities (e.g. emergency access, valet parking, insurance coverage, 3T MRI availability, second opinion protocols), and how to schedule their consultations.

Active Scan Context:
${diagnosticContext ? JSON.stringify(diagnosticContext, null, 2) : 'No diagnostic scan uploaded yet.'}

Guidelines:
- Provide helpful, compassionate, and precise guidance regarding medical facilities, logistics, appointments, and questions to ask doctors.
- Never state that you are making a definitive medical diagnosis; reinforce that their in-person clinical team will interpret the full DICOM study.
- Keep answers structured with bullet points and clear takeaways.
`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `System Context:\n${systemPrompt}\n\nPatient Query: ${message}` }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        temperature: 0.4,
      },
    });

    return res.json({
      success: true,
      reply: response.text || 'I am ready to assist with any questions about your recommended hospital facilities.',
    });
  } catch (error: any) {
    console.error('Error in chat-facility-query:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate facility consultation response.',
    });
  }
});

// Vite middleware in dev or static files in production
const setupServer = async () => {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`DiagHospital server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
};

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
