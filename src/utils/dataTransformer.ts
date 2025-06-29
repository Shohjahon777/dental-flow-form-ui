import { ApiSubmissionData } from '@/services/apiService';
import { paper1Questions, paper2Questions } from '../data/formQuestions';

export const transformFormDataForApi = (
  formData: Record<string, any>,
  studentID: string,    
  caseID: string,
): ApiSubmissionData => {
  const apiData: ApiSubmissionData = {
    studentID,
    caseID,
  };

  // Transform Paper 1 data
  const paper1Data: Record<string, any> = {};
  paper1Questions.forEach(question => {
    const value = formData[question.id];
    if (value !== undefined && value !== null && value !== '') {
      if (question.type === 'yes-no-details') {
        paper1Data[question.question] = value.answer;
        if (value.details) {
          paper1Data[`${question.question} - Details`] = value.details;
        }
      } else {
        paper1Data[question.question] = value;
      }
    }
  });
  // Always include paper1, even if empty
  apiData.paper1 = paper1Data;

  // Transform Paper 2 data
  const paper2Data: Record<string, any> = {};
  paper2Questions.forEach(question => {
    const value = formData[question.id];
    if (value !== undefined && value !== null && value !== '') {
      if (question.type === 'yes-no-details') {
        paper2Data[question.question] = value.answer;
        if (value.details) {
          paper2Data[`${question.question} - Details`] = value.details;
        }
      } else {
        paper2Data[question.question] = value;
      }
    }
  });
  // Always include paper2, even if empty
  apiData.paper2 = paper2Data;

  // Transform Paper 5 data
  const paper5Data: Record<string, any> = {};
  if (formData.paper5) {
    Object.keys(formData.paper5).forEach(key => {
      const value = formData.paper5[key];
      if (value !== undefined && value !== null && value !== '') {
        paper5Data[key] = value;
      }
    });
  }
  // Always include paper5, even if empty
  apiData.paper5 = paper5Data;

  return apiData;
};