
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
    // prognosis: 'good',
    status: 'draft'
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const isFormValid = formData.finalDiagnosis

  return (
    <div className="space-y-6">
      

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
              Final Diagnosis 
            </Label>
            <Textarea
              value={formData.finalDiagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, finalDiagnosis: e.target.value }))}
              placeholder="Provide detailed justification for your final diagnosis based on clinical findings..."
              rows={4}
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
