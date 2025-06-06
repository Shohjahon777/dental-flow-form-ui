import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AIDentalPatient } from '@/components/ui/ai-dental-patient';
import { FormQuestionRenderer } from '@/components/FormQuestionRenderer';
import { Paper5Form } from '@/components/forms/Paper5Form';
import { paper1Questions, paper2Questions, sampleFormData, FormQuestion } from '@/data/formQuestions';
import { Paper5FormData } from '@/data/paper5Questions';
import { ArrowLeft, FileText, Save, Send, User, Heart, Menu, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FormPage = () => {
  const { patientId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentPaper, setCurrentPaper] = useState<'paper1' | 'paper2' | 'paper3' | 'paper4' | 'paper5'>('paper1');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load sample data on component mount
  useEffect(() => {
    setFormData(sampleFormData);
  }, []);

  const getCurrentQuestions = () => {
    switch (currentPaper) {
      case 'paper1': return paper1Questions;
      case 'paper2': return paper2Questions;
      case 'paper3': return [];
      case 'paper4': return [];
      case 'paper5': return [];
      default: return paper1Questions;
    }
  };

  const currentQuestions = getCurrentQuestions();
  const paperTitle = {
    paper1: 'Dental History',
    paper2: 'Medical History', 
    paper3: 'Clinical Examination',
    paper4: 'Investigations',
    paper5: 'Final Diagnosis'
  }[currentPaper];

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
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
      } else if (currentPaper === 'paper2') {
        setCurrentPaper('paper3');
        toast({
          title: "Paper 2 completed",
          description: "Moving to Paper 3 - Clinical Examination.",
        });
      } else if (currentPaper === 'paper3') {
        setCurrentPaper('paper4');
        toast({
          title: "Paper 3 completed",
          description: "Moving to Paper 4 - Investigations.",
        });
      } else if (currentPaper === 'paper4') {
        setCurrentPaper('paper5');
        toast({
          title: "Paper 4 completed",
          description: "Moving to Paper 5 - Final Diagnosis.",
        });
      } else {
        localStorage.setItem(`dentalApp_form_${patientId}`, JSON.stringify(formData));
        localStorage.setItem(`dentalApp_submitted_${patientId}`, 'true');
        
        toast({
          title: "All forms completed!",
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

  const handlePaper5Submit = (data: Paper5FormData) => {
    setFormData(prev => ({ ...prev, paper5: data }));
    handleSubmit();
  };

  const groupedQuestions = currentQuestions.reduce((acc, question) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {} as Record<string, FormQuestion[]>);

  const getCompletionPercentage = () => {
    if (currentPaper === 'paper5') {
      const paper5Data = formData.paper5 as Paper5FormData;
      if (!paper5Data) return 0;
      const requiredFields = ['finalDiagnosis', 'diagnosisJustification', 'dateOfDiagnosis'];
      const completed = requiredFields.filter(field => paper5Data[field as keyof Paper5FormData]).length;
      return Math.round((completed / requiredFields.length) * 100);
    }
    
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

  const getPaperInfo = (paper: string) => {
    switch (paper) {
      case 'paper1': return { title: 'Dental History', icon: User, description: 'Patient dental background and history' };
      case 'paper2': return { title: 'Medical History', icon: Heart, description: 'Medical conditions and medications' };
      case 'paper3': return { title: 'Clinical Examination', icon: Stethoscope, description: 'Physical examination findings' };
      case 'paper4': return { title: 'Investigations', icon: FileText, description: 'Diagnostic tests and imaging' };
      case 'paper5': return { title: 'Final Diagnosis', icon: Stethoscope, description: 'Diagnosis and treatment plan' };
      default: return { title: 'Unknown', icon: FileText, description: '' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Compact Header */}
      <header className="dental-header border-b border-teal-100">
        <div className="max-w-full mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/patients')}
                className="text-gray-600 hover:text-teal-700 hover:bg-teal-50 p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="hidden sm:block">
                <h1 className="text-sm font-semibold text-gray-900 flex items-center">
                  {currentPaper === 'paper1' && (
                    <>
                      <User className="w-4 h-4 mr-1 text-teal-600" />
                      Paper 1: {paperTitle}
                    </>
                  )}
                  {currentPaper === 'paper2' && (
                    <>
                      <Heart className="w-4 h-4 mr-1 text-teal-600" />
                      Paper 2: {paperTitle}
                    </>
                  )}
                  {currentPaper === 'paper3' && (
                    <>
                      <Stethoscope className="w-4 h-4 mr-1 text-teal-600" />
                      Paper 3: {paperTitle}
                    </>
                  )}
                  {currentPaper === 'paper4' && (
                    <>
                      <FileText className="w-4 h-4 mr-1 text-teal-600" />
                      Paper 4: {paperTitle}
                    </>
                  )}
                  {currentPaper === 'paper5' && (
                    <>
                      <Stethoscope className="w-4 h-4 mr-1 text-teal-600" />
                      Paper 5: {paperTitle}
                    </>
                  )}
                </h1>
                <p className="text-xs text-gray-600">Patient {patientId?.slice(-1)} • {getCompletionPercentage()}% Complete</p>
              </div>
            </div>
            
            {/* Mobile Menu Toggle */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            <div className="hidden sm:flex items-center space-x-3">
              <span className="text-xs text-gray-600">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="hover:bg-teal-50 text-xs px-2 py-1">
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-teal-100 pt-2 pb-2">
              <div className="text-xs font-medium text-gray-900 mb-1">
                {currentPaper === 'paper1' && 'Paper 1: Dental History'}
                {currentPaper === 'paper2' && 'Paper 2: Medical History'}
                {currentPaper === 'paper3' && 'Paper 3: Clinical Examination'}
                {currentPaper === 'paper4' && 'Paper 4: Investigations'}
                {currentPaper === 'paper5' && 'Paper 5: Final Diagnosis'}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Patient {patientId?.slice(-1)} • {getCompletionPercentage()}% Complete
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout} className="text-xs px-2 py-1">
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content with Improved Layout */}
      <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
        {/* Center - AI Patient (Prominent Display) */}
        <div className="w-full lg:w-2/5 xl:w-1/3 bg-white border-r border-teal-100 flex items-center justify-center">
          <AIDentalPatient />
        </div>

        {/* Right Side - Form Content */}
        <div className="hidden lg:flex flex-col w-3/5 xl:w-2/3">
          {/* Enhanced Paper Navigation */}
          <div className="p-4 bg-white border-b border-teal-100 flex-shrink-0">
            <div className="bg-white rounded-lg p-2 shadow-sm border border-teal-100">
              <div className="flex space-x-1 mb-3">
                {['paper1', 'paper2', 'paper3', 'paper4', 'paper5'].map((paper) => {
                  const paperInfo = getPaperInfo(paper);
                  const IconComponent = paperInfo.icon;
                  return (
                    <Button
                      key={paper}
                      variant={currentPaper === paper ? 'default' : 'ghost'}
                      onClick={() => setCurrentPaper(paper as any)}
                      size="sm"
                      className={`flex-1 text-xs ${currentPaper === paper ? 'dental-button-primary' : 'hover:bg-teal-50'}`}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      {paper === 'paper1' && 'Paper 1'}
                      {paper === 'paper2' && 'Paper 2'}
                      {paper === 'paper3' && 'Paper 3'}
                      {paper === 'paper4' && 'Paper 4'}
                      {paper === 'paper5' && 'Paper 5'}
                    </Button>
                  );
                })}
              </div>
              
              {/* Paper Description */}
              <div className="text-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">{getPaperInfo(currentPaper).title}</h3>
                <p className="text-xs text-gray-600">{getPaperInfo(currentPaper).description}</p>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{getCompletionPercentage()}% Complete</span>
                <span>Patient {patientId?.slice(-1)}</span>
              </div>
            </div>
          </div>

          {/* Form Sections - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentPaper === 'paper3' && (
              <Card className="dental-card">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                    Clinical Examination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    This section will contain clinical examination forms and findings.
                    Physical examination, oral examination, and clinical observations will be recorded here.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-teal-800 text-sm font-medium">
                      🚧 Clinical Examination forms are being developed and will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentPaper === 'paper4' && (
              <Card className="dental-card">
                <CardHeader className="py-3">
                  <CardTitle className="text-lg text-gray-900 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                    Investigations & Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Document diagnostic tests, radiographs, laboratory results, and other investigations.
                    This section supports comprehensive diagnostic workup documentation.
                  </p>
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-teal-800 text-sm font-medium">
                      🚧 Investigation forms and diagnostic tools are being developed and will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentPaper === 'paper5' ? (
              <Paper5Form 
                onSubmit={handlePaper5Submit}
                isLoading={isLoading}
              />
            ) : currentPaper !== 'paper3' && currentPaper !== 'paper4' && (
              Object.entries(groupedQuestions).map(([section, questions]) => (
                <Card key={section} className="dental-card">
                  <CardHeader className="py-3">
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                      {section}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={question.id}>
                        <FormQuestionRenderer
                          question={question}
                          value={formData[question.id]}
                          onChange={(value) => handleInputChange(question.id, value)}
                        />
                        {index < questions.length - 1 && <Separator className="my-3 bg-teal-100" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Action Buttons - Fixed at bottom */}
          {currentPaper !== 'paper5' && (
            <div className="p-4 bg-white border-t border-teal-100 flex-shrink-0">
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="dental-button-secondary text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {isLoading ? 'Saving...' : 'Save Progress'}
                </Button>
                
                <div className="flex space-x-2">
                  {currentPaper !== 'paper1' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const papers = ['paper1', 'paper2', 'paper3', 'paper4', 'paper5'];
                        const currentIndex = papers.indexOf(currentPaper);
                        if (currentIndex > 0) {
                          setCurrentPaper(papers[currentIndex - 1] as any);
                        }
                      }}
                      size="sm"
                      className="dental-button-secondary text-xs"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Previous
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    size="sm"
                    className="dental-button-primary text-xs"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {isLoading ? 'Processing...' : 
                     currentPaper === 'paper1' ? 'Next: Paper 2' :
                     currentPaper === 'paper2' ? 'Next: Paper 3' :
                     currentPaper === 'paper3' ? 'Next: Paper 4' :
                     currentPaper === 'paper4' ? 'Next: Paper 5' : 'Complete'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Form Content (Full Width) */}
      <div className="lg:hidden p-3 space-y-4">
        {/* Paper Navigation */}
        <div className="bg-white rounded-lg p-2 shadow-sm border border-teal-100">
          <div className="flex space-x-1 mb-2">
            {['paper1', 'paper2', 'paper3', 'paper4', 'paper5'].map((paper) => {
              const paperInfo = getPaperInfo(paper);
              const IconComponent = paperInfo.icon;
              return (
                <Button
                  key={paper}
                  variant={currentPaper === paper ? 'default' : 'ghost'}
                  onClick={() => setCurrentPaper(paper as any)}
                  size="sm"
                  className={`flex-1 text-xs ${currentPaper === paper ? 'dental-button-primary' : 'hover:bg-teal-50'}`}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {paper === 'paper1' && 'Paper 1'}
                  {paper === 'paper2' && 'Paper 2'}
                  {paper === 'paper3' && 'Paper 3'}
                  {paper === 'paper4' && 'Paper 4'}
                  {paper === 'paper5' && 'Paper 5'}
                </Button>
              );
            })}
          </div>
          
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Form Sections */}
        {currentPaper === 'paper3' && (
          <Card className="dental-card">
            <CardHeader className="py-3">
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                Clinical Examination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                This section will contain clinical examination forms and findings.
                Physical examination, oral examination, and clinical observations will be recorded here.
              </p>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="text-teal-800 text-sm font-medium">
                  🚧 Clinical Examination forms are being developed and will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPaper === 'paper4' && (
          <Card className="dental-card">
            <CardHeader className="py-3">
              <CardTitle className="text-lg text-gray-900 flex items-center">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                Investigations & Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">
                Document diagnostic tests, radiographs, laboratory results, and other investigations.
                This section supports comprehensive diagnostic workup documentation.
              </p>
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="text-teal-800 text-sm font-medium">
                  🚧 Investigation forms and diagnostic tools are being developed and will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPaper === 'paper5' ? (
          <Paper5Form 
            onSubmit={handlePaper5Submit}
            isLoading={isLoading}
          />
        ) : (
          Object.entries(groupedQuestions).map(([section, questions]) => (
            <Card key={section} className="dental-card">
              <CardHeader className="py-3">
                <CardTitle className="text-base text-gray-900 flex items-center">
                  <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
                  {section}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id}>
                    <FormQuestionRenderer
                      question={question}
                      value={formData[question.id]}
                      onChange={(value) => handleInputChange(question.id, value)}
                    />
                    {index < questions.length - 1 && <Separator className="my-2 bg-teal-100" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}

        {/* Mobile Action Buttons */}
        <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm border border-teal-100">
          <Button 
            variant="outline" 
            onClick={handleSave} 
            disabled={isLoading}
            size="sm"
            className="dental-button-secondary text-xs"
          >
            <Save className="w-3 h-3 mr-1" />
            Save Progress
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            size="sm"
            className="dental-button-primary text-xs"
          >
            <Send className="w-3 h-3 mr-1" />
            {currentPaper === 'paper1' ? 'Next: Paper 2' :
             currentPaper === 'paper2' ? 'Next: Paper 3' :
             currentPaper === 'paper3' ? 'Next: Paper 4' :
             currentPaper === 'paper4' ? 'Next: Paper 5' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
