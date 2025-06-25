import React, { createContext, useContext, useState, useEffect } from 'react'
import { Medication, MedicationLog, AdherenceStats } from '@/types'
import { format, isToday, startOfDay, differenceInDays } from 'date-fns'

interface MedicationContextType {
  medications: Medication[]
  medicationLogs: MedicationLog[]
  adherenceStats: AdherenceStats
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt'>) => void
  updateMedication: (id: string, medication: Partial<Medication>) => void
  deleteMedication: (id: string) => void
  handleRemove: (id: string) => void
  markMedicationTaken: (medicationId: string, photoUrl?: string, notes?: string) => void
  getMedicationLogsForDate: (date: Date) => MedicationLog[]
  isMedicationTakenToday: (medicationId: string) => boolean
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined)

export const useMedication = () => {
  const context = useContext(MedicationContext)
  if (context === undefined) {
    throw new Error('useMedication must be used within a MedicationProvider')
  }
  return context
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'once',
    time: ['08:00'],
    color: '#3B82F6',
    notes: 'Take with food',
    createdAt: new Date('2025-06-01')
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'twice',
    time: ['08:00', '20:00'],
    color: '#10B981',
    notes: 'Take with meals',
    createdAt: new Date('2025-06-23')
  }
]

const mockLogs: MedicationLog[] = [
  {
    id: '1',
    medicationId: '1',
    takenAt: new Date(),
    notes: 'Taken with breakfast',
    dosage: '500mg',
    frequency: 'twice',
    name: "Lisinopril"
  }
]

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>(mockMedications)
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>(mockLogs)
  const [adherenceStats, setAdherenceStats] = useState<AdherenceStats>({
    totalMedications: 0,
    takenToday: 0,
    adherencePercentage: 0,
    currentStreak: 0,
    longestStreak: 0
  })

   
  useEffect(() => {
    const totalMedications = medications.length
    const takenToday = medications.filter(med => isMedicationTakenToday(med.id)).length
    const adherencePercentage = totalMedications > 0 ? Math.round((takenToday / totalMedications) * 100) : 0

    
    const currentStreak = calculateCurrentStreak()
    const longestStreak = Math.max(currentStreak, 7)  

    setAdherenceStats({
      totalMedications,
      takenToday,
      adherencePercentage,
      currentStreak,
      longestStreak
    })
  }, [medications, medicationLogs])

  const calculateCurrentStreak = (): number => {
    
    const today = new Date()
    let streak = 0

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      const logsForDate = getMedicationLogsForDate(checkDate)
      const medicationsForDate = medications.filter(med =>
        med.createdAt <= checkDate
      )

      if (medicationsForDate.length === 0) continue

      const takenCount = logsForDate.length
      if (takenCount === medicationsForDate.length) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  const addMedication = (medicationData: Omit<Medication, 'id' | 'createdAt'>) => {
    const newMedication: Medication = {
      ...medicationData,
      id: generateId(),
      createdAt: new Date()
    }
    setMedications(prev => [...prev, newMedication])
  }

  const updateMedication = (id: string, medicationData: Partial<Medication>) => {
    setMedications(prev =>
      prev.map(med => med.id === id ? { ...med, ...medicationData } : med)
    )
  }

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id))
    setMedicationLogs(prev => prev.filter(log => log.medicationId !== id))
  }

  const markMedicationTaken = (medicationId: string, photoUrl?: string, notes?: string) => {
    const medication = medications.find(med => med.id === medicationId);
    if (!medication) return;

    const newLog: MedicationLog = {
      id: generateId(),
      medicationId,
      takenAt: new Date(),
      photoUrl,
      notes,
      dosage: medication.dosage,
      frequency: medication.frequency,
      name: medication.name,
    };
    setMedicationLogs(prev => [...prev, newLog]);
  }
  const handleRemove = (id: any) => {
    setMedicationLogs(prev => prev.filter(log => log.id !== id))

  }

  const getMedicationLogsForDate = (date: Date): MedicationLog[] => {
    return medicationLogs.filter(log =>
      format(log.takenAt, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
  }

  const isMedicationTakenToday = (medicationId: string): boolean => {
    return medicationLogs.some(log =>
      log.medicationId === medicationId && isToday(log.takenAt)
    )
  }

  const value = {
    medications,
    medicationLogs,
    adherenceStats,
    addMedication,
    updateMedication,
    deleteMedication,
    markMedicationTaken,
    getMedicationLogsForDate,
    isMedicationTakenToday,
    handleRemove
  }

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  )
}