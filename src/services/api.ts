
import { ApiEndpoints, ApiResponse, PaginatedResponse } from '@/types/api';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication endpoints
  auth = {
    login: (data: any) => this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    register: (data: any) => this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    logout: () => this.request('/auth/logout', {
      method: 'POST',
    }),

    refreshToken: (refreshToken: string) => this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

    profile: () => this.request('/auth/profile'),
  };

  // Patient endpoints
  patients = {
    getAll: () => this.request('/patients'),
    getById: (id: string) => this.request(`/patients/${id}`),
    create: (data: any) => this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => this.request(`/patients/${id}`, {
      method: 'DELETE',
    }),
  };

  // Assessment endpoints
  assessments = {
    getAll: (filters?: any) => {
      const queryParams = new URLSearchParams(filters || {});
      return this.request(`/assessments?${queryParams}`);
    },
    getById: (id: string) => this.request(`/assessments/${id}`),
    create: (data: any) => this.request('/assessments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    submit: (id: string) => this.request(`/assessments/${id}/submit`, {
      method: 'POST',
    }),
    delete: (id: string) => this.request(`/assessments/${id}`, {
      method: 'DELETE',
    }),
    getByPatientAndStudent: (patientId: string, studentId: string) => 
      this.request(`/assessments/patient/${patientId}/student/${studentId}`),
  };

  // Template endpoints
  templates = {
    getAll: () => this.request('/templates'),
    getByPaper: (paperId: number) => this.request(`/templates/paper/${paperId}`),
    create: (data: any) => this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => this.request(`/templates/${id}`, {
      method: 'DELETE',
    }),
  };

  // Draft endpoints
  drafts = {
    save: (assessmentId: string, section: string, content: string) => 
      this.request('/drafts', {
        method: 'POST',
        body: JSON.stringify({ assessmentId, section, content }),
      }),
    get: (assessmentId: string, section: string) => 
      this.request(`/drafts/${assessmentId}/${section}`),
    delete: (assessmentId: string, section: string) => 
      this.request(`/drafts/${assessmentId}/${section}`, {
        method: 'DELETE',
      }),
  };

  // Analytics endpoints
  analytics = {
    getDashboard: () => this.request('/analytics/dashboard'),
    getStudentProgress: (studentId: string) => 
      this.request(`/analytics/student/${studentId}`),
  };
}

export const apiService = new ApiService(API_BASE_URL);
export default apiService;
