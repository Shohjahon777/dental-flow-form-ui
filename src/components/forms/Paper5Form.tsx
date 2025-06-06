
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Store } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { sampleDiagnosisOptions, Paper5FormData } from '@/data/paper5Questions';

interface Paper5FormProps {
  onSubmit: (data: Paper5FormData) => void;
  isLoading?: boolean;
}

export const Paper5Form = ({ onSubmit, isLoading = false }: Paper5FormProps) => {
  const [formData, setFormData] = useState<Paper5FormData>({
    finalDiagnosis: '',
    diagnosisJustification: '',
    treatmentPlan: '',
    dateOfDiagnosis: null,
    prognosis: 'good',
    status: 'draft'
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.finalDiagnosis && formData.diagnosisJustification && formData.dateOfDiagnosis;

  return (
    <div className="space-y-6">
      <Card className="dental-card">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
            Final Diagnosis Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Select your final diagnosis based on patient examination and history:
            </Label>
            <RadioGroup 
              value={formData.finalDiagnosis} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, finalDiagnosis: value }))}
              className="space-y-3"
            >
              {sampleDiagnosisOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                  <RadioGroupItem 
                    value={option.id} 
                    id={option.id}
                    className="border-teal-300 text-teal-600 focus:ring-teal-500 mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={option.id} 
                      className="text-sm font-medium text-gray-900 cursor-pointer block"
                    >
                      {option.diagnosis}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="dental-card">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 flex items-center">
            <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full mr-2"></div>
            Diagnosis Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Date of Diagnosis *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal dental-input",
                    !formData.dateOfDiagnosis && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfDiagnosis ? format(formData.dateOfDiagnosis, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfDiagnosis || undefined}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dateOfDiagnosis: date || null }))}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Justification for Diagnosis *
            </Label>
            <Textarea
              value={formData.diagnosisJustification}
              onChange={(e) => setFormData(prev => ({ ...prev, diagnosisJustification: e.target.value }))}
              placeholder="Provide detailed justification for your final diagnosis based on clinical findings..."
              rows={4}
              className="dental-input resize-none"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Treatment Plan
            </Label>
            <Textarea
              value={formData.treatmentPlan}
              onChange={(e) => setFormData(prev => ({ ...prev, treatmentPlan: e.target.value }))}
              placeholder="Outline your recommended treatment plan..."
              rows={3}
              className="dental-input resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
          className="dental-button-primary px-8 py-3 text-base"
        >
          <Store className="w-4 h-4 mr-2" />
          {isLoading ? 'Submitting...' : 'SUBMIT FINAL DIAGNOSIS'}
        </Button>
      </div>
    </div>
  );
};
