
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Users, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PatientSelectionPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [studentId, setStudentId] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const patients = [
    {
      id: 'patient1',
      name: 'Patient 1',
      age: '45 years old',
      gender: 'Female',
      description: 'Routine dental checkup with history of periodontal disease',
      complexity: 'Moderate',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'patient2',
      name: 'Patient 2', 
      age: '32 years old',
      gender: 'Male',
      description: 'Emergency visit with dental pain and possible complications',
      complexity: 'High',
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const handleProceed = () => {
    if (!selectedPatient) {
      toast({
        title: "Patient not selected",
        description: "Please select a patient to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!studentId.trim()) {
      toast({
        title: "Student ID required",
        description: "Please enter your student ID to continue.",
        variant: "destructive",
      });
      return;
    }

    // Save student ID to localStorage for this session
    localStorage.setItem('dentalApp_studentId', studentId);
    
    navigate(`/form/${selectedPatient}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Dental School Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Patient</h1>
          <p className="text-gray-600">
            Choose a patient to begin the medical and dental history assessment.
          </p>
        </div>

        {/* Student ID Input */}
        <Card className="mb-8 shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <User className="w-5 h-5 mr-2 text-primary" />
              Student Information
            </CardTitle>
            <CardDescription>
              Enter your student ID to link this assessment to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                type="text"
                placeholder="Enter your student ID (e.g., DS2024001)"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="dental-input max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Patient Selection */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Available Patients
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {patients.map((patient) => (
              <Card 
                key={patient.id}
                className={`cursor-pointer transition-all duration-200 shadow-md border-2 ${
                  selectedPatient === patient.id 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : `${patient.color} hover:shadow-lg`
                }`}
                onClick={() => setSelectedPatient(patient.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    selectedPatient === patient.id 
                      ? 'bg-primary text-white' 
                      : 'bg-white border-2 border-gray-300'
                  }`}>
                    <User className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{patient.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {patient.age} • {patient.gender}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-700 mb-3">{patient.description}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    patient.complexity === 'High' 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {patient.complexity} Complexity
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={handleProceed}
            disabled={!selectedPatient || !studentId.trim()}
            className="bg-primary hover:bg-primary/90 px-8"
          >
            Start Assessment
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PatientSelectionPage;
