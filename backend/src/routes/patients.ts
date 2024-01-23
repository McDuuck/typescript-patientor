import express from 'express';
import { toNewPatientEntry, RawPatientEntry } from '../utils';
import patientService from '../services/patientService';
import { Entry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.post('/', (req, res) => {
    try {
        const newPatientEntry = toNewPatientEntry(req.body as RawPatientEntry);
        const addedPatient = patientService.addPatient(newPatientEntry);
        res.json(addedPatient);
        } catch (error: unknown) {
            let errorMessage = 'Something went wrong ';
            if (error instanceof Error) {
                errorMessage += 'Error: ' + error.message;
            }
            res.status(400).send(errorMessage);
        }
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const patient = patientService.getPatients(id);
    if (patient) {
        res.send(patient);
    } else {
        res.sendStatus(404);
    }
});

router.get('/:id/entries', (req, res) => {
    const id = req.params.id;
    const patient = patientService.getPatients(id);
    if (patient) {
        res.send(patient[0].entries);
    } else {
        res.sendStatus(404);
    }
});

router.post('/:id/entries', (req, res) => {
    const id = req.params.id;
    const newEntry = req.body as Entry;
    const updatedPatient = patientService.addEntry(id, newEntry);
    if (updatedPatient) {
        res.send(updatedPatient);
    } else {
        res.sendStatus(404);
    }
});

export default router;