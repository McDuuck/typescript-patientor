import { Gender, PatientEntry } from './types';

export const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
    };

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
    };

const parseName = (name: unknown): string => {
    if (!isString(name)) {
        throw new Error('Incorrect or missing name: ' + name);
    }
    return name;
    };

const parseDate = (dateOfBirth: unknown): string => {
    if (!isString(dateOfBirth)) {
        throw new Error('Incorrect or missing dateOfBirth: ' + dateOfBirth);
    }
    return dateOfBirth;
    };

const parseSsn = (ssn: unknown): string => {
    if (!isString(ssn)) {
        throw new Error('Incorrect or missing ssn: ' + ssn);
    }
    return ssn;
    };

const parseOccupation = (occupation: unknown): string => {
    if (!isString(occupation)) {
        throw new Error('Incorrect or missing occupation: ' + occupation);
    }
    return occupation;
    };


export interface RawPatientEntry {
    name?: string;
    dateOfBirth?: string;
    ssn?: string;
    gender?: string;
    occupation?: string;
}

export const toNewPatientEntry = (object: RawPatientEntry): PatientEntry => {
    console.log(object);
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
      }
    const newEntry: PatientEntry = {
        id: 'test',
        name: parseName(object.name),
        dateOfBirth: parseDate(object.dateOfBirth),
        ssn: parseSsn(object.ssn),
        gender: 'male' as Gender,
        occupation: parseOccupation(object.occupation),
        entries: []
    };
    return newEntry;
};


