export interface FormQuestion {
  id: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'yes-no' | 'yes-no-details';
  question: string;
  section: string;
  required?: boolean;
  placeholder?: string;
  detailsPlaceholder?: string;
}

export const paper1Questions: FormQuestion[] = [
  // Basic Information
  {
    id: 'full_name',
    type: 'text',
    question: 'What is your full name?',
    section: 'Personal Information',
    required: true,
    placeholder: 'Enter your full name'
  },
  {
    id: 'date_of_birth',
    type: 'date',
    question: 'What is your date of birth?',
    section: 'Personal Information',
    required: true
  },
  {
    id: 'address',
    type: 'textarea',
    question: 'What is your address?',
    section: 'Personal Information',
    required: true,
    placeholder: 'Enter your complete address'
  },
  {
    id: 'phone_numbers',
    type: 'tel',
    question: 'What are your phone number(s)?',
    section: 'Personal Information',
    required: true,
    placeholder: 'Enter your phone number(s)'
  },
  {
    id: 'email_address',
    type: 'email',
    question: 'What is your email address?',
    section: 'Personal Information',
    required: true,
    placeholder: 'Enter your email address'
  },
  {
    id: 'emergency_contact',
    type: 'textarea',
    question: 'What is your emergency contact information (name, phone number, relationship)?',
    section: 'Personal Information',
    required: true,
    placeholder: 'Name, phone number, and relationship'
  },
  {
    id: 'visit_reason',
    type: 'textarea',
    question: 'What is the reason for your visit today?',
    section: 'Visit Information',
    required: true,
    placeholder: 'Describe the reason for your dental visit'
  },
  
  // Dental History
  {
    id: 'dental_pain',
    type: 'yes-no-details',
    question: 'Are you currently experiencing any dental pain or discomfort?',
    section: 'Current Dental Status',
    detailsPlaceholder: 'Please describe the pain or discomfort'
  },
  {
    id: 'last_dental_exam',
    type: 'text',
    question: 'What is the date of last dental exam?',
    section: 'Previous Dental Care',
    placeholder: 'MM/DD/YYYY'
  },
  {
    id: 'last_dental_appointment',
    type: 'textarea',
    question: 'What was done at your last dental appointment?',
    section: 'Previous Dental Care',
    placeholder: 'Describe the procedures performed'
  },
  {
    id: 'last_xrays',
    type: 'text',
    question: 'What is the date of last dental x-rays?',
    section: 'Previous Dental Care',
    placeholder: 'MM/DD/YYYY'
  },
  {
    id: 'orthodontic_treatment',
    type: 'yes-no-details',
    question: 'Have you ever had orthodontic treatment (braces)?',
    section: 'Previous Dental Care',
    detailsPlaceholder: 'Please provide details about your orthodontic treatment'
  },
  {
    id: 'dental_appliances',
    type: 'yes-no-details',
    question: 'Do you wear removable dental appliances (dentures, partials, retainers, mouthguards)?',
    section: 'Current Dental Status',
    detailsPlaceholder: 'Please specify what type of appliances you wear'
  },
  {
    id: 'gum_bleeding',
    type: 'yes-no',
    question: 'Do your gums bleed when you brush or floss?',
    section: 'Gum Health'
  },
  {
    id: 'teeth_sensitivity',
    type: 'yes-no-details',
    question: 'Are your teeth sensitive to cold, hot, sweets, or pressure?',
    section: 'Tooth Sensitivity',
    detailsPlaceholder: 'Please describe what triggers the sensitivity'
  },
  {
    id: 'canker_sores',
    type: 'yes-no',
    question: 'Do you have frequent canker sores or ulcers in your mouth?',
    section: 'Oral Health'
  },
  {
    id: 'periodontal_treatment',
    type: 'yes-no-details',
    question: 'Have you ever had any periodontal (gum) treatments?',
    section: 'Gum Health',
    detailsPlaceholder: 'Please describe the treatments you received'
  },
  {
    id: 'tmj_problems',
    type: 'yes-no-details',
    question: 'Do you have any clicking, popping, or discomfort in your jaw joints (TMJ)?',
    section: 'TMJ/Jaw Health',
    detailsPlaceholder: 'Please describe your jaw symptoms'
  },
  {
    id: 'teeth_grinding',
    type: 'yes-no',
    question: 'Do you brux or grind your teeth?',
    section: 'Oral Habits'
  },
  {
    id: 'dry_mouth',
    type: 'yes-no',
    question: 'Is your mouth often dry?',
    section: 'Oral Health'
  },
  {
    id: 'head_mouth_injury',
    type: 'yes-no-details',
    question: 'Have you ever had a serious injury to your head or mouth?',
    section: 'Medical History',
    detailsPlaceholder: 'Please describe the injury'
  },
  {
    id: 'dental_treatment_problems',
    type: 'yes-no-details',
    question: 'Have you ever had problems with previous dental treatment?',
    section: 'Previous Dental Care',
    detailsPlaceholder: 'Please describe the problems you experienced'
  },
  {
    id: 'anesthesia_reaction',
    type: 'yes-no-details',
    question: 'Have you ever had a reaction to dental anesthesia?',
    section: 'Allergies & Reactions',
    detailsPlaceholder: 'Please describe the reaction'
  },
  {
    id: 'teeth_appearance',
    type: 'textarea',
    question: 'How do you feel about the appearance of your teeth?',
    section: 'Cosmetic Concerns',
    placeholder: 'Please share your thoughts about your smile'
  },
  {
    id: 'brushing_frequency',
    type: 'text',
    question: 'How often do you brush your teeth?',
    section: 'Oral Hygiene',
    placeholder: 'e.g., twice daily, once daily'
  },
  {
    id: 'flossing_frequency',
    type: 'text',
    question: 'How often do you floss?',
    section: 'Oral Hygiene',
    placeholder: 'e.g., daily, weekly, rarely'
  },
  {
    id: 'mouthwash_use',
    type: 'yes-no-details',
    question: 'Do you use any mouthwash?',
    section: 'Oral Hygiene',
    detailsPlaceholder: 'Please specify what kind and how often'
  }
];

