
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, ChevronLeft, ChevronRight, SkipForward, Info } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  page: string;
}

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Bemor Portal',
    content: 'This is your medical and dental history assessment system. Let\'s take a detailed tour to understand each feature and button.',
    page: '/',
    position: 'bottom'
  },
  {
    id: 'logo',
    title: 'Bemor Portal Logo',
    content: 'This is the Bemor Portal logo. Click here anytime to return to the main dashboard from any page.',
    target: '[data-tour="logo"]',
    page: '/',
    position: 'bottom'
  },
  {
    id: 'new-assessment',
    title: 'Start New Assessment Button',
    content: 'This button starts a new patient assessment. Click here to select a patient and begin filling out Papers 1 & 2. This is your primary action to begin work.',
    target: '[data-tour="new-assessment"]',
    page: '/',
    position: 'bottom'
  },
  {
    id: 'history',
    title: 'Assessment History Button',
    content: 'This button opens your assessment history. View all previous patient assessments, submissions, and track your progress over time.',
    target: '[data-tour="history"]',
    page: '/',
    position: 'bottom'
  },
  {
    id: 'templates',
    title: 'Form Templates Button',
    content: 'This button provides access to form templates. Review and understand the structure of Papers 1-4 before starting assessments.',
    target: '[data-tour="templates"]',
    page: '/',
    position: 'bottom'
  },
  {
    id: 'guidelines-button',
    title: 'Guidelines Button',
    content: 'This floating button provides user guidelines and instructions. Click here whenever you need help or clarification about the assessment process.',
    target: '[data-tour="guidelines"]',
    page: '/',
    position: 'left'
  },
  {
    id: 'logout-button',
    title: 'Logout Button',
    content: 'This button safely logs you out of the system. Always use this button to end your session securely.',
    target: '[data-tour="logout"]',
    page: '/',
    position: 'left'
  },
  {
    id: 'patient-selection-intro',
    title: 'Patient Selection Page',
    content: 'Here you choose between different patient scenarios. Each patient has unique medical histories and complexity levels to enhance your learning.',
    page: '/patients',
    position: 'top'
  },
  {
    id: 'student-info',
    title: 'Student Information Form',
    content: 'Complete your student information in this form. This ensures proper tracking and identification of your assessment work.',
    target: '[data-tour="student-info"]',
    page: '/patients',
    position: 'right'
  },
  {
    id: 'patient-cards',
    title: 'Patient Selection Cards',
    content: 'These cards represent different patients. Click on any card to select that patient. Each shows complexity level and basic information.',
    target: '[data-tour="patient-cards"]',
    page: '/patients',
    position: 'top'
  },
  {
    id: 'back-dashboard',
    title: 'Back to Dashboard Button',
    content: 'This button returns you to the main dashboard. Use it if you need to access other features or start over.',
    target: '[data-tour="back-dashboard"]',
    page: '/patients',
    position: 'right'
  },
  {
    id: 'start-assessment',
    title: 'Start Assessment Button',
    content: 'This button begins the actual assessment after you\'ve selected a patient and completed student info. It takes you to the form pages.',
    target: '[data-tour="start-assessment"]',
    page: '/patients',
    position: 'left'
  }
];

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isVisible,
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();

  const currentPageSteps = tourSteps.filter(step => step.page === location.pathname);
  const currentStepData = currentPageSteps[currentStep];

  useEffect(() => {
    if (isVisible && currentPageSteps.length === 0) {
      setCurrentStep(0);
    }
  }, [location.pathname, isVisible]);

  if (!isVisible || !currentStepData || currentPageSteps.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < currentPageSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === currentPageSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tour Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl border-2 border-teal-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex space-x-1 mt-2">
              {currentPageSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full ${
                    index === currentStep 
                      ? 'bg-teal-500 w-8' 
                      : 'bg-gray-200 w-2'
                  } transition-all duration-200`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Step {currentStep + 1} of {currentPageSteps.length} on this page
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-gray-600 leading-relaxed text-base">
              {currentStepData.content}
            </p>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={isFirstStep}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip Tour
                </Button>
                
                <Button
                  onClick={handleNext}
                  className="dental-button-primary flex items-center space-x-2"
                >
                  <span>{isLastStep ? 'Finish' : 'Next'}</span>
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
