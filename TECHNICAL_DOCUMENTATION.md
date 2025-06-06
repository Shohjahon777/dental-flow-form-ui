
# Dental Assessment Platform - Technical Documentation

## Overview
This is a comprehensive dental assessment platform built with React, TypeScript, and modern web technologies. The platform supports multi-stage dental assessments, AI patient simulations, and professional form management.

## Architecture

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Tailwind CSS, Shadcn/UI components
- **State Management**: React Context, Local Storage
- **Routing**: React Router DOM
- **Form Handling**: Custom form renderers with validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/
│   ├── forms/                    # Form-related components
│   │   ├── Paper5Form.tsx       # Final diagnosis form
│   │   ├── FormTemplatesSection.tsx
│   │   └── AssessmentHistorySection.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── ai-dental-patient.tsx
│   │   ├── yes-no-question.tsx
│   │   └── ... (shadcn components)
│   ├── FormQuestionRenderer.tsx # Dynamic form question renderer
│   └── ProtectedRoute.tsx      # Authentication wrapper
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── data/
│   ├── formQuestions.ts        # Form question definitions
│   └── paper5Questions.ts      # Final diagnosis data structures
├── pages/
│   ├── FormPage.tsx           # Main assessment form page
│   ├── AdminPage.tsx          # Admin dashboard
│   └── ... (other pages)
├── hooks/
│   └── use-toast.ts           # Toast notification hook
└── lib/
    └── utils.ts               # Utility functions
```

## Core Components

### 1. FormQuestionRenderer
Dynamic component that renders different question types based on configuration.

**Usage:**
```tsx
<FormQuestionRenderer
  question={questionConfig}
  value={currentValue}
  onChange={handleValueChange}
/>
```

**Supported Question Types:**
- `text`: Single-line text input
- `textarea`: Multi-line text input  
- `email`: Email validation input
- `tel`: Phone number input
- `date`: Date picker with calendar
- `yes-no`: Radio button yes/no selection
- `yes-no-details`: Yes/no with conditional detail input

### 2. AI Dental Patient
Interactive patient simulation component for clinical interview practice.

**Props:**
- No required props - self-contained component
- Manages internal state for conversation flow
- Provides visual feedback for interaction states

**Features:**
- Professional avatar with mood indicators
- Voice interaction simulation
- Progress tracking
- Responsive design

### 3. Paper5Form (Final Diagnosis)
Specialized form for final diagnosis and treatment planning.

**Props:**
```tsx
interface Paper5FormProps {
  onSubmit: (data: Paper5FormData) => void;
  isLoading?: boolean;
}
```

**Features:**
- Diagnosis selection from predefined options
- ICD-10 code support
- Treatment planning
- Date validation
- Professional submission flow

### 4. Form Templates Section
Template management system for creating reusable forms.

**Props:**
```tsx
interface FormTemplatesSectionProps {
  onTemplateSelect?: (template: FormTemplate) => void;
  isEditable?: boolean;
}
```

**Features:**
- Template CRUD operations
- Category filtering
- Search functionality
- Template duplication

### 5. Assessment History Section
Comprehensive assessment tracking and review system.

**Props:**
```tsx
interface AssessmentHistorySectionProps {
  patientId?: string;
  showAllPatients?: boolean;
}
```

**Features:**
- Progress tracking
- Grade management
- Feedback system
- Export capabilities

## Data Structures

### Form Question Configuration
```tsx
interface FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'yes-no' | 'yes-no-details';
  section: string;
  required?: boolean;
  placeholder?: string;
  detailsPlaceholder?: string; // For yes-no-details type
}
```

### Assessment Data
```tsx
interface AssessmentHistory {
  id: string;
  patientId: string;
  assessmentType: 'paper1' | 'paper2' | 'paper3' | 'paper4' | 'paper5';
  formData: any;
  diagnosis?: string;
  treatmentPlan?: string;
  score?: number;
  maxScore?: number;
  status: 'in_progress' | 'completed' | 'reviewed' | 'graded';
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  grade?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Integration Patterns

#### Data Fetching
```tsx
// Example API integration pattern
const fetchAssessments = async (patientId: string): Promise<ApiResponse<AssessmentHistory[]>> => {
  try {
    const response = await fetch(`/api/assessments/${patientId}`);
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to fetch assessments' };
  }
};
```

#### Form Submission
```tsx
const submitAssessment = async (data: Paper5FormData): Promise<ApiResponse<string>> => {
  try {
    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Submission failed' };
  }
};
```

## Styling System

### Design Tokens
The application uses a comprehensive design system defined in `index.css`:

```css
/* Primary colors */
--primary: 180 100% 35%;        /* Teal */
--secondary: 210 40% 96.1%;     /* Light gray */
--accent: 180 65% 80%;          /* Light teal */

/* Component classes */
.dental-card                    /* Professional card styling */
.dental-input                   /* Consistent input styling */
.dental-button-primary          /* Primary action buttons */
.dental-button-secondary        /* Secondary action buttons */
.dental-header                  /* Header styling */
```

### Responsive Design
- Mobile-first approach using Tailwind breakpoints
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized typography scaling

## State Management

### Authentication Context
```tsx
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
```

### Form State Management
- Local component state for form data
- localStorage for persistence
- Context for cross-component communication

## Performance Considerations

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading of admin components
- Route-based code splitting

### Optimization Strategies
- Memoization of expensive calculations
- Debounced search inputs
- Optimized re-renders with React.memo
- Efficient list rendering with keys

## Testing Strategy

### Component Testing
```tsx
// Example test structure
import { render, screen } from '@testing-library/react';
import { FormQuestionRenderer } from './FormQuestionRenderer';

test('renders text input question', () => {
  const question = {
    id: 'test',
    question: 'Test question',
    type: 'text' as const,
    section: 'test'
  };
  
  render(<FormQuestionRenderer question={question} value="" onChange={jest.fn()} />);
  expect(screen.getByText('Test question')).toBeInTheDocument();
});
```

### Integration Testing
- End-to-end user workflows
- Form submission flows
- Authentication scenarios

## Deployment

### Build Process
```bash
npm run build      # Production build
npm run preview    # Preview production build
npm run dev        # Development server
```

### Environment Configuration
- No environment variables required for frontend-only deployment
- Configuration through build-time constants
- API endpoints configurable through constants

## Browser Support
- Modern browsers (Chrome 88+, Firefox 78+, Safari 14+, Edge 88+)
- ES2020+ features required
- CSS Grid and Flexbox support required

## Accessibility

### WCAG Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### Implementation
```tsx
// Example accessible form input
<Label htmlFor="question-id" className="sr-only">
  {question.question}
</Label>
<Input
  id="question-id"
  aria-describedby="question-help"
  aria-required={question.required}
/>
```

## Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for consistency
- Prettier for code formatting
- Conventional commit messages

### Component Development Guidelines
1. Use TypeScript interfaces for all props
2. Implement proper error boundaries
3. Follow React best practices
4. Maintain consistent naming conventions
5. Document complex components with JSDoc
