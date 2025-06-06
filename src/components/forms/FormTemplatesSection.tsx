
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, FileText, Edit, Trash2, Copy, Eye, Calendar, FolderOpen } from 'lucide-react';
import { FormTemplate, sampleFormTemplates } from '@/data/paper5Questions';

interface FormTemplatesSectionProps {
  onTemplateSelect?: (template: FormTemplate) => void;
  isEditable?: boolean;
}

export const FormTemplatesSection = ({ onTemplateSelect, isEditable = true }: FormTemplatesSectionProps) => {
  const [templates, setTemplates] = useState<FormTemplate[]>(sampleFormTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<FormTemplate>>({
    name: '',
    description: '',
    category: 'dental'
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dental': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'medical': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'assessment': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'diagnosis': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.description) {
      const template: FormTemplate = {
        id: `template_${Date.now()}`,
        name: newTemplate.name,
        description: newTemplate.description,
        category: newTemplate.category as any || 'dental',
        sections: [],
        isActive: true,
        createdBy: 'current_user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTemplates(prev => [...prev, template]);
      setNewTemplate({ name: '', description: '', category: 'dental' });
      setIsCreateDialogOpen(false);
    }
  };

  const handleDuplicateTemplate = (template: FormTemplate) => {
    const duplicated: FormTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates(prev => [...prev, duplicated]);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(t => 
      t.id === templateId ? { ...t, isActive: false } : t
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Form Templates</h1>
                <p className="text-gray-600 mt-1">Create and manage reusable templates for dental assessments</p>
              </div>
            </div>
            
            {isEditable && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="dental-button-primary shadow-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Create New Template</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Template Name</label>
                      <Input
                        value={newTemplate.name || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name..."
                        className="dental-input h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Description</label>
                      <Textarea
                        value={newTemplate.description || ''}
                        onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the template purpose..."
                        rows={4}
                        className="dental-input resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-3 block">Category</label>
                      <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value as any }))}>
                        <SelectTrigger className="dental-input h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dental">Dental</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="diagnosis">Diagnosis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="px-6">
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTemplate} className="dental-button-primary px-6">
                        Create Template
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name or description..."
                className="pl-12 h-12 dental-input border-gray-200 focus:border-teal-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-gray-500" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 h-12 dental-input border-gray-200">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="diagnosis">Diagnosis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-teal-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-700 transition-colors">
                      {template.name}
                    </CardTitle>
                    <Badge className={`text-xs font-medium px-3 py-1 border ${getCategoryColor(template.category)}`}>
                      {template.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    <span>{template.sections.length} sections</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onTemplateSelect?.(template)}
                    className="flex-1 h-10 dental-button-primary text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  
                  {isEditable && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicateTemplate(template)}
                        className="h-10 px-3 border-gray-200 hover:border-teal-300"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-10 px-3 border-gray-200 hover:border-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="h-10 px-3 border-gray-200 hover:border-red-300 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No templates found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search criteria or create a new template.'
                  : 'Get started by creating your first form template for dental assessments.'
                }
              </p>
              {isEditable && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="dental-button-primary shadow-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Template
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
