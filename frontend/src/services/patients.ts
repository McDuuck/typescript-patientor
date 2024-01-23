import axios from "axios";
import { Patient, PatientFormValues, BaseEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const getEntries = async (id: string) => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients/${id}/entries`);
  return data;
};


const createEntries = async (id: string, object: BaseEntry) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );

  return data;
};

export default {
  getAll, create, getOne, getEntries, createEntries
};

