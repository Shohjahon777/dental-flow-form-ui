
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AIDentalPatient } from '@/components/ui/ai-dental-patient';
import { FormQuestionRenderer } from '@/components/FormQuestionRenderer';
import { paper1Questions, paper2Questions, sampleFormData, FormQuestion } from '@/data/formQuestions';
import { ArrowLeft, FileText, Save, Send, User, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormPage = () => {
  const { patientId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentPaper, setCurrentPaper] = useState<'paper1' | 'paper2'>('paper1');
  const [isLoading, setIsLoading] = useState(false);

  // Load sample data on component mount
  useEffect(() => {
    setFormData(sampleFormData);
  }, []);

  const currentQuestions = currentPaper === 'paper1' ? paper1Questions : paper2Questions;
  const paperTitle = currentPaper === 'paper1' ? 'Dental History' : 'Medical History';

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      localStorage.setItem(`dentalApp_form_${patientId}`, JSON.stringify(formData));
      
      toast({
        title: "Progress saved",
        description: "Your form data has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (currentPaper === 'paper1') {
        setCurrentPaper('paper2');
        toast({
          title: "Paper 1 completed",
          description: "Moving to Paper 2 - Medical History.",
        });
      } else {
        // TODO: Replace with actual API submission
        localStorage.setItem(`dentalApp_form_${patientId}`, JSON.stringify(formData));
        localStorage.setItem(`dentalApp_submitted_${patientId}`, 'true');
        
        toast({
          title: "Forms submitted successfully!",
          description: "Proceeding to review Clinical Findings & Investigations.",
        });
        
        navigate(`/review/${patientId}`);
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your forms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedQuestions = currentQuestions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, FormQuestion[]>);

  const getCompletionPercentage = () => {
    const totalQuestions = currentQuestions.length;
    const answeredQuestions = currentQuestions.filter(q => {
      const value = formData[q.id];
      if (q.type === 'yes-no-details') {
        return value?.answer !== '' && value?.answer !== undefined;
      }
      return value !== '' && value !== undefined && value !== null;
    }).length;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
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
                onClick={() => navigate('/patients')}
                className="text-gray-600 hover:text-teal-700 hover:bg-teal-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Patient Selection
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                {currentPaper === 'paper1' ? (
                  <>
                    <User className="w-5 h-5 mr-2 text-teal-600" />
                    Paper 1: {paperTitle}
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2 text-teal-600" />
                    Paper 2: {paperTitle}
                  </>
                )}
              </h1>
              <p className="text-sm text-gray-600">Patient {patientId?.slice(-1)} • {getCompletionPercentage()}% Complete</p>
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

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - AI Patient */}
          <div className="lg:col-span-1">
            <AIDentalPatient />
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Paper Navigation with Progress */}
              <div className="bg-white rounded-lg p-1 shadow-lg border border-teal-100">
                <div className="flex space-x-4">
                  <Button
                    variant={currentPaper === 'paper1' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPaper('paper1')}
                    className={`flex-1 ${currentPaper === 'paper1' ? 'dental-button-primary' : 'hover:bg-teal-50'}`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Paper 1: Dental History
                  </Button>
                  <Button
                    variant={currentPaper === 'paper2' ? 'default' : 'ghost'}
                    onClick={() => setCurrentPaper('paper2')}
                    className={`flex-1 ${currentPaper === 'paper2' ? 'dental-button-primary' : 'hover:bg-teal-50'}`}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Paper 2: Medical History
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Form Sections */}
              {Object.entries(groupedQuestions).map(([section, questions]) => (
                <Card key={section} className="dental-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-3"></div>
                      {section}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {questions.map((question, index) => (
                      <div key={question.id}>
                        <FormQuestionRenderer
                          question={question}
                          value={formData[question.id]}
                          onChange={(value) => handleInputChange(question.id, value)}
                        />
                        {index < questions.length - 1 && <Separator className="my-4 bg-teal-100" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              {/* Action Buttons */}
              <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-lg border border-teal-100 animate-slide-up">
                <Button 
                  variant="outline" 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="dental-button-secondary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Progress'}
                </Button>
                
                <div className="flex space-x-3">
                  {currentPaper === 'paper2' && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPaper('paper1')}
                      className="dental-button-secondary"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous: Paper 1
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="dental-button-primary"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isLoading ? 'Processing...' : currentPaper === 'paper1' ? 'Continue to Paper 2' : 'Submit & Review'}
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
