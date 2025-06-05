
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, BookOpen, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentInfo {
  studentId: string;
  name: string;
  email: string;
}

interface StudentInfoInputProps {
  onSubmit: (studentInfo: StudentInfo) => void;
  className?: string;
}

export function StudentInfoInput({ onSubmit, className = "" }: StudentInfoInputProps) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    studentId: '',
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentInfo.studentId.trim() || !studentInfo.name.trim() || !studentInfo.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!studentInfo.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage for session persistence
    localStorage.setItem('dentalApp_studentInfo', JSON.stringify(studentInfo));
    
    setIsSubmitted(true);
    onSubmit(studentInfo);
    
    toast({
      title: "Student Information Saved",
      description: "Your information has been linked to this session.",
    });
  };

  const handleInputChange = (field: keyof StudentInfo, value: string) => {
    setStudentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isSubmitted) {
    return (
      <Card className={`dental-card border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 ${className}`}>
        <CardContent className="text-center py-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Information Confirmed</h3>
          <p className="text-sm text-gray-600 mb-4">
            Welcome, {studentInfo.name}! Your session is now linked to student ID: {studentInfo.studentId}
          </p>
          <div className="text-xs text-teal-600 bg-teal-100 rounded-lg px-3 py-2 inline-block">
            ✓ Session tracking enabled
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`dental-card border-teal-200 bg-gradient-to-br from-white to-teal-50 ${className}`}>
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-teal-600" />
        </div>
        <CardTitle className="text-xl text-gray-900">Student Information</CardTitle>
        <p className="text-sm text-gray-600">
          Enter your details to link this assessment to your dental school record
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-teal-600" />
              Student ID *
            </Label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter your student ID (e.g., DS2024001)"
              value={studentInfo.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
              className="dental-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2 text-teal-600" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={studentInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="dental-input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-teal-600" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your dental school email"
              value={studentInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="dental-input"
              required
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Save Information & Continue
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            * Required fields. Information is stored locally for this session only.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
