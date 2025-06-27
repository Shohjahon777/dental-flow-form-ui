
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Info, Book, Users, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GuidelinesButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const guidelines = [
    {
      icon: <Users className="w-5 h-5 text-teal-600" />,
      title: 'Patient Selection',
      content: 'Choose the appropriate patient scenario based on your learning objectives. Each patient has different complexity levels and medical histories.'
    },
    {
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      title: 'Form Completion',
      content: 'Fill out Papers 1 & 2 completely and accurately. Take your time to review patient information and ask relevant questions.'
    },
    {
      icon: <Book className="w-5 h-5 text-purple-600" />,
      title: 'Assessment Process',
      content: 'Follow the systematic approach: 1) Complete medical history, 2) Document dental history, 3) Review auto-generated findings, 4) Submit for evaluation.'
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
      title: 'Important Notes',
      content: 'Save your progress regularly using the draft feature. Ensure all mandatory fields are completed before submission. Contact your instructor for complex cases.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-20 right-4 z-30 bg-white shadow-lg border-teal-200 hover:bg-teal-50 sm:top-4"
        >
          <Info className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Guidelines</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Book className="w-6 h-6 mr-2 text-teal-600" />
            User Guidelines
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {guidelines.map((guideline, index) => (
            <Card key={index} className="border-l-4 border-l-teal-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {guideline.icon}
                  <span>{guideline.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {guideline.content}
                </p>
              </CardContent>
            </Card>
          ))}
          
          <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 mt-6">
            <h3 className="font-semibold text-teal-800 mb-2">Need Help?</h3>
            <p className="text-teal-700 text-sm">
              If you encounter any issues or need assistance, don't hesitate to contact your instructor or use the help resources provided in your course materials.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
