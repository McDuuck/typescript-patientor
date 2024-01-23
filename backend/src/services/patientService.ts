import patientEntries from '../../data/patients';
import { PatientEntry, Gender, Entry } from '../types';

const patients: PatientEntry[] = patientEntries;

const getPatients = (id?: string): PatientEntry[] => {
    if (id) {
        const patient = patients.find(patient => patient.id === id);
        return patient ? [patient] : [];
    }
    return patients;
};

const addPatient = (newPatientEntry: PatientEntry): PatientEntry => {
    const { name, dateOfBirth, ssn, gender, occupation } = newPatientEntry;

    const maxId = Math.max(...patients.map(p => Number(p.id)).filter(n => !isNaN(n)), 0);
    const patient: PatientEntry = {
        name,
        dateOfBirth,
        ssn,
        gender: gender as Gender,
        occupation,
        entries: [],
        id: String(maxId + 1),
    };

    patients.push(patient);
    return patient;
};

const addEntry = (id: string, newEntry: Entry): PatientEntry | undefined => {
    const patient = patients.find(patient => patient.id === id);
    if (patient) {
        patient.entries.push(newEntry);
        return patient;
    }
    return undefined;
};

export default {
    getPatients,
    addPatient,
    addEntry
    };
