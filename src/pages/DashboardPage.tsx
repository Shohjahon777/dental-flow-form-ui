
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, FileText, History, LogOut } from 'lucide-react';
import { BemorLogo } from '@/components/ui/bemor-logo';
import { GuidelinesButton } from '@/components/ui/guidelines-button';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useOnboarding } from '@/hooks/useOnboarding';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { showTour, completeTour, skipTour } = useOnboarding();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      <GuidelinesButton />
      
      <OnboardingTour
        isVisible={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BemorLogo size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Select a patient to begin the medical and dental history assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start New Assessment */}
          <Link to="/patients" className="h-full" data-tour="new-assessment">
            <Card className="h-full hover:shadow-lg transition-all duration-200 border-0 shadow-md cursor-pointer group">
              <CardHeader className="text-center pb-4 flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-gray-900">New Assessment</CardTitle>
                <CardDescription className="text-gray-600">
                  Select a patient and start filling out Papers 1 & 2
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Select Patient
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/history" className="h-full" data-tour="history">
            <Card className="h-full hover:shadow-lg transition-all duration-200 border-0 shadow-md cursor-pointer group">
              <CardHeader className="text-center pb-4 flex-grow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Assessment History</CardTitle>
                <CardDescription className="text-gray-600">
                  History of patient assessments and submissions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View History
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/template" className="h-full" data-tour="templates">
            <Card className="h-full hover:shadow-lg transition-all duration-200 border-0 shadow-md cursor-pointer group">
              <CardHeader className="text-center pb-4 flex-grow">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">Form Templates</CardTitle>
                <CardDescription className="text-gray-600">
                  View and review form templates for Papers 1-4
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  View Templates
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h3>
          <div className="bg-white rounded-xl shadow-md border-0 p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Select a Patient</h4>
                  <p className="text-gray-600">Choose between Patient 1 or Patient 2 to begin the assessment process.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Fill Out Papers 1 & 2</h4>
                  <p className="text-gray-600">Complete the medical and dental history forms with patient information.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Review Auto-Generated Papers 3 & 4</h4>
                  <p className="text-gray-600">View clinical findings and investigation results automatically generated for your patient.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900">Submit for Review</h4>
                  <p className="text-gray-600">Complete the assessment and submit for instructor evaluation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
