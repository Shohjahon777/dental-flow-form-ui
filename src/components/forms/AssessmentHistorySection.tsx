
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { History, Search, Filter, FileText, Eye, Download, Calendar, User, GraduationCap, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { AssessmentHistory } from '@/data/paper5Questions';

interface AssessmentHistorySectionProps {
  patientId?: string;
  showAllPatients?: boolean;
}

export const AssessmentHistorySection = ({ patientId, showAllPatients = false }: AssessmentHistorySectionProps) => {
  const [assessments, setAssessments] = useState<AssessmentHistory[]>([
    {
      id: "assessment_001",
      patientId: "patient_001",
      assessmentType: "paper1",
      formData: { dentalHistory: "Complete", medicalHistory: "Reviewed" },
      status: "completed",
      submittedAt: new Date("2024-01-15"),
      reviewedAt: new Date("2024-01-16"),
      reviewedBy: "Dr. Smith",
      grade: "A",
      score: 95,
      maxScore: 100,
      feedback: "Excellent comprehensive assessment with thorough documentation.",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16")
    },
    {
      id: "assessment_002",
      patientId: "patient_001",
      assessmentType: "paper2",
      formData: { medicalHistory: "Complete", riskFactors: "Identified" },
      diagnosis: "Chronic Gingivitis",
      status: "reviewed",
      submittedAt: new Date("2024-01-18"),
      reviewedAt: new Date("2024-01-19"),
      reviewedBy: "Dr. Johnson",
      grade: "B+",
      score: 88,
      maxScore: 100,
      feedback: "Good assessment, consider more detailed periodontal examination.",
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-19")
    },
    {
      id: "assessment_003",
      patientId: "patient_002",
      assessmentType: "paper5",
      formData: { finalDiagnosis: "Pulpitis", treatmentPlan: "Root Canal" },
      diagnosis: "Irreversible Pulpitis",
      treatmentPlan: "Endodontic treatment with crown restoration",
      status: "graded",
      submittedAt: new Date("2024-01-20"),
      reviewedAt: new Date("2024-01-21"),
      reviewedBy: "Dr. Brown",
      grade: "A-",
      score: 92,
      maxScore: 100,
      feedback: "Accurate diagnosis with comprehensive treatment planning.",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-21")
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentHistory | null>(null);

  const filteredAssessments = assessments.filter(assessment => {
    if (!showAllPatients && patientId && assessment.patientId !== patientId) {
      return false;
    }
    
    const matchesSearch = assessment.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.reviewedBy?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || assessment.status === selectedStatus;
    const matchesType = selectedType === 'all' || assessment.assessmentType === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reviewed': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'graded': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-700 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getPaperName = (type: string) => {
    switch (type) {
      case 'paper1': return 'Dental History';
      case 'paper2': return 'Medical History';
      case 'paper3': return 'Clinical Examination';
      case 'paper4': return 'Investigations';
      case 'paper5': return 'Final Diagnosis';
      default: return type;
    }
  };

  const calculateAverageScore = () => {
    const gradedAssessments = filteredAssessments.filter(a => a.score && a.status === 'graded');
    if (gradedAssessments.length === 0) return 0;
    
    const totalScore = gradedAssessments.reduce((sum, a) => sum + (a.score || 0), 0);
    return Math.round(totalScore / gradedAssessments.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <History className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assessment History</h1>
              <p className="text-gray-600 mt-1">
                {showAllPatients ? 'Monitor all student assessments and progress' : 'Track your assessment journey and feedback'}
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600 mb-1">Total Assessments</p>
                  <p className="text-2xl font-bold text-teal-700">{filteredAssessments.length}</p>
                </div>
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-700">
                    {filteredAssessments.filter(a => a.status === 'graded').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-blue-700">{calculateAverageScore()}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {filteredAssessments.filter(a => a.status === 'in_progress').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by diagnosis, grade, or reviewer..."
                className="pl-12 h-12 dental-input border-gray-200 focus:border-teal-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40 h-12 dental-input border-gray-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 h-12 dental-input border-gray-200">
                  <SelectValue placeholder="All Papers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Papers</SelectItem>
                  <SelectItem value="paper1">Paper 1</SelectItem>
                  <SelectItem value="paper2">Paper 2</SelectItem>
                  <SelectItem value="paper3">Paper 3</SelectItem>
                  <SelectItem value="paper4">Paper 4</SelectItem>
                  <SelectItem value="paper5">Paper 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Assessments List */}
        <div className="space-y-6">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {getPaperName(assessment.assessmentType)}
                      </h3>
                      <Badge className={`text-xs font-medium px-3 py-1 border ${getStatusColor(assessment.status)}`}>
                        {assessment.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {assessment.grade && (
                        <Badge className={`text-sm font-bold px-3 py-1 border ${getGradeColor(assessment.grade)}`}>
                          {assessment.grade}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Diagnosis</span>
                        <p className="font-semibold text-gray-900 mt-1">
                          {assessment.diagnosis || 'Not specified'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Submitted</span>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {assessment.submittedAt?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <span className="text-sm font-medium text-gray-500">Reviewed by</span>
                        <p className="font-semibold text-gray-900 mt-1 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {assessment.reviewedBy || 'Pending'}
                        </p>
                      </div>
                    </div>

                    {assessment.score && (
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-teal-700">Score</span>
                          <span className="font-bold text-teal-700">
                            {assessment.score}/{assessment.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-teal-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(assessment.score / (assessment.maxScore || 100)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {assessment.feedback && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Instructor Feedback</h4>
                        <p className="text-blue-800 italic">"{assessment.feedback}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex xl:flex-col gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedAssessment(assessment)}
                          className="h-12 px-6 border-gray-200 hover:border-teal-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {getPaperName(assessment.assessmentType)} - Assessment Details
                          </DialogTitle>
                        </DialogHeader>
                        {selectedAssessment && (
                          <div className="space-y-6 pt-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <span className="font-medium text-gray-700">Status:</span>
                                <Badge className={`ml-3 text-xs border ${getStatusColor(selectedAssessment.status)}`}>
                                  {selectedAssessment.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <span className="font-medium text-gray-700">Grade:</span>
                                <span className="ml-3 font-bold">{selectedAssessment.grade || 'Not graded'}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-3">Form Data:</h4>
                              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto border">
                                {JSON.stringify(selectedAssessment.formData, null, 2)}
                              </pre>
                            </div>

                            {selectedAssessment.feedback && (
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-3">Instructor Feedback:</h4>
                                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                  <p className="text-blue-800">{selectedAssessment.feedback}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" className="h-12 px-6 border-gray-200 hover:border-blue-300">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssessments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No assessments found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your search criteria or filters to find assessments.'
                  : 'No assessments have been completed yet. Start by completing your first assessment.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
