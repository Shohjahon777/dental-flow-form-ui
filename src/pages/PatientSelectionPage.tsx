
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentInfoInput } from '@/components/ui/student-info-input';
import { ArrowLeft, User, Users, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentInfo {
  studentId: string;
  name: string;
  email: string;
}

const PatientSelectionPage = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
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
      color: 'bg-teal-50 border-teal-200 hover:bg-teal-100'
    },
    {
      id: 'patient2',
      name: 'Patient 2', 
      age: '32 years old',
      gender: 'Male',
      description: 'Emergency visit with dental pain and possible complications',
      complexity: 'High',
      color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100'
    }
  ];

  const handleStudentInfoSubmit = (info: StudentInfo) => {
    setStudentInfo(info);
  };

  const handleProceed = () => {
    if (!selectedPatient) {
      toast({
        title: "Patient not selected",
        description: "Please select a patient to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!studentInfo) {
      toast({
        title: "Student information required",
        description: "Please complete your student information first.",
        variant: "destructive",
      });
      return;
    }

    navigate(`/form/${selectedPatient}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="dental-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Dental School Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="hover:bg-teal-50">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Assessment Setup</h1>
          <p className="text-gray-600">
            Complete your information and select a patient to begin the medical and dental history assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Student Information */}
          <div className="lg:col-span-1">
            <StudentInfoInput onSubmit={handleStudentInfoSubmit} />
          </div>

          {/* Right Column - Patient Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-2 text-teal-600" />
              Available Patients
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patients.map((patient) => (
                <Card 
                  key={patient.id}
                  className={`cursor-pointer transition-all duration-200 shadow-lg border-2 ${
                    selectedPatient === patient.id 
                      ? 'border-teal-500 bg-teal-50 shadow-xl scale-105' 
                      : `${patient.color} hover:shadow-xl hover:scale-102`
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      selectedPatient === patient.id 
                        ? 'bg-teal-500 text-white' 
                        : 'bg-white border-2 border-teal-300 text-teal-600'
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
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      patient.complexity === 'High' 
                        ? 'bg-orange-100 text-orange-800 border border-orange-200' 
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {patient.complexity} Complexity
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-white rounded-lg p-6 shadow-lg border border-teal-100">
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
                disabled={!selectedPatient || !studentInfo}
                className="dental-button-primary px-8"
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientSelectionPage;
