
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, BookOpen, Clock, List, Info } from 'lucide-react';

export const AIRules: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const rules = [
    {
      icon: <List className="w-5 h-5 text-red-600" />,
      title: 'Strict Question Order',
      description: 'You must ask questions in the exact order they are presented on the screen, following the flow of the patient\'s medical and dental history.',
      warning: 'Jumping ahead or skipping questions will result in the AI not responding.'
    },
    {
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      title: 'Limited Attempts Per Question',
      description: 'Each individual question can be asked a maximum of 3 times. This encourages careful listening and critical thinking.',
      warning: 'After three attempts, you must proceed to the next question in the sequence.'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800 mt-3"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          AI Interaction Rules
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            Guidelines for Dental Students
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-sm leading-relaxed">
              Welcome to your AI Patient simulation! To maximize your learning experience and ensure proper interaction, 
              please adhere to the following guidelines:
            </p>
          </div>

          {rules.map((rule, index) => (
            <Card key={index} className="border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  {rule.icon}
                  <span>{rule.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 leading-relaxed">
                  {rule.description}
                </p>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 text-sm font-medium">
                      {rule.warning}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mt-6">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Important Reminder</h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  These guidelines are designed to simulate real patient interactions and improve your clinical communication skills. 
                  Follow them carefully to get the most out of your learning experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
