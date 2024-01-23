export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface DiagnoseEntry {
  code: string;
  name: string;
  latin?: string;
  }

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  entries: Entry[];
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
  type: string;
  }

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
  }
  
export interface HealthCheckEntry extends BaseEntry {
type: "HealthCheck";
healthCheckRating: HealthCheckRating;
}


export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: {
      startDate: string;
      endDate: string;
      };
  
  }

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: {
      date: string;
      criteria: string;
      };
  }

  export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry
  | BaseEntry;

  

export const addEntryToPatient = (patient: BaseEntry, entry: Entry): BaseEntry => {
  patient.entries.push(entry);
  return patient;
};

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;