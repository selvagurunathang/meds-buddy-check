export interface User {
  id: string
  email: string
  role: 'patient' | 'caretaker'
  name: string
  avatar?: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: 'once' | 'twice' | 'three_times' | 'four_times'
  time: string[]
  color: string
  notes?: string
  createdAt: Date
}

export interface MedicationLog {
  id: string
  medicationId: string
  takenAt: Date
  photoUrl?: string
  notes?: string
  dosage: string,
  frequency: string,
  name: string
}

export interface AdherenceStats {
  totalMedications: number
  takenToday: number
  adherencePercentage: number
  currentStreak: number
  longestStreak: number
}

export type UserRole = 'patient' | 'caretaker'