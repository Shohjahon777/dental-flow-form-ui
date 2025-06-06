
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { History, Search, Filter, FileText, Eye, Download, Calendar, User, GraduationCap, TrendingUp, Award } from 'lucide-react';
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
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="dental-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-teal-600">{filteredAssessments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dental-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredAssessments.filter(a => a.status === 'graded').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dental-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">{calculateAverageScore()}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dental-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredAssessments.filter(a => a.status === 'in_progress').length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <History className="h-6 w-6 text-teal-600" />
            Assessment History
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {showAllPatients ? 'View all patient assessments and progress' : 'Track assessment progress and feedback'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments, grades, or reviewers..."
            className="pl-10 dental-input"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40 dental-input">
              <SelectValue />
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
            <SelectTrigger className="w-40 dental-input">
              <SelectValue />
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

      {/* Assessments List */}
      <div className="space-y-4">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id} className="dental-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {getPaperName(assessment.assessmentType)}
                    </h3>
                    <Badge className={`text-xs border ${getStatusColor(assessment.status)}`}>
                      {assessment.status.replace('_', ' ')}
                    </Badge>
                    {assessment.grade && (
                      <Badge className={`text-xs font-bold px-2 py-1 ${getGradeColor(assessment.grade)}`}>
                        {assessment.grade}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Diagnosis:</span>
                      <p className="font-medium text-gray-900">
                        {assessment.diagnosis || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {assessment.submittedAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Reviewed by:</span>
                      <p className="font-medium text-gray-900 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {assessment.reviewedBy || 'Pending'}
                      </p>
                    </div>
                  </div>

                  {assessment.score && (
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Score:</span>
                        <span className="font-bold text-teal-600 ml-1">
                          {assessment.score}/{assessment.maxScore}
                        </span>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(assessment.score / (assessment.maxScore || 100)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {assessment.feedback && (
                    <div className="bg-teal-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 italic">"{assessment.feedback}"</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedAssessment(assessment)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {getPaperName(assessment.assessmentType)} - Assessment Details
                        </DialogTitle>
                      </DialogHeader>
                      {selectedAssessment && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Status:</span>
                              <Badge className={`ml-2 text-xs border ${getStatusColor(selectedAssessment.status)}`}>
                                {selectedAssessment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Grade:</span>
                              <span className="ml-2 font-bold">{selectedAssessment.grade || 'Not graded'}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Form Data:</h4>
                            <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                              {JSON.stringify(selectedAssessment.formData, null, 2)}
                            </pre>
                          </div>

                          {selectedAssessment.feedback && (
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Feedback:</h4>
                              <p className="text-sm bg-teal-50 p-3 rounded border-l-4 border-teal-400">
                                {selectedAssessment.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No assessments have been completed yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};
