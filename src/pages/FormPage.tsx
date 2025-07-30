// Updated FormPage.tsx with proper question handling and debugging

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AIDentalPatient } from '@/components/ui/ai-dental-patient';
import { DraftNotes } from '@/components/ui/draft-notes';
import { FormQuestionRenderer } from '@/components/FormQuestionRenderer';
import { Paper5Form } from '@/components/forms/Paper5Form';
import { paper1Questions, paper2Questions, FormQuestion } from '@/data/formQuestions';
import { Paper5FormData } from '@/data/paper5Questions';
import { ArrowLeft, FileText, Save, Send, User, Heart, Menu, Stethoscope, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitFormData } from '../services/apiService';
import { transformFormDataForApi } from '../utils/dataTransformer';

const FormPage = () => {
  const { patientId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentPaper, setCurrentPaper] = useState<'paper1' | 'paper2' | 'paper3' | 'paper4' | 'paper5'>('paper1');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionVerification, setQuestionVerification] = useState<{paper1: number, paper2: number} | null>(null);

  // Question verification on component mount
  useEffect(() => {
    const verification = {
      paper1: paper1Questions.length,
      paper2: paper2Questions.length
    };
    setQuestionVerification(verification);
    
    // Debug logging
    console.log("=== FORM QUESTION VERIFICATION ===");
    console.log(`Paper 1 Questions: ${verification.paper1}/27 expected`);
    console.log(`Paper 2 Questions: ${verification.paper2}/57 expected`);
    
    // Check for question order issues
    const paper1Issues = checkQuestionOrder(paper1Questions, 'Paper 1');
    const paper2Issues = checkQuestionOrder(paper2Questions, 'Paper 2');
    
    if (paper1Issues.length > 0 || paper2Issues.length > 0) {
      console.warn("Question order issues detected:", { paper1Issues, paper2Issues });
    }
    
    console.log("=== END VERIFICATION ===");
  }, []);

  // Helper function to check question order
  const checkQuestionOrder = (questions: FormQuestion[], paperName: string) => {
    const issues: string[] = [];
    questions.forEach((question, index) => {
      const match = question.question.match(/^(\d+)\./);
      const questionNumber = match ? parseInt(match[1]) : null;
      const expectedNumber = index + 1;
      
      if (questionNumber !== expectedNumber) {
        issues.push(`${paperName} Q${expectedNumber}: Expected Q${expectedNumber}, found Q${questionNumber}`);
      }
    });
    return issues;
  };

  useEffect(() => {
    console.log("=== FORMPAGE DEBUG ===");
    console.log("Current URL:", window.location.href);
    console.log("patientId from useParams:", patientId);
    console.log("patientId type:", typeof patientId);
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("Form-related localStorage keys:", 
      Object.keys(localStorage).filter(key => key.includes('dentalApp_form_'))
    );
    console.log("=== END FORMPAGE DEBUG ===");
  }, [patientId]);

  // Load saved data on component mount
  useEffect(() => {
    if (patientId) {
      const savedData = localStorage.getItem(`dentalApp_form_${patientId}`);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          console.log("Loaded saved form data:", parsedData);
        } catch (error) {
          console.error("Error parsing saved form data:", error);
          setFormData({});
        }
      } else {
        setFormData({});
        console.log("No saved data found, starting with empty form");
      }
    }
  }, [patientId]);

  const getCurrentQuestions = (): FormQuestion[] => {
    switch (currentPaper) {
      case 'paper1': 
        console.log(`Returning ${paper1Questions.length} questions for Paper 1`);
        return paper1Questions;
      case 'paper2': 
        console.log(`Returning ${paper2Questions.length} questions for Paper 2`);
        return paper2Questions;
      case 'paper3': 
        console.log("Paper 3 - Clinical Examination (no questions yet)");
        return [];
      case 'paper4': 
        console.log("Paper 4 - Investigations (no questions yet)");
        return [];
      case 'paper5': 
        console.log("Paper 5 - Final Diagnosis (custom form)");
        return [];
      default: 
        console.log("Default: returning Paper 1 questions");
        return paper1Questions;
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
    console.log(`Question ${questionId} changed to:`, value);
    
    // Use functional state update to ensure we're working with the latest state
    setFormData(prev => {
      const newData = {
        ...prev,
        [questionId]: value
      };
      console.log(`Updated form data for ${questionId}:`, newData);
      return newData;
    });
  };

  const handleSave = async () => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID not found. Cannot save data.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const saveKey = `dentalApp_form_${patientId}`;
      console.log("Saving data with key:", saveKey);
      console.log("Saving data for patient:", patientId);
      console.log("Data being saved:", formData);
      
      localStorage.setItem(saveKey, JSON.stringify(formData));
      
      toast({
        title: "Progress saved",
        description: `Form data saved successfully for ${patientId}.`,
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCaseIdForPatient = (id: string | undefined) => {
    if (id === 'patient1') return 'case001';
    if (id === 'patient2') return 'case002';
    return id || 'unknown-case';
  };

  const handleSubmit = async (overrideFormData?: Record<string, any>) => {
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID not found. Cannot proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const saveKey = `dentalApp_form_${patientId}`;
      const submittedKey = `dentalApp_submitted_${patientId}`;
      const dataToSubmit = overrideFormData || formData;

      if (currentPaper === 'paper1') {
        setCurrentPaper('paper2');
        localStorage.setItem(saveKey, JSON.stringify(formData));
        toast({
          title: "Paper 1 completed",
          description: "Moving to Paper 2 - Medical History.",
        });
      } else if (currentPaper === 'paper2') {
        setCurrentPaper('paper3');
        localStorage.setItem(saveKey, JSON.stringify(formData));
        toast({
          title: "Paper 2 completed",
          description: "Moving to Paper 3 - Clinical Examination.",
        });
      } else if (currentPaper === 'paper3') {
        setCurrentPaper('paper4');
        localStorage.setItem(saveKey, JSON.stringify(formData));
        toast({
          title: "Paper 3 completed",
          description: "Moving to Paper 4 - Investigations.",
        });
      } else if (currentPaper === 'paper4') {
        setCurrentPaper('paper5');
        localStorage.setItem(saveKey, JSON.stringify(formData));
        toast({
          title: "Paper 4 completed",
          description: "Moving to Paper 5 - Final Diagnosis.",
        });
      } else {
        // Final submission
        setIsSubmitting(true);
        try {
          localStorage.setItem(saveKey, JSON.stringify(dataToSubmit));

          const apiData = transformFormDataForApi(
            dataToSubmit,
            user?.name || 'Unknown Student',
            getCaseIdForPatient(patientId)
          );

          const response = await submitFormData(apiData);
          console.log("API Response:", response);

          localStorage.setItem(submittedKey, 'true');

          toast({
            title: "All forms completed successfully!",
            description: "Your data has been submitted to the server.",
          });

          navigate(`/review/${patientId}`);
        } catch (error) {
          console.error("API submission error:", error);
          toast({
            title: "Submission Error",
            description: "Failed to submit to server, but data is saved locally. Please try again later.",
            variant: "destructive"
          });

          localStorage.setItem(submittedKey, 'true');
          navigate(`/review/${patientId}`);
        } finally {
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Submit error:", error);
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
    const updatedFormData = { ...formData, paper5: data };
    setFormData(updatedFormData);
    handleSubmit(updatedFormData);
  };

  // Group questions by section for better organization
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
      const requiredFields = ['finalDiagnosis'];
      const completed = requiredFields.filter(field => paper5Data[field as keyof Paper5FormData]).length;
      return Math.round((completed / requiredFields.length) * 100);
    }
    
    const totalQuestions = currentQuestions.length;
    if (totalQuestions === 0) return 0;
    
    const answeredQuestions = currentQuestions.filter(q => {
      const value = formData[q.id];
      if (q.type === 'yes-no-details') {
        return value?.answer !== '' && value?.answer !== undefined;
      }
      return value !== '' && value !== undefined && value !== null;
    }).length;
    
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const getPatientDisplayName = (id: string | undefined) => {
    if (!id) return 'Unknown Patient';
    if (id === 'patient1') return 'Patient 1 (Sardor Osipov)';
    if (id === 'patient2') return 'Patient 2 (Sarvar Karim)';
    return `Patient ${id}`;
  };

  const getPaperInfo = (paper: string) => {
    switch (paper) {
      case 'paper1': return { title: 'Dental History', icon: User, description: 'Patient dental background and history' };
      case 'paper2': return { title: 'Medical History', icon: Heart, description: 'Medical conditions and medications' };
      case 'paper3': return { title: 'Clinical Examination', icon: Stethoscope, description: 'Physical examination findings' };
      case 'paper4': return { title: 'Investigations', icon: FileText, description: 'X-rays and additional tests' };
      case 'paper5': return { title: 'Final Diagnosis', icon: FileText, description: 'Diagnosis and treatment plan' };
      default: return { title: 'Unknown', icon: FileText, description: '' };
    }
  };

  if (!patientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Patient</h2>
          <p className="text-gray-600 mb-4">No patient ID found in the URL.</p>
          <Button onClick={() => navigate('/patients')} className="dental-button-primary">
            Back to Patient Selection
          </Button>
        </div>
      </div>
    );
  }

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
                <p className="text-xs text-gray-600">{getPatientDisplayName(patientId)} • {getCompletionPercentage()}% Complete</p>
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
                {getPatientDisplayName(patientId)} • {getCompletionPercentage()}% Complete
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
        {/* Left Side - AI Patient and Draft Notes */}
        <div className="w-full lg:w-1/3 p-3 h-full bg-white border-r border-teal-100 overflow-y-auto space-y-4">
          <AIDentalPatient />
          
          {/* Draft Notes Component */}
          <DraftNotes 
            patientId={patientId || 'unknown'} 
            formSection={currentPaper}
          />
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
                <span>{getPatientDisplayName(patientId)}</span>
              </div>
              
              {/* Question count indicator */}
              {questionVerification && (currentPaper === 'paper1' || currentPaper === 'paper2') && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
                  <div className="flex items-center justify-between">
                    <span>
                      Questions loaded: {currentPaper === 'paper1' ? questionVerification.paper1 : questionVerification.paper2}
                      /{currentPaper === 'paper1' ? '27' : '57'} expected
                    </span>
                    {((currentPaper === 'paper1' && questionVerification.paper1 !== 27) ||
                      (currentPaper === 'paper2' && questionVerification.paper2 !== 57)) && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </div>
              )}
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
                <CardContent className="space-y-6">
                  <p className="text-gray-600 text-sm">
                    Review the clinical images below to perform your examination and document findings.
                    Use these images to assess dental alignment, gingival condition, and overall oral health.
                  </p>
                  
                  {/* Clinical Images Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3 text-base">Clinical Images for Assessment</h4>
                    <img 
                      src={patientId === "patient2" ? "/lovable-uploads/70708bb7-9d3f-4160-a798-4b9794b38ef4.png" : "/lovable-uploads/6064503a-3074-4027-8c65-bbc4af88cc05.png"}
                      alt="Clinical preoperative presentation showing dental conditions"
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-sm border border-gray-100"
                    />
                    <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                      {patientId === "patient2" 
                        ? "Clinical presentation showing anterior crown fracture and associated gingival trauma"
                        : "Preoperative clinical presentation showing dental alignment and gingival condition"
                      }
                    </p>
                    <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <p className="text-sm text-teal-800">
                        💡 <strong>Assessment Tip:</strong> {patientId === "patient2" 
                          ? "Focus on the fractured central incisor, assess pulp vitality, examine surrounding soft tissues for trauma, and evaluate the extent of crown loss."
                          : "Examine this image carefully for signs of dental caries, gingival inflammation, plaque accumulation, and tooth alignment issues."
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-teal-800 text-sm font-medium">
                      📋 Use the clinical image above to document your examination findings and proceed to Paper 4 for radiographic analysis.
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
                <CardContent className="space-y-6">
                  <p className="text-gray-600 text-sm">
                    {patientId === "patient2" 
                      ? "Analyze the periapical radiographs below to complete your diagnostic workup for the traumatic dental injury. These radiographs will help assess root integrity, pulp chamber, and surrounding bone structures."
                      : "Analyze the radiographic images below to complete your diagnostic workup. These bite-wing radiographs will help you assess interproximal bone levels and identify any pathology."
                    }
                  </p>
                  
                  {/* Radiographic Images Section */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3 text-base">Radiographic Images for Analysis</h4>
                    <img 
                      src={patientId === "patient2" ? "/lovable-uploads/1886538a-29da-489a-813b-2a31108fab01.png" : "/lovable-uploads/71a16a32-2394-4a25-9b8e-c0c9aa73b174.png"}
                      alt="Bite-wing radiographs showing interproximal bone levels"
                      className="w-full max-w-3xl mx-auto rounded-lg shadow-sm border border-gray-100"
                    />
                    <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                      {patientId === "patient2" 
                        ? "Periapical radiographs showing root structure and surrounding bone after dental trauma"
                        : "Bite-wing radiographs depicting the interproximal bone levels and dental structures"
                      }
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        🔍 <strong>Radiographic Analysis:</strong> {patientId === "patient2" 
                          ? "Examine root integrity, assess pulp chamber space, look for signs of root fracture, external root resorption, and evaluate surrounding bone for any traumatic changes."
                          : "Look for signs of caries, bone loss, periodontal involvement, and any apical pathology in these radiographs."
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm font-medium">
                      📊 Complete your radiographic analysis and proceed to Paper 5 to formulate your final diagnosis based on clinical and radiographic findings.
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
                      <span className="ml-auto text-xs text-gray-500 font-normal">
                        {questions.length} question{questions.length !== 1 ? 's' : ''}
                      </span>
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
                    disabled={isLoading || isSubmitting}
                    size="sm"
                    className="dental-button-primary text-xs"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    {isLoading || isSubmitting ? 'Processing...' : 
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
        {/* Draft Notes for Mobile */}
        <DraftNotes 
          patientId={patientId || 'unknown'} 
          formSection={currentPaper}
        />

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
                Review the clinical images below to perform your examination and document findings.
              </p>
              
              {/* Clinical Images Section for Mobile */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Clinical Images</h4>
                <img 
                  src={patientId === "patient2" ? "/lovable-uploads/70708bb7-9d3f-4160-a798-4b9794b38ef4.png" : "/lovable-uploads/6064503a-3074-4027-8c65-bbc4af88cc05.png"}
                  alt="Clinical preoperative presentation"
                  className="w-full rounded-lg shadow-sm border border-gray-100"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Clinical presentation for assessment
                </p>
              </div>
              
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <p className="text-teal-800 text-sm">
                  📋 Use the clinical image to document examination findings.
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
                Analyze the radiographic images below for your diagnostic workup.
              </p>
              
              {/* Radiographic Images Section for Mobile */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Radiographic Images</h4>
                <img 
                  src={patientId === "patient2" ? "/lovable-uploads/1886538a-29da-489a-813b-2a31108fab01.png" : "/lovable-uploads/71a16a32-2394-4a25-9b8e-c0c9aa73b174.png"}
                  alt="Bite-wing radiographs"
                  className="w-full rounded-lg shadow-sm border border-gray-100"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Bite-wing radiographs for analysis
                </p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  📊 Analyze radiographs for your final diagnosis.
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
            disabled={isLoading || isSubmitting}
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