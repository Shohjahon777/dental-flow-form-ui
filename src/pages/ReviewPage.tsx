
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, CheckCircle, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ReviewPage = () => {
  const { patientId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load form data from localStorage
    const savedData = localStorage.getItem(`dentalApp_form_${patientId}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [patientId]);

  // Mock data for Papers 3 & 4 (auto-generated based on patient)
  const paper3Data = {
    title: 'Paper 3: Clinical Findings',
    sections: {
      'Vital Signs': {
        'Blood Pressure': patientId === 'patient1' ? '120/80 mmHg' : '140/90 mmHg',
        'Pulse': patientId === 'patient1' ? '72 bpm' : '88 bpm',
        'Temperature': '98.6°F',
        'Respirations': '16/min'
      },
      'Extraoral Examination': {
        'Facial Symmetry': 'Symmetric',
        'TMJ': patientId === 'patient2' ? 'Clicking present on right side' : 'Normal function',
        'Lymph Nodes': 'Non-palpable',
        'Skin': 'No lesions noted'
      },
      'Intraoral Examination': {
        'Oral Hygiene': patientId === 'patient1' ? 'Fair - plaque accumulation noted' : 'Poor - heavy calculus deposits',
        'Gingiva': patientId === 'patient1' ? 'Mild inflammation, bleeding on probing' : 'Moderate to severe inflammation',
        'Tongue': 'Normal appearance and function',
        'Palate': 'No abnormalities noted'
      }
    }
  };

  const paper4Data = {
    title: 'Paper 4: Investigation Results',
    sections: {
      'Radiographic Findings': {
        'Panoramic X-ray': patientId === 'patient1' ? 'Mild bone loss in posterior regions' : 'Moderate horizontal bone loss, apical radiolucency #19',
        'Bitewing X-rays': patientId === 'patient1' ? 'Interproximal caries #14, #15' : 'Multiple carious lesions, failed restoration #19',
        'Periapical X-rays': patientId === 'patient2' ? 'Periapical pathology #19 - possible abscess' : 'Normal periapical structures'
      },
      'Periodontal Assessment': {
        'Probing Depths': patientId === 'patient1' ? 'Generalized 3-4mm, isolated 5mm sites' : 'Generalized 4-6mm with 7mm sites',
        'Bleeding Index': patientId === 'patient1' ? '35%' : '65%',
        'Mobility': patientId === 'patient2' ? 'Grade I mobility #19' : 'No mobility noted',
        'Furcation': patientId === 'patient2' ? 'Class I furcation involvement #19' : 'No furcation involvement'
      },
      'Laboratory Results': {
        'Complete Blood Count': 'Within normal limits',
        'Blood Glucose': patientId === 'patient2' ? '145 mg/dL (elevated)' : '85 mg/dL (normal)',
        'HbA1c': patientId === 'patient2' ? '7.2% (elevated)' : 'Not indicated',
        'Coagulation Studies': 'PT/PTT within normal limits'
      }
    }
  };

  const getPatientInfo = () => {
    return patientId === 'patient1' 
      ? { name: 'Patient 1', age: '45 years old', gender: 'Female' }
      : { name: 'Patient 2', age: '32 years old', gender: 'Male' };
  };

  const patientInfo = getPatientInfo();

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
                onClick={() => navigate(`/form/${patientId}`)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">Assessment Review</h1>
              <p className="text-sm text-gray-600">{patientInfo.name} - Complete Report</p>
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Patient Summary */}
        <Card className="dental-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{patientInfo.name}</CardTitle>
                  <p className="text-gray-600">{patientInfo.age} • {patientInfo.gender}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Assessment Complete
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date().toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Student ID:</span>
                <p className="text-gray-600">{localStorage.getItem('dentalApp_studentId') || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Evaluator:</span>
                <p className="text-gray-600">{user?.name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Assessment Type:</span>
                <p className="text-gray-600">Medical & Dental History</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for All Papers */}
        <Tabs defaultValue="paper1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
            <TabsTrigger value="paper1" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Paper 1</span>
            </TabsTrigger>
            <TabsTrigger value="paper2" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Paper 2</span>
            </TabsTrigger>
            <TabsTrigger value="paper3" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Paper 3</span>
            </TabsTrigger>
            <TabsTrigger value="paper4" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Paper 4</span>
            </TabsTrigger>
          </TabsList>

          {/* Paper 1 Content */}
          <TabsContent value="paper1">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Paper 1: Medical History
                  <Badge className="ml-3 bg-blue-100 text-blue-800">Student Completed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Chief Complaint</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.chief_complaint || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Allergies</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.allergies || 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Medical History</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.medical_history || 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Current Medications</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.medications || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Heart Problems</p>
                    <Badge variant={formData.heart_problems === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.heart_problems || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Blood Pressure</p>
                    <Badge variant={formData.blood_pressure === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.blood_pressure || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Diabetes</p>
                    <Badge variant={formData.diabetes === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.diabetes || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Pregnancy</p>
                    <Badge variant="secondary">
                      {formData.pregnancy || 'Not answered'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paper 2 Content */}
          <TabsContent value="paper2">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Paper 2: Dental History
                  <Badge className="ml-3 bg-blue-100 text-blue-800">Student Completed</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Previous Dentist</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.previous_dentist || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cleaning Frequency</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {formData.teeth_cleaning || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Dental Complaint</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.dental_complaint || 'Not provided'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-2">Oral Hygiene Routine</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {formData.oral_hygiene || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Gum Bleeding</p>
                    <Badge variant={formData.gum_bleeding === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.gum_bleeding || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Jaw Pain</p>
                    <Badge variant={formData.jaw_pain === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.jaw_pain || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Teeth Grinding</p>
                    <Badge variant={formData.teeth_grinding === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.teeth_grinding || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Tobacco Use</p>
                    <Badge variant={formData.tobacco_use === 'Yes' ? 'destructive' : 'secondary'}>
                      {formData.tobacco_use || 'Not answered'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Alcohol Use</p>
                    <Badge variant="secondary">
                      {formData.alcohol_use || 'Not answered'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paper 3 Content - Auto-generated */}
          <TabsContent value="paper3">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  {paper3Data.title}
                  <Badge className="ml-3 bg-green-100 text-green-800">Auto-Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(paper3Data.sections).map(([sectionName, sectionData]) => (
                  <div key={sectionName} className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">{sectionName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(sectionData).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">{key}:</p>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paper 4 Content - Auto-generated */}
          <TabsContent value="paper4">
            <Card className="dental-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  {paper4Data.title}
                  <Badge className="ml-3 bg-green-100 text-green-800">Auto-Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(paper4Data.sections).map(([sectionName, sectionData]) => (
                  <div key={sectionName} className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-lg">{sectionName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(sectionData).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">{key}:</p>
                          <p className="text-sm text-gray-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/patients')}
            className="text-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline">
              Export PDF
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
