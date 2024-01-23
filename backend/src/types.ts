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
    
    diagnosisCodes?: Array<DiagnoseEntry['code']>;
    }

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
    }
    
    interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: HealthCheckRating;
    }

interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
        startDate: string;
        endDate: string;
        };
    }

interface HospitalEntry extends BaseEntry {
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

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export enum Gender {
    Men = 'male',
    Female = 'female',
    Other = 'other'
    }

export interface PatientEntry {
    name: string;
    dateOfBirth: string;
    ssn?: string;
    gender: Gender;
    occupation: string;
    entries: Entry[]
    id: string;
    }


export interface Patient {
    name: string;
    ssn: string;
    occupation: string;
    gender: Gender;
    dateOfBirth: string;
    entries: Entry[]
    id: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;