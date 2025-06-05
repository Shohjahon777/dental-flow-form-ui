
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle, FileText, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormPage = () => {
  const { patientId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentPaper, setCurrentPaper] = useState<'paper1' | 'paper2'>('paper1');

  const paper1Questions = [
    {
      id: 'chief_complaint',
      type: 'text',
      question: 'What is your chief complaint or main reason for today\'s visit?',
      section: 'Chief Complaint'
    },
    {
      id: 'medical_history',
      type: 'textarea',
      question: 'Please describe your medical history, including any chronic conditions, surgeries, or hospitalizations:',
      section: 'Medical History'
    },
    {
      id: 'medications',
      type: 'textarea',
      question: 'List all medications, supplements, and vitamins you are currently taking:',
      section: 'Medical History'
    },
    {
      id: 'allergies',
      type: 'text',
      question: 'Do you have any known allergies to medications, foods, or other substances?',
      section: 'Medical History'
    },
    {
      id: 'heart_problems',
      type: 'radio',
      question: 'Do you have or have you ever had heart problems, heart attack, chest pains, or stroke?',
      section: 'Medical History',
      options: ['Yes', 'No']
    },
    {
      id: 'blood_pressure',
      type: 'radio',
      question: 'Do you have high or low blood pressure?',
      section: 'Medical History',
      options: ['Yes', 'No']
    },
    {
      id: 'diabetes',
      type: 'radio',
      question: 'Do you have diabetes?',
      section: 'Medical History',
      options: ['Yes', 'No']
    },
    {
      id: 'pregnancy',
      type: 'radio',
      question: 'Are you pregnant or nursing?',
      section: 'Medical History',
      options: ['Yes', 'No', 'N/A']
    }
  ];

  const paper2Questions = [
    {
      id: 'previous_dentist',
      type: 'text',
      question: 'Who was your previous dentist and when was your last visit?',
      section: 'Dental History'
    },
    {
      id: 'dental_complaint',
      type: 'textarea',
      question: 'What specific dental problems are you experiencing?',
      section: 'Dental History'
    },
    {
      id: 'teeth_cleaning',
      type: 'radio',
      question: 'How often do you have your teeth cleaned?',
      section: 'Dental History',
      options: ['Every 6 months', 'Once a year', 'Less than once a year', 'Never']
    },
    {
      id: 'gum_bleeding',
      type: 'radio',
      question: 'Do your gums bleed when you brush or floss?',
      section: 'Dental History',
      options: ['Yes', 'No']
    },
    {
      id: 'jaw_pain',
      type: 'radio',
      question: 'Do you experience jaw pain or clicking when opening/closing your mouth?',
      section: 'Dental History',
      options: ['Yes', 'No']
    },
    {
      id: 'teeth_grinding',
      type: 'radio',
      question: 'Do you grind or clench your teeth?',
      section: 'Dental History',
      options: ['Yes', 'No', 'Don\'t know']
    },
    {
      id: 'oral_hygiene',
      type: 'textarea',
      question: 'Describe your daily oral hygiene routine:',
      section: 'Dental History'
    },
    {
      id: 'tobacco_use',
      type: 'radio',
      question: 'Do you use tobacco products (cigarettes, cigars, chewing tobacco)?',
      section: 'Social History',
      options: ['Yes', 'No', 'Former user']
    },
    {
      id: 'alcohol_use',
      type: 'radio',
      question: 'Do you consume alcohol regularly?',
      section: 'Social History',
      options: ['Yes', 'No', 'Occasionally']
    }
  ];

  const currentQuestions = currentPaper === 'paper1' ? paper1Questions : paper2Questions;

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem(`dentalApp_form_${patientId}`, JSON.stringify(formData));
    toast({
      title: "Progress saved",
      description: "Your form data has been saved locally.",
    });
  };

  const handleSubmit = () => {
    if (currentPaper === 'paper1') {
      setCurrentPaper('paper2');
      toast({
        title: "Paper 1 completed",
        description: "Moving to Paper 2 - Dental History.",
      });
    } else {
      // Save final form data
      localStorage.setItem(`dentalApp_form_${patientId}`, JSON.stringify(formData));
      localStorage.setItem(`dentalApp_submitted_${patientId}`, 'true');
      
      toast({
        title: "Forms submitted successfully!",
        description: "Proceeding to review Papers 3 & 4.",
      });
      
      navigate(`/review/${patientId}`);
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="dental-input"
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={formData[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            rows={3}
            className="dental-input"
          />
        );
      case 'radio':
        return (
          <RadioGroup
            value={formData[question.id] || ''}
            onValueChange={(value) => handleInputChange(question.id, value)}
            className="flex flex-wrap gap-4"
          >
            {question.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}_${option}`} />
                <Label htmlFor={`${question.id}_${option}`} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  // Group questions by section
  const groupedQuestions = currentQuestions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, any[]>);

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
                onClick={() => navigate('/patients')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patient Selection
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentPaper === 'paper1' ? 'Paper 1: Medical History' : 'Paper 2: Dental History'}
              </h1>
              <p className="text-sm text-gray-600">Patient {patientId?.slice(-1)}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - AI Patient Placeholder */}
          <div className="lg:col-span-1">
            <Card className="dental-card h-fit sticky top-6">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-lg">AI Patient Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gray-50 rounded-lg p-6 mb-4">
                  <p className="text-gray-600 text-sm mb-4">
                    The AI patient assistant will be available here to help answer questions and provide additional context during the interview process.
                  </p>
                  <div className="text-xs text-gray-500">
                    🤖 Coming Soon: Interactive AI patient simulation
                  </div>
                </div>
                <Button variant="outline" disabled className="w-full">
                  Start AI Interaction
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Paper Navigation */}
              <div className="flex space-x-4 bg-white rounded-lg p-1 shadow-sm">
                <Button
                  variant={currentPaper === 'paper1' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPaper('paper1')}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Paper 1: Medical History
                </Button>
                <Button
                  variant={currentPaper === 'paper2' ? 'default' : 'ghost'}
                  onClick={() => setCurrentPaper('paper2')}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Paper 2: Dental History
                </Button>
              </div>

              {/* Form Sections */}
              {Object.entries(groupedQuestions).map(([section, questions]) => (
                <Card key={section} className="dental-card">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{section}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id}>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-gray-700 leading-relaxed">
                            {question.question}
                          </Label>
                          {renderQuestion(question)}
                        </div>
                        {index < questions.length - 1 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {/* Action Buttons */}
              <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
                <Button variant="outline" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
                
                <div className="flex space-x-3">
                  {currentPaper === 'paper2' && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPaper('paper1')}
                    >
                      Previous: Paper 1
                    </Button>
                  )}
                  <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                    <Send className="w-4 h-4 mr-2" />
                    {currentPaper === 'paper1' ? 'Continue to Paper 2' : 'Submit & Review'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
