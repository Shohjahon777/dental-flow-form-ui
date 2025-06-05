
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface YesNoWithDetailsProps {
  id: string;
  question: string;
  detailsPlaceholder: string;
  value?: { answer: string; details: string };
  onChange?: (value: { answer: string; details: string }) => void;
  className?: string;
}

export const YesNoWithDetails = ({ 
  id, 
  question, 
  detailsPlaceholder, 
  value = { answer: "", details: "" },
  onChange,
  className = ""
}: YesNoWithDetailsProps) => {
  const [showDetails, setShowDetails] = useState(value.answer === "yes");

  const handleAnswerChange = (answer: string) => {
    const newShowDetails = answer === "yes";
    setShowDetails(newShowDetails);
    
    const newValue = {
      answer,
      details: newShowDetails ? value.details : ""
    };
    
    onChange?.(newValue);
  };

  const handleDetailsChange = (details: string) => {
    onChange?.({ ...value, details });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 leading-relaxed">
        {question}
      </Label>
      <div className="flex space-x-6">
        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name={id}
            value="yes"
            checked={value.answer === "yes"}
            onChange={() => handleAnswerChange("yes")}
            className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 group-hover:border-teal-400"
          />
          <span className="text-sm text-gray-700 group-hover:text-teal-700">Yes</span>
        </label>
        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name={id}
            value="no"
            checked={value.answer === "no"}
            onChange={() => handleAnswerChange("no")}
            className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-teal-300 group-hover:border-teal-400"
          />
          <span className="text-sm text-gray-700 group-hover:text-teal-700">No</span>
        </label>
      </div>
      {showDetails && (
        <div className="mt-3 ml-6 animate-fade-in">
          <Textarea
            id={`${id}_details`}
            placeholder={detailsPlaceholder}
            value={value.details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            rows={3}
            className="dental-input resize-none"
          />
        </div>
      )}
    </div>
  );
};
