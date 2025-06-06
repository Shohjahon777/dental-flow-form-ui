
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { YesNoQuestion } from '@/components/ui/yes-no-question';
import { YesNoWithDetails } from '@/components/ui/yes-no-with-details';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { FormQuestion } from '@/data/formQuestions';

interface FormQuestionRendererProps {
  question: FormQuestion;
  value: any;
  onChange: (value: any) => void;
}

export const FormQuestionRenderer = ({ question, value, onChange }: FormQuestionRendererProps) => {
  const renderQuestion = () => {
    switch (question.type) {
      case 'date':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 leading-relaxed">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal dental-input",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => onChange(date?.toISOString() || '')}
                  disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'text':
      case 'email':
      case 'tel':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 leading-relaxed">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              type={question.type}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              className="dental-input"
              required={question.required}
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 leading-relaxed">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              rows={3}
              className="dental-input resize-none"
              required={question.required}
            />
          </div>
        );

      case 'yes-no':
        return (
          <YesNoQuestion
            id={question.id}
            question={question.question}
            value={value || ''}
            onChange={onChange}
          />
        );

      case 'yes-no-details':
        return (
          <YesNoWithDetails
            id={question.id}
            question={question.question}
            detailsPlaceholder={question.detailsPlaceholder || 'Please provide details...'}
            value={value || { answer: '', details: '' }}
            onChange={onChange}
          />
        );

      default:
        return null;
    }
  };

  return renderQuestion();
};
