import { useState, useEffect } from "react";
import { Box, Table, Button, TableHead, Typography, TableCell, TableRow, TableBody } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import FormControl from '@mui/material/FormControl';

import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import axios from 'axios';

import { PatientFormValues, Patient, Diagnosis, Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry,  } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import patientService from "../../services/patients";
import diagnoseService from "../../services/diagnoses";

interface Props {
  patients : Patient[]
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>
}

const PatientListPage = ({ patients, setPatients } : Props ) => {

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState('home');
  const [patientData, setPatientData] = useState({});
  const [diagnosesData, setDiagnoses] = useState({});
  const [entryType, setEntryType] = useState<string>('');
  

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const getDiagnoses = async () => {
    const diagnoses = await diagnoseService.getDiagnosis();
    setDiagnoses(diagnoses);
  };

  const getPatient = async (id: string) => {
    const patient = await patientService.getOne(id);
    setPage('patient');
    setPatientData(patient);
    getDiagnoses();
  };

  const findDiagnosis = (code: string, diagnoseData: Diagnosis[] | Diagnosis): Diagnosis | undefined => {
    let data: Diagnosis[];
    if (!Array.isArray(diagnoseData)) {
      data = [diagnoseData];
    } else {
      data = diagnoseData;
    }
    return data.find(diagnosis => diagnosis.code === code);
  };

  const assertNever = (value: Entry): never => {
    throw new Error(
      `Unhandled entry type: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{ entry: Patient['entries'][0] }> = ({ entry }) => {
    switch (entry.type) {
      case "Hospital":
        const hospitalEntry = entry as HospitalEntry;
        return (
          <div>
            <LocalHospitalIcon />
            <div>
              <b>Discharge:</b> {hospitalEntry.discharge.date} {hospitalEntry.discharge.criteria}
            </div>
          </div>
        );
      case "HealthCheck":
        const healthCheckEntry = entry as HealthCheckEntry;
        return (
          <div>
            <LocalHospitalIcon />
            <div>
              <HealthRatingBar showText={false} rating={healthCheckEntry.healthCheckRating} />
            </div>
          </div>
        );
      case "OccupationalHealthcare":
        const occupationalHealthcareEntry = entry as OccupationalHealthcareEntry;
        return (
          <div>
            <div>
            <BusinessCenterIcon /> {occupationalHealthcareEntry.employerName} 
            </div>
            <div>
             {occupationalHealthcareEntry.sickLeave?.startDate} - {occupationalHealthcareEntry.sickLeave?.endDate}
            </div>
            <br />
          </div>
        );
      default:
        return assertNever(entry);
    }
  };

  const TypeForm = () => {
    const entryStyle = {
      border: '1px solid #000',
      margintop: '10px',
      marginbottom: '10px',
      padding: '10px',
      borderRadius: '5px',
      gap: '10px',
    };

    const buttonStyle = {
      marginRight: '10px', // Add right margin to each button
    };

    return (
      <div style={entryStyle}>
        <div>
          <Button style={buttonStyle} variant="contained" color="primary" onClick={() => setEntryType('Hospital')}>Hospital</Button>
          <Button style={buttonStyle} variant="contained" color="primary" onClick={() => setEntryType('HealthCheck')}>HealthCheck</Button>
          <Button style={buttonStyle} variant="contained" color="primary" onClick={() => setEntryType('OccupationalHealthcare')}>OccupationalHealthcare</Button>
        </div>
      </div>
    );
  };

  const EntriesForm = () => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState(0);
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [employerName, setEmployerName] = useState('');
    const [notification, setNotification] = useState<string>('');
    const [discharge, setDischarge] = useState('');
    const [sickLeave, setSickLeave] = useState('');
    const [criteria, setCriteria] = useState('');
    const [reloadEntries, setReloadEntries] = useState(false);

    const entryStyle = {
      border: '1px solid #000',
      margintop: '10px',
      marginbottom: '10px',
      padding: '10px',
      borderRadius: '5px',
      gap: '10px',
    };

    const submitNewHealthCheck = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const newEntry = {
        description,
        date,
        specialist,
        diagnosisCodes,
        healthCheckRating,
        type: "HealthCheck",
        id: Math.floor(Math.random() * 1000000).toString(),
      };

      if (description === '' || date === '' || specialist === '' || healthCheckRating < 0 || healthCheckRating > 3 || diagnosisCodes.length === 0) {
        setNotification('Please fill in all fields or check health rating (0-3)');
        setTimeout(() => {
          setNotification('');
        }, 3000);
        return;
      }

      const patientId = (patientData as Patient[])[0]?.id;
      patientService.createEntries(patientId, { ...newEntry, entries: [] });
      setDescription('');
      setDate('');
      setSpecialist('');
      setDiagnosisCodes([]);
      setHealthCheckRating(0);
      setReloadEntries(true);
    };

    const submitNewOccupationalHealthcare = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const newEntry = {
        id: Math.floor(Math.random() * 1000000).toString(),
        date,
        specialist,
        type: "OccupationalHealthcare",
        employerName,
        description,
      };

      if (description === '' || date === '' || specialist === '' || employerName === '') {
        setNotification('Please fill in all fields');
        setTimeout(() => {
          setNotification('');
        }, 3000);
        return;
      }

      const patientId = (patientData as Patient[])[0]?.id;
      patientService.createEntries(patientId, { ...newEntry, entries: [] });
      setDescription('');
      setDate('');
      setSpecialist('');
      setEmployerName('');
      setReloadEntries(true);
    };

    const submitHospital = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const newEntry = {
        id: Math.floor(Math.random() * 1000000).toString(),
        date,
        type: "Hospital",
        specialist,
        diagnosisCodes,
        description,
        discharge: {
          date: sickLeave,
          criteria: criteria,
        }
      };

      if (description === '' || date === '' || specialist === '' || discharge === '' || diagnosisCodes.length === 0) {
        setNotification('Please fill in all fields');
        setTimeout(() => {
          setNotification('');
        }, 3000);
        return;
      }

      const patientId = (patientData as Patient[])[0]?.id;
      patientService.createEntries(patientId, { ...newEntry, entries: [] });
      setDescription('');
      setDate('');
      setSpecialist('');
      setDischarge('');
      setSickLeave('');
      setCriteria('');
      setDiagnosisCodes([]);
      setReloadEntries(true);
    };

    useEffect(() => {
      if (reloadEntries) {
        getPatient((patientData as Patient[])[0]?.id);
        setReloadEntries(false);
      }
    }, [reloadEntries]);

    if (entryType === 'Hospital') {
      return (
        <div style={entryStyle}>
          <b>Hospital</b>
          <form onSubmit={submitHospital}>
            <div>
              <br />
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={({ target }) => setDate(target.value)}
              />
            </div>
            <div>
              <label>Specialist</label>
              <input
                type="text"
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />
            </div>
            <div>
              <label>Diagnosis Codes</label>
              < br/>
              <FormControl sx={{ minWidth: 100 }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={diagnosisCodes}
                  onChange={(event) => setDiagnosisCodes(Array.isArray(event.target.value) ? event.target.value : [event.target.value])}
                  sx={{ minWidth: 100 }}
                >
                  {Array.isArray(diagnosesData) && diagnosesData.map((diagnose, index) => (
                    <MenuItem key={index} value={diagnose.code}>
                      {diagnose.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <b>Discharge</b>
              < br/>
              <label>Start</label>
              <input
                type="date"
                value={discharge}
                onChange={({ target }) => setDischarge(target.value)}
              />
              <br />
              <label>End</label>
              <input
                type="date"
                value={sickLeave}
                onChange={({ target }) => setSickLeave(target.value)}
              />
            </div>
            <div>
              <label>Criteria</label>
              <input
                type="text"
                value={criteria}
                onChange={({ target }) => setCriteria(target.value)}
              />
            </div>
            <br />
            <button type="submit">Add New Entry</button>
          </form>
          {notification && <div>{notification}</div>}
        </div>
      );
    }

    if (entryType === 'OccupationalHealthcare') {
      return (
        <div style={entryStyle}>
          <b>OccupationalHealthcare</b>
          
          <form onSubmit={submitNewOccupationalHealthcare}>
            <div>
            <br />
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={({ target }) => setDate(target.value)}
              />
            </div>
            <div>
              <label>Specialist</label>
              <input
                type="text"
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />
            </div>
            <div>
              <label>Employer Name</label>
              <input
                type="text"
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
              />
            </div>
            <button type="submit">Add New Entry</button>
          </form>
          {notification && <div>{notification}</div>}
        </div>
      );
    }
  
    if (entryType === 'HealthCheck') {
      return (
        <div style={entryStyle}>
          <b>Health Check</b>
          <form onSubmit={submitNewHealthCheck}>
            <div>
              <br />
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
            </div>
            <div>
              <label>Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={({ target }) => setDate(target.value)}
              />
            </div>
            <div>
              <label>Specialist</label>
              <input
                type="text"
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />
            </div>
            <div>
              <label>Health Check Rating (0-3) </label>
              <input
                type="number"
                value={healthCheckRating}
                onChange={({ target }) => setHealthCheckRating(Number(target.value))}
              />
            </div>
            <div>
            <label>Diagnosis Codes</label>
              < br/>
              <FormControl sx={{ minWidth: 100 }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  multiple
                  value={diagnosisCodes}
                  onChange={(event) => setDiagnosisCodes(Array.isArray(event.target.value) ? event.target.value : [event.target.value])}
                  sx={{ minWidth: 100 }}
                >
                  {Array.isArray(diagnosesData) && diagnosesData.map((diagnose, index) => (
                    <MenuItem key={index} value={diagnose.code}>
                      {diagnose.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <button type="submit">Add New Entry</button>
          </form>
          {notification && <div>{notification}</div>}
        </div>
      );
    }
  };
  


  const Entries = () => {
    const entryStyle = {
      border: '1px solid #000',
      margintop: '10px',
      marginbottom: '10px',
      padding: '10px',
      borderRadius: '5px',
      gap: '10px',
  };
    return (
      <div>
        {(patientData as Patient[])[0]?.entries?.map((entry) => (
          <div key={entry.id} style={entryStyle}>
            <div>
              <b>{entry.date}</b> 
              <br/>
              <i>{entry.description}</i>
            </div>
            <ul>
              {entry.diagnosisCodes?.map((code) => {
                const diagnosis = findDiagnosis(code, diagnosesData as Diagnosis[]);
                return (
                  <li key={code}>
                    {diagnosis ? `${code} - ${diagnosis.name}` : code}
                    <div>diagnosed by {entry.specialist}</div>
                  </li>
                );
              })}
            </ul>
            <EntryDetails entry={entry} />
          </div>
        ))}
      </div>
    );
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients(patients.concat(patient));
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const toPage = (page: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setPage(page);
  };

  const content = () => {
    switch (page) {
      case 'home':
        return <Home />;
      case 'patient':
        return <PatientPage />;
      default:
        return null;
    }
  };

  const PatientPage = () => {
    return (
      <div>
        <br />
        <div>
            <b>{(patientData as Patient[])[0]?.name} {(patientData as Patient[])[0]?.gender}</b>
        </div>
        <div>
            <b>ssn:</b> {(patientData as Patient[])[0]?.ssn}
        </div>
        <div>
            <b>occupation:</b> {(patientData as Patient[])[0]?.occupation}
        </div>
        < br/>
        <div>
          <TypeForm />
        </div>
        <div>
          <EntriesForm />
        </div>
        < br/>
        <div>
          <b>Entries</b>
        </div>
        < br/>
        <Entries />
      </div>
    );
  };

  const Home = () => {
    return (
      <div className="App">
        <Box>
          <Typography align="center" variant="h6">
            Patient list
          </Typography>
        </Box>
        <Table style={{ marginBottom: "1em" }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Health Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(patients).map((patient: Patient) => (
              <TableRow key={patient.id}>
                <TableCell onClick={() => getPatient(patient.id)}>{patient.name}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.occupation}</TableCell>
                <TableCell>
                  <HealthRatingBar showText={false} rating={1} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddPatientModal
          modalOpen={modalOpen}
          onSubmit={submitNewPatient}
          error={error}
          onClose={closeModal}
        />
        <Button variant="contained" onClick={() => openModal()}>
        Add New Patient
      </Button>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Button onClick={toPage('home')} variant="contained" color="primary">
            Home
        </Button>
      </div>
      {content()}
    </div>
  );
};


export default PatientListPage;
