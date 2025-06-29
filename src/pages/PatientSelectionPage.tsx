import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BemorLogo } from '@/components/ui/bemor-logo';
import { GuidelinesButton } from '@/components/ui/guidelines-button';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { useOnboarding } from '@/hooks/useOnboarding';
import { dentalApiService } from '@/api/dentalService';

interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  description: string;
  complexity: string;
  color: string;
  medicalHistory?: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  dentalHistory?: {
    lastVisit: string;
    issues: string[];
    treatments: string[];
  };
}

const PatientSelectionPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showTour, completeTour, skipTour } = useOnboarding();
  const [patients, setPatients] = useState<Patient[]>([]);

  // Default patients (will be used as fallback) - using different IDs to avoid conflicts
  const defaultPatients: Patient[] = [
    {
      id: 'local-patient-1', // Different ID to avoid conflict with API
      name: 'Local Patient 1',
      age: '45 years old',
      gender: 'Female',
      description: 'Routine dental checkup with history of periodontal disease',
      complexity: 'Moderate',
      color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
      medicalHistory: {
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        medications: ['Metformin', 'Lisinopril'],
        allergies: ['Penicillin']
      },
      dentalHistory: {
        lastVisit: '6 months ago',
        issues: ['Gingivitis', 'Plaque buildup'],
        treatments: ['Cleaning', 'Scaling']
      }
    },
    {
      id: 'local-patient-2', // Different ID to avoid conflict with API
      name: 'Local Patient 2',
      age: '32 years old',
      gender: 'Male',
      description: 'Emergency visit with dental pain and possible complications',
      complexity: 'High',
      color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
      medicalHistory: {
        conditions: ['Asthma'],
        medications: ['Albuterol inhaler'],
        allergies: ['Latex', 'Iodine']
      },
      dentalHistory: {
        lastVisit: '2 years ago',
        issues: ['Severe tooth pain', 'Swelling'],
        treatments: ['Emergency consultation']
      }
    }
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        console.log('Fetching patients from AI backend...');

        // Try to fetch from AI backend first
        const aiPatients = await dentalApiService.getPatients();

        // Convert AI backend patient format to our format
        // Use the exact ID from the API response
        const convertedPatients = aiPatients.map((patient, index) => ({
          id: patient.id, // Use exact ID from API (patient1, patient2, etc.)
          name: patient.name,
          age: `${patient.age} years old`,
          gender: patient.gender,
          description: patient.description,
          complexity: patient.complexity,
          color: index % 2 === 0 ? 'bg-teal-50 border-teal-200 hover:bg-teal-100' : 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
          // Add the additional fields from API
          file: patient.file,
          voice: patient.voice
        }));

        console.log("AI Patients fetched successfully:", convertedPatients);
        setPatients(convertedPatients);

        toast({
          title: "Success",
          description: "Patients loaded from AI backend successfully.",
          variant: "default",
        });

      } catch (error) {
        console.error('Failed to fetch from AI backend:', error);
        toast({
          title: "Warning",
          description: "Could not connect to AI backend. Using default patients.",
          variant: "destructive",
        });
        setPatients(defaultPatients);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patientId: string) => {
    console.log("=== PATIENT SELECTION DEBUG ===");
    console.log("Clicked patient ID:", patientId);
    console.log("Available patients:", patients.map(p => ({ id: p.id, name: p.name })));

    const selectedPatientData = patients.find(p => p.id === patientId);
    console.log("Found patient data:", selectedPatientData);

    if (selectedPatientData) {
      console.log("Setting selected patient to:", patientId);
      setSelectedPatient(patientId);
    } else {
      console.error("ERROR: Patient not found with ID:", patientId);
    }
    console.log("=== END DEBUG ===");
  };

  const handleProceed = async () => {
    if (!selectedPatient) {
      toast({
        title: "Patient not selected",
        description: "Please select a patient to continue.",
        variant: "destructive",
      });
      return;
    }

    const selectedPatientData = patients.find(p => p.id === selectedPatient);

    console.log("=== FINAL NAVIGATION DEBUG ===");
    console.log("Selected patient ID:", selectedPatient);
    console.log("Selected patient data:", selectedPatientData);
    console.log("About to navigate to:", `/form/${selectedPatient}`);
    console.log("Current patients array:", patients.map(p => ({ id: p.id, name: p.name })));
    console.log("=== END NAVIGATION DEBUG ===");

    try {
      // Create session first
      const response = await dentalApiService.createSession(selectedPatient);
      console.log("Session created successfully:", response);

      toast({
        title: "Session created",
        description: `Session created successfully for ${selectedPatientData?.name || 'selected patient'}.`,
        variant: "default",
      });

      // Clear any existing form data for this patient to ensure fresh start
      localStorage.removeItem(`dentalApp_form_${selectedPatient}`);
      localStorage.removeItem(`dentalApp_submitted_${selectedPatient}`);

      // Navigate with the exact patient ID
      console.log("Navigating to:", `/form/${selectedPatient}`);
      navigate(`/form/${selectedPatient}`);

    } catch (error) {
      console.error("Session creation error:", error);
      toast({
        title: "Error creating session",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data from AI backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 relative">
      <GuidelinesButton />

      <OnboardingTour
        isVisible={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />

      <header className="dental-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-teal-700 hover:bg-teal-50"
                data-tour="back-dashboard"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <BemorLogo size="sm" />
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="hover:bg-teal-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Assessment Setup</h1>
          <p className="text-gray-600">
            Select a patient to begin the dental and medical history assessment with AI simulation.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-teal-600" />
            Available AI Patients
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl" data-tour="patient-cards">
            {patients.map((patient) => (
              <Card
                key={patient.id}
                className={`cursor-pointer transition-all duration-200 shadow-lg border-2 ${selectedPatient === patient.id
                    ? 'border-teal-500 bg-teal-50 shadow-xl scale-105'
                    : `bg-teal-50 border-teal-200 hover:bg-teal-100 hover:shadow-xl hover:scale-102`
                  }`}
                onClick={() => handlePatientSelect(patient.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${selectedPatient === patient.id
                      ? 'bg-teal-500 text-white'
                      : ' border-2 border-teal-300 text-teal-600'
                    }`}>
                    <User className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{patient.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {patient.age} • {patient.gender}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{patient.description}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${patient.complexity === 'High'
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                    {patient.complexity} Complexity
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPatient && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md w-full max-w-2xl">
              <p className="text-sm text-blue-700">
                Selected Patient ID: {selectedPatient}
              </p>
              <p className="text-sm text-blue-700">
                Selected Patient Name: {patients.find(p => p.id === selectedPatient)?.name}
              </p>
              <p className="text-sm text-blue-600 mt-2">
                Debug: Total patients loaded: {patients.length}
              </p>
            </div>
          )}

          <div className="flex justify-center items-center gap-4 bg-white rounded-lg p-6 shadow-lg border border-teal-100 w-full max-w-2xl">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:bg-teal-50 border-teal-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>

            <Button
              onClick={handleProceed}
              disabled={!selectedPatient}
              className="dental-button-primary px-8"
              data-tour="start-assessment"
            >
              Start AI Assessment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientSelectionPage;