
// Patient Types
export interface Patient {
  _id: string;
  patientId: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  description: string;
  complexity: 'Low' | 'Moderate' | 'High';
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    surgicalHistory: string[];
    familyHistory: string[];
  };
  dentalHistory: {
    lastVisit: string;
    issues: string[];
    treatments: string[];
    oralHygiene: string;
    previousDentist: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  studentId?: string;
  department?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Assessment Types
export interface Assessment {
  _id: string;
  patientId: string;
  studentId: string;
  studentInfo: {
    name: string;
    email: string;
    studentId: string;
  };
  formData: {
    paper1: Record<string, any>;
    paper2: Record<string, any>;
    paper3?: Record<string, any>;
    paper4?: Record<string, any>;
  };
  draftNotes: Record<string, string>;
  status: 'draft' | 'submitted' | 'reviewed' | 'completed';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  grade?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Form Template Types
export interface FormTemplate {
  _id: string;
  paperId: number;
  title: string;
  description: string;
  sections: FormSection[];
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  order: number;
}

export interface FormQuestion {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'yes-no' | 'yes-no-details';
  question: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  order: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  studentId?: string;
  role: 'student' | 'instructor';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Draft Types
export interface DraftNote {
  _id: string;
  assessmentId: string;
  section: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Endpoints Types
export interface ApiEndpoints {
  // Authentication
  auth: {
    login: (data: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
    register: (data: RegisterRequest) => Promise<ApiResponse<AuthResponse>>;
    logout: () => Promise<ApiResponse<void>>;
    refreshToken: (refreshToken: string) => Promise<ApiResponse<AuthResponse>>;
    profile: () => Promise<ApiResponse<User>>;
  };

  // Patients
  patients: {
    getAll: () => Promise<ApiResponse<Patient[]>>;
    getById: (id: string) => Promise<ApiResponse<Patient>>;
    create: (data: Omit<Patient, '_id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<Patient>>;
    update: (id: string, data: Partial<Patient>) => Promise<ApiResponse<Patient>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // Assessments
  assessments: {
    getAll: (filters?: { studentId?: string; status?: string }) => Promise<PaginatedResponse<Assessment>>;
    getById: (id: string) => Promise<ApiResponse<Assessment>>;
    create: (data: Omit<Assessment, '_id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<Assessment>>;
    update: (id: string, data: Partial<Assessment>) => Promise<ApiResponse<Assessment>>;
    submit: (id: string) => Promise<ApiResponse<Assessment>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
    getByPatientAndStudent: (patientId: string, studentId: string) => Promise<ApiResponse<Assessment>>;
  };

  // Form Templates
  templates: {
    getAll: () => Promise<ApiResponse<FormTemplate[]>>;
    getByPaper: (paperId: number) => Promise<ApiResponse<FormTemplate>>;
    create: (data: Omit<FormTemplate, '_id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<FormTemplate>>;
    update: (id: string, data: Partial<FormTemplate>) => Promise<ApiResponse<FormTemplate>>;
    delete: (id: string) => Promise<ApiResponse<void>>;
  };

  // Draft Notes
  drafts: {
    save: (assessmentId: string, section: string, content: string) => Promise<ApiResponse<DraftNote>>;
    get: (assessmentId: string, section: string) => Promise<ApiResponse<DraftNote>>;
    delete: (assessmentId: string, section: string) => Promise<ApiResponse<void>>;
  };

  // Analytics (for admin)
  analytics: {
    getDashboard: () => Promise<ApiResponse<{
      totalStudents: number;
      totalAssessments: number;
      completedAssessments: number;
      averageGrade: number;
      recentActivity: any[];
    }>>;
    getStudentProgress: (studentId: string) => Promise<ApiResponse<{
      assessments: Assessment[];
      averageGrade: number;
      completionRate: number;
    }>>;
  };
}
