export interface ApiSubmissionData {
  studentID: string;
  caseID: string;
  paper1?: Record<string, any>;
  paper2?: Record<string, any>;
  paper3?: Record<string, any>;
  paper4?: Record<string, any>;
  paper5?: Record<string, any>;
}

export const submitFormData = async (data: ApiSubmissionData): Promise<any> => {
  try {
    // Use the proxy route instead of direct URL
    const response = await fetch('/auth/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API submission error:', error);
    throw error;
  }
};