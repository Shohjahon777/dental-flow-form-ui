import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type YesNoQuestionProps = {
  id: string;
  question: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function YesNoQuestion({ id, question, value = "", onChange, className = "" }: YesNoQuestionProps) {
  // Add debugging to see what's happening
  console.log(`YesNoQuestion ${id}: value = "${value}"`);
  
  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 leading-relaxed">
        {question}
      </Label>
      <RadioGroup 
        value={value} 
        onValueChange={(newValue) => {
          console.log(`YesNoQuestion ${id}: changing from "${value}" to "${newValue}"`);
          onChange?.(newValue);
        }}
        className="flex space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="yes" 
            id={`${id}-yes`}
            className="border-teal-300 text-teal-600 focus:ring-teal-500"
          />
          <Label 
            htmlFor={`${id}-yes`} 
            className="text-sm font-normal text-gray-700 cursor-pointer hover:text-teal-700"
          >
            Yes
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem 
            value="no" 
            id={`${id}-no`}
            className="border-teal-300 text-teal-600 focus:ring-teal-500"
          />
          <Label 
            htmlFor={`${id}-no`} 
            className="text-sm font-normal text-gray-700 cursor-pointer hover:text-teal-700"
          >
            No
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}