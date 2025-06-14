
# Bemor Portal API Specifications

## Overview
This document outlines the RESTful API endpoints for the Bemor Dental School Portal. The backend should be implemented using Express.js with MongoDB as the database.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "Human readable error message"
}
```

## Success Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "studentId": "ST001",
  "role": "student"
}
```

#### POST /auth/login
Authenticate user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /auth/logout
Logout user (invalidate token)

#### POST /auth/refresh
Refresh authentication token
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### GET /auth/profile
Get current user profile (authenticated)

### Patients

#### GET /patients
Get all patients
Response: Array of Patient objects

#### GET /patients/:id
Get patient by ID

#### POST /patients
Create new patient (admin only)
```json
{
  "patientId": "P001",
  "name": "Patient 1",
  "age": "45 years old",
  "gender": "Female",
  "description": "Routine dental checkup",
  "complexity": "Moderate",
  "medicalHistory": {
    "conditions": ["Hypertension"],
    "medications": ["Lisinopril"],
    "allergies": ["Penicillin"],
    "surgicalHistory": [],
    "familyHistory": []
  },
  "dentalHistory": {
    "lastVisit": "6 months ago",
    "issues": ["Gingivitis"],
    "treatments": ["Cleaning"],
    "oralHygiene": "Good",
    "previousDentist": "Dr. Smith"
  }
}
```

#### PUT /patients/:id
Update patient (admin only)

#### DELETE /patients/:id
Delete patient (admin only)

### Assessments

#### GET /assessments
Get assessments with optional filters
Query parameters:
- `studentId`: Filter by student
- `status`: Filter by status (draft, submitted, reviewed, completed)
- `page`: Page number for pagination
- `limit`: Items per page

#### GET /assessments/:id
Get assessment by ID

#### POST /assessments
Create new assessment
```json
{
  "patientId": "patient1",
  "studentId": "ST001",
  "studentInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "ST001"
  },
  "formData": {
    "paper1": {},
    "paper2": {}
  },
  "status": "draft"
}
```

#### PUT /assessments/:id
Update assessment

#### POST /assessments/:id/submit
Submit assessment for review

#### DELETE /assessments/:id
Delete assessment

#### GET /assessments/patient/:patientId/student/:studentId
Get assessment by patient and student

### Form Templates

#### GET /templates
Get all form templates

#### GET /templates/paper/:paperId
Get template by paper number (1-4)

#### POST /templates
Create new template (admin only)
```json
{
  "paperId": 1,
  "title": "Medical History Form",
  "description": "Comprehensive medical history assessment",
  "sections": [
    {
      "id": "medical_history",
      "title": "Medical History",
      "questions": [
        {
          "id": "current_medications",
          "type": "textarea",
          "question": "List current medications",
          "required": true,
          "order": 1
        }
      ],
      "order": 1
    }
  ],
  "version": "1.0"
}
```

#### PUT /templates/:id
Update template (admin only)

#### DELETE /templates/:id
Delete template (admin only)

### Draft Notes

#### POST /drafts
Save draft note
```json
{
  "assessmentId": "assessment_id",
  "section": "general",
  "content": "Draft notes content"
}
```

#### GET /drafts/:assessmentId/:section
Get draft note

#### DELETE /drafts/:assessmentId/:section
Delete draft note

### Analytics (Admin only)

#### GET /analytics/dashboard
Get dashboard analytics
```json
{
  "totalStudents": 150,
  "totalAssessments": 300,
  "completedAssessments": 250,
  "averageGrade": 85.5,
  "recentActivity": []
}
```

#### GET /analytics/student/:studentId
Get student progress analytics

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'instructor', 'admin']),
  studentId: String,
  department: String,
  onboardingCompleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Patients Collection
```javascript
{
  _id: ObjectId,
  patientId: String (unique),
  name: String,
  age: String,
  gender: String,
  description: String,
  complexity: String,
  medicalHistory: {
    conditions: [String],
    medications: [String],
    allergies: [String],
    surgicalHistory: [String],
    familyHistory: [String]
  },
  dentalHistory: {
    lastVisit: String,
    issues: [String],
    treatments: [String],
    oralHygiene: String,
    previousDentist: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Assessments Collection
```javascript
{
  _id: ObjectId,
  patientId: String,
  studentId: String,
  studentInfo: {
    name: String,
    email: String,
    studentId: String
  },
  formData: {
    paper1: Object,
    paper2: Object,
    paper3: Object,
    paper4: Object
  },
  draftNotes: Object,
  status: String (enum: ['draft', 'submitted', 'reviewed', 'completed']),
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: String,
  grade: Number,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

### FormTemplates Collection
```javascript
{
  _id: ObjectId,
  paperId: Number,
  title: String,
  description: String,
  sections: [{
    id: String,
    title: String,
    description: String,
    questions: [{
      id: String,
      type: String,
      question: String,
      required: Boolean,
      options: [String],
      validation: Object,
      order: Number
    }],
    order: Number
  }],
  version: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### DraftNotes Collection
```javascript
{
  _id: ObjectId,
  assessmentId: String,
  section: String,
  content: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Middleware Requirements

1. **Authentication Middleware**: Verify JWT tokens
2. **Authorization Middleware**: Check user roles
3. **Validation Middleware**: Validate request data
4. **Rate Limiting**: Prevent API abuse
5. **CORS**: Configure cross-origin requests
6. **Logging**: Log all API requests
7. **Error Handling**: Global error handler

## Security Considerations

1. **Password Hashing**: Use bcrypt for password hashing
2. **JWT Security**: Use strong secrets and appropriate expiration
3. **Input Validation**: Validate all input data
4. **SQL Injection Prevention**: Use parameterized queries
5. **Rate Limiting**: Implement rate limiting on sensitive endpoints
6. **HTTPS**: Use HTTPS in production
7. **Environment Variables**: Store sensitive data in environment variables

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^7.5.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.8.1",
  "express-validator": "^7.0.1",
  "dotenv": "^16.3.1",
  "morgan": "^1.10.0"
}
```
