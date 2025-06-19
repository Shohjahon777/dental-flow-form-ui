
export interface FinalDiagnosisOption {
  id: string;
  diagnosis: string;
  description: string;
  icd10Code?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  category: 'caries' | 'periodontal' | 'endodontic' | 'oral_surgery' | 'orthodontic' | 'other';
}

export const sampleDiagnosisOptions: FinalDiagnosisOption[] = [
  {
    id: "caries_mild",
    diagnosis: "Dental Caries - Class I",
    description: "Superficial caries limited to enamel",
    icd10Code: "K02.0",
    severity: 'mild',
    category: 'caries'
  },
  {
    id: "caries_moderate", 
    diagnosis: "Dental Caries - Class II",
    description: "Caries extending into dentin",
    icd10Code: "K02.1",
    severity: 'moderate',
    category: 'caries'
  },
  {
    id: "gingivitis",
    diagnosis: "Chronic Gingivitis",
    description: "Inflammation of gingiva without attachment loss",
    icd10Code: "K05.0",
    severity: 'mild',
    category: 'periodontal'
  },
  {
    id: "periodontitis_chronic",
    diagnosis: "Chronic Periodontitis",
    description: "Progressive loss of periodontal attachment",
    icd10Code: "K05.3",
    severity: 'moderate',
    category: 'periodontal'
  },
  {
    id: "pulpitis_reversible",
    diagnosis: "Reversible Pulpitis",
    description: "Mild inflammation of dental pulp",
    icd10Code: "K04.0",
    severity: 'mild',
    category: 'endodontic'
  },
  {
    id: "pulpitis_irreversible",
    diagnosis: "Irreversible Pulpitis",
    description: "Severe inflammation requiring endodontic treatment",
    icd10Code: "K04.0",
    severity: 'severe',
    category: 'endodontic'
  },
  {
    id: "abscess_periapical",
    diagnosis: "Periapical Abscess",
    description: "Acute bacterial infection at tooth apex",
    icd10Code: "K04.7",
    severity: 'severe',
    category: 'endodontic'
  },
  {
    id: "impaction_wisdom",
    diagnosis: "Impacted Third Molar",
    description: "Wisdom tooth unable to erupt properly",
    icd10Code: "K01.1",
    severity: 'moderate',
    category: 'oral_surgery'
  }
];

export interface TreatmentPlan {
  id: string;
  procedure: string;
  priority: 'immediate' | 'urgent' | 'routine' | 'elective';
  estimatedSessions: number;
  cost?: number;
  notes?: string;
}

export interface Paper5FormData {
  patientId?: string;
  finalDiagnosis: string;
  // diagnosisJustification: string;
  // treatmentPlan: string;
  // additionalTreatments?: TreatmentPlan[];
  // dateOfDiagnosis: Date | null;
  followUpDate?: Date | null;
  referralRequired?: boolean;
  referralSpecialty?: string;
  // prognosis: 'excellent' | 'good' | 'fair' | 'poor';
  riskFactors?: string[];
  preventiveMeasures?: string;
  patientEducation?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dentistId?: string;
  status: 'draft' | 'completed' | 'reviewed' | 'approved';
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: 'dental' | 'medical' | 'assessment' | 'diagnosis';
  sections: TemplateSection[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: TemplateQuestion[];
}

export interface TemplateQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'date' | 'number' | 'yes-no';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface AssessmentHistory {
  id: string;
  patientId: string;
  assessmentType: 'paper1' | 'paper2' | 'paper3' | 'paper4' | 'paper5';
  formData: any;
  diagnosis?: string;
  treatmentPlan?: string;
  score?: number;
  maxScore?: number;
  status: 'in_progress' | 'completed' | 'reviewed' | 'graded';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  grade?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample form templates
export const sampleFormTemplates: FormTemplate[] = [
  {
    id: "comprehensive_dental_exam",
    name: "Comprehensive Dental Examination",
    description: "Complete dental assessment including medical history, clinical examination, and treatment planning",
    category: 'dental',
    sections: [
      {
        id: "chief_complaint",
        title: "Chief Complaint",
        order: 1,
        questions: [
          {
            id: "chief_complaint",
            question: "What is the patient's main concern today?",
            type: 'textarea',
            required: true,
            placeholder: "Describe the patient's primary complaint..."
          }
        ]
      },
      {
        id: "pain_assessment",
        title: "Pain Assessment",
        order: 2,
        questions: [
          {
            id: "pain_level",
            question: "Pain level (0-10 scale)",
            type: 'number',
            required: true,
            validation: { min: 0, max: 10 }
          },
          {
            id: "pain_location",
            question: "Location of pain",
            type: 'select',
            required: false,
            options: ["Upper right", "Upper left", "Lower right", "Lower left", "Generalized", "No pain"]
          }
        ]
      }
    ],
    isActive: true,
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PatientApiData {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  medicalHistory?: any;
  dentalHistory?: any;
  assessments: AssessmentHistory[];
  createdAt: Date;
  updatedAt: Date;
}