export const paper2Questions: FormQuestion[] = [
  {
    id: 'significant_medical_problems',
    type: 'yes-no-details',
    question: 'Do you have any significant medical problems?',
    section: 'General Medical History',
    detailsPlaceholder: 'Please describe your medical problems'
  },
  {
    id: 'physician_care',
    type: 'yes-no-details',
    question: 'Are you currently under the care of a physician?',
    section: 'Medical Care',
    detailsPlaceholder: 'Please specify the condition(s) and physician details'
  },
  {
    id: 'hospitalizations_surgeries',
    type: 'yes-no-details',
    question: 'Have you been hospitalized or had any major surgeries in the past?',
    section: 'Medical History',
    detailsPlaceholder: 'Please describe the hospitalizations or surgeries'
  },
  {
    id: 'current_medications',
    type: 'textarea',
    question: 'What medications are you currently taking (prescription, over-the-counter, herbal supplements, vitamins), including dosage and frequency?',
    section: 'Medications',
    placeholder: 'List all medications with dosages and frequency'
  },
  {
    id: 'allergies',
    type: 'yes-no-details',
    question: 'Are you allergic to any medications, food, or other substances?',
    section: 'Allergies & Reactions',
    detailsPlaceholder: 'List the allergen and type of reaction'
  },
  {
    id: 'medication_reactions',
    type: 'yes-no-details',
    question: 'Have you ever had an adverse reaction to any medication?',
    section: 'Allergies & Reactions',
    detailsPlaceholder: 'Please describe the reaction'
  },
  {
    id: 'tobacco_use',
    type: 'yes-no-details',
    question: 'Do you use tobacco (smoking, chewing)?',
    section: 'Social History',
    detailsPlaceholder: 'Please specify type, amount, and duration'
  },
  {
    id: 'alcohol_use',
    type: 'yes-no-details',
    question: 'Do you drink alcoholic beverages?',
    section: 'Social History',
    detailsPlaceholder: 'Please specify how often and how much'
  },
  {
    id: 'recreational_drugs',
    type: 'yes-no-details',
    question: 'Do you use recreational drugs?',
    section: 'Social History',
    detailsPlaceholder: 'Please specify'
  },
  
  // Medical Conditions - Heart Related
  {
    id: 'bleeding_disorders',
    type: 'yes-no',
    question: 'Have you ever had any bleeding disorders or problems with blood clotting?',
    section: 'Blood Disorders'
  },
  {
    id: 'diabetes',
    type: 'yes-no',
    question: 'Do you have diabetes?',
    section: 'Endocrine Disorders'
  },
  {
    id: 'heart_disease',
    type: 'yes-no',
    question: 'Have you ever had a heart disease or attack?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'heart_failure',
    type: 'yes-no',
    question: 'Have you ever had heart failure?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'angina_pectoris',
    type: 'yes-no',
    question: 'Have you ever had angina pectoris?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'high_blood_pressure',
    type: 'yes-no',
    question: 'Do you have high blood pressure?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'low_blood_pressure',
    type: 'yes-no',
    question: 'Do you have low blood pressure?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'congenital_heart_disease',
    type: 'yes-no',
    question: 'Do you have congenital heart disease?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'heart_murmur',
    type: 'yes-no',
    question: 'Do you have heart murmur?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'artificial_heart_valve',
    type: 'yes-no',
    question: 'Do you have artificial heart valve?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'mitral_valve_prolapse',
    type: 'yes-no',
    question: 'Do you have mitral valve prolapse?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'heart_pacemaker',
    type: 'yes-no',
    question: 'Do you have heart pacemaker?',
    section: 'Cardiovascular Conditions'
  },
  {
    id: 'rheumatic_fever',
    type: 'yes-no',
    question: 'Have you ever had history of rheumatic fever?',
    section: 'Cardiovascular Conditions'
  },
  
  // Respiratory Conditions
  {
    id: 'asthma',
    type: 'yes-no',
    question: 'Do you have asthma?',
    section: 'Respiratory Conditions'
  },
  {
    id: 'emphysema',
    type: 'yes-no',
    question: 'Do you have emphysema?',
    section: 'Respiratory Conditions'
  },
  {
    id: 'chronic_bronchitis',
    type: 'yes-no',
    question: 'Do you have chronic bronchitis?',
    section: 'Respiratory Conditions'
  },
  {
    id: 'sleep_apnea',
    type: 'yes-no',
    question: 'Do you have sleep apnea?',
    section: 'Respiratory Conditions'
  },
  {
    id: 'tuberculosis',
    type: 'yes-no',
    question: 'Do you have tuberculosis?',
    section: 'Respiratory Conditions'
  },
  
  // Other Medical Conditions
  {
    id: 'thyroid_problems',
    type: 'yes-no',
    question: 'Do you have thyroid problems (hyperthyroidism, hypothyroidism)?',
    section: 'Endocrine Disorders'
  },
  {
    id: 'epilepsy_seizures',
    type: 'yes-no',
    question: 'Do you have epilepsy or seizures?',
    section: 'Neurological Conditions'
  },
  {
    id: 'fainting_spells',
    type: 'yes-no',
    question: 'Do you have fainting spells?',
    section: 'Neurological Conditions'
  },
  {
    id: 'stroke',
    type: 'yes-no',
    question: 'Have you ever had a stroke?',
    section: 'Neurological Conditions'
  },
  {
    id: 'multiple_sclerosis',
    type: 'yes-no',
    question: 'Do you have multiple sclerosis?',
    section: 'Neurological Conditions'
  },
  {
    id: 'alzheimers_disease',
    type: 'yes-no',
    question: 'Do you have Alzheimer\'s disease?',
    section: 'Neurological Conditions'
  },
  {
    id: 'ulcers',
    type: 'yes-no',
    question: 'Do you have ulcers?',
    section: 'Gastrointestinal Conditions'
  },
  {
    id: 'acid_reflux',
    type: 'yes-no',
    question: 'Do you have acid reflux?',
    section: 'Gastrointestinal Conditions'
  },
  {
    id: 'irritable_bowel_syndrome',
    type: 'yes-no',
    question: 'Do you have irritable bowel syndrome?',
    section: 'Gastrointestinal Conditions'
  },
  {
    id: 'hepatitis',
    type: 'yes-no',
    question: 'Do you have hepatitis (A, B, or C)?',
    section: 'Liver Conditions'
  },
  {
    id: 'liver_disease',
    type: 'yes-no',
    question: 'Do you have liver disease?',
    section: 'Liver Conditions'
  },
  {
    id: 'arthritis',
    type: 'yes-no',
    question: 'Do you have arthritis?',
    section: 'Musculoskeletal Conditions'
  },
  {
    id: 'rheumatism',
    type: 'yes-no',
    question: 'Do you have rheumatism?',
    section: 'Musculoskeletal Conditions'
  },
  {
    id: 'joint_replacement',
    type: 'yes-no',
    question: 'Do you have joint replacement?',
    section: 'Musculoskeletal Conditions'
  },
  {
    id: 'hiv_aids',
    type: 'yes-no',
    question: 'Do you have HIV/AIDS?',
    section: 'Immune System Conditions'
  },
  {
    id: 'autoimmune_diseases',
    type: 'yes-no',
    question: 'Do you have autoimmune diseases (e.g., lupus, rheumatoid arthritis)?',
    section: 'Immune System Conditions'
  },
  {
    id: 'specific_allergies',
    type: 'yes-no-details',
    question: 'Do you have allergies (list specific allergies to medications, food, latex, etc.)?',
    section: 'Allergies & Reactions',
    detailsPlaceholder: 'Please list all specific allergies'
  },
  {
    id: 'anemia',
    type: 'yes-no',
    question: 'Do you have anemia?',
    section: 'Blood Disorders'
  },
  {
    id: 'blood_transfusions',
    type: 'yes-no',
    question: 'Have you ever had blood transfusions?',
    section: 'Blood Disorders'
  },
  {
    id: 'anxiety',
    type: 'yes-no',
    question: 'Do you have anxiety?',
    section: 'Mental Health Conditions'
  },
  {
    id: 'depression',
    type: 'yes-no',
    question: 'Do you have depression?',
    section: 'Mental Health Conditions'
  },
  {
    id: 'psychiatric_conditions',
    type: 'yes-no-details',
    question: 'Do you have other psychiatric conditions?',
    section: 'Mental Health Conditions',
    detailsPlaceholder: 'Please specify the conditions'
  },
  {
    id: 'cancer',
    type: 'yes-no-details',
    question: 'Have you ever had cancer?',
    section: 'Cancer History',
    detailsPlaceholder: 'Please specify type and treatment'
  },
  {
    id: 'kidney_disease',
    type: 'yes-no',
    question: 'Do you have kidney disease?',
    section: 'Other Medical Conditions'
  },
  {
    id: 'glaucoma',
    type: 'yes-no',
    question: 'Do you have glaucoma?',
    section: 'Other Medical Conditions'
  },
  {
    id: 'osteoporosis',
    type: 'yes-no',
    question: 'Do you have osteoporosis?',
    section: 'Bone Conditions'
  },
  {
    id: 'bisphosphonate_use',
    type: 'yes-no',
    question: 'Have you ever had a history of bisphosphonate use (for osteoporosis or other conditions)?',
    section: 'Medication History'
  },
  {
    id: 'radiation_therapy',
    type: 'yes-no',
    question: 'Have you ever had a history of radiation therapy to the head or neck?',
    section: 'Treatment History'
  },
  
  // General Health
  {
    id: 'good_health',
    type: 'yes-no',
    question: 'Do you feel that you are in good health?',
    section: 'General Health Assessment'
  },
  {
    id: 'health_changes',
    type: 'yes-no-details',
    question: 'Has there been any change in your general health in the past year?',
    section: 'General Health Assessment',
    detailsPlaceholder: 'Please explain the changes'
  },
  {
    id: 'additional_conditions',
    type: 'yes-no-details',
    question: 'Do you have any disease, condition, or problem not listed above that you think the dentist should know about?',
    section: 'Additional Information',
    detailsPlaceholder: 'Please describe any additional conditions'
  },
  {
    id: 'recreational_activities',
    type: 'yes-no-details',
    question: 'Do you participate in active recreational activities?',
    section: 'Lifestyle',
    detailsPlaceholder: 'Please describe your activities'
  }
];

// Sample data for testing
export const sampleFormData = {
  full_name: "John Doe",
  date_of_birth: "1985-03-15",
  address: "123 Main Street\nAnytown, NY 12345",
  phone_numbers: "(555) 123-4567",
  email_address: "john.doe@email.com",
  emergency_contact: "Jane Doe - (555) 987-6543 - Spouse",
  visit_reason: "Routine cleaning and checkup",
  dental_pain: { answer: "no", details: "" },
  last_dental_exam: "2023-12-15",
  gum_bleeding: "no",
  teeth_grinding: "yes",
  diabetes: "no",
  high_blood_pressure: "yes",
  good_health: "yes"
};
