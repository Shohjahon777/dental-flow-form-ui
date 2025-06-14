
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DraftNotesProps {
  patientId: string;
  formSection?: string;
}

export const DraftNotes: React.FC<DraftNotesProps> = ({ 
  patientId, 
  formSection = 'general' 
}) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const storageKey = `draft_notes_${patientId}_${formSection}`;

  useEffect(() => {
    // Load saved draft notes
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(storageKey, notes);
      toast({
        title: "Draft Saved",
        description: "Your notes have been saved locally.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save draft notes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setNotes('');
    localStorage.removeItem(storageKey);
    toast({
      title: "Draft Cleared",
      description: "Your notes have been cleared.",
    });
  };

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-amber-800 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Draft Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Write your diagnostic notes, observations, or reminders here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px] bg-white border-amber-200 focus:border-amber-400"
        />
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!notes}
            className="text-amber-700 hover:bg-amber-100"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !notes}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
