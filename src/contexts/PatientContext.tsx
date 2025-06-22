// contexts/PatientContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  takenOn: string[];
};

type PatientContextType = {
  patientName: string;
  medications: Medication[];
  setMedications: (meds: Medication[]) => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
};

const LOCAL_STORAGE_KEY = "patient_medications";

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [medications, setMedicationsState] = useState<Medication[]>([]);
  const [patientName, setPatientName] = useState("Eleanor Thompson");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setMedicationsState(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored medications", err);
      }
    }
  }, []);

  // Write to localStorage on changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(medications));
  }, [medications]);

  const setMedications = (meds: Medication[]) => {
    setMedicationsState(meds);
  };

  return (
    <PatientContext.Provider value={{ patientName, medications, setMedications }}>
      {children}
    </PatientContext.Provider>
  );
};
