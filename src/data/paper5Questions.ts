
export interface FinalDiagnosisOption {
  id: string;
  diagnosis: string;
  description: string;
}

export const sampleDiagnosisOptions: FinalDiagnosisOption[] = [
  {
    id: "caries",
    diagnosis: "Dental Caries",
    description: "Tooth decay affecting enamel and dentin"
  },
  {
    id: "gingivitis", 
    diagnosis: "Gingivitis",
    description: "Inflammation of the gums"
  },
  {
    id: "periodontitis",
    diagnosis: "Periodontitis", 
    description: "Advanced gum disease affecting supporting structures"
  },
  {
    id: "pulpitis",
    diagnosis: "Pulpitis",
    description: "Inflammation of the tooth pulp"
  },
  {
    id: "abscess",
    diagnosis: "Dental Abscess",
    description: "Bacterial infection in tooth or gum"
  }
];

export interface Paper5FormData {
  finalDiagnosis: string;
  diagnosisJustification: string;
  treatmentPlan: string;
  dateOfDiagnosis: Date | null;
}
