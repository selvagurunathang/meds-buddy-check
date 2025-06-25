import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MedicationProvider, useMedication } from '../contexts/MedicationContext'
import { Medication } from '../types'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MedicationProvider>{children}</MedicationProvider>
)

describe('useMedication', () => {
  it('should add medication correctly', () => {
    const { result } = renderHook(() => useMedication(), { wrapper })
    
    const newMedication: Omit<Medication, 'id' | 'createdAt'> = {
      name: 'Test Med',
      dosage: '5mg',
      frequency: 'twice',
      time: ['08:00', '20:00'],
      color: '#10B981',
      notes: 'With food'
    }
    
    act(() => {
      result.current.addMedication(newMedication)
    })
    
    expect(result.current.medications).toHaveLength(3) // 2 mock + 1 new
    expect(result.current.medications[2].name).toBe('Test Med')
    expect(result.current.medications[2].dosage).toBe('5mg')
  })

  it('should mark medication as taken', () => {
    const { result } = renderHook(() => useMedication(), { wrapper })
    
    const medicationId = result.current.medications[0].id
    
    act(() => {
      result.current.markMedicationTaken(medicationId, undefined, 'Test note')
    })
    
    expect(result.current.isMedicationTakenToday(medicationId)).toBe(true)
    expect(result.current.adherenceStats.takenToday).toBeGreaterThan(0)
  })

  it('should calculate adherence stats correctly', () => {
    const { result } = renderHook(() => useMedication(), { wrapper })
    
    expect(result.current.adherenceStats.totalMedications).toBe(2)
    expect(result.current.adherenceStats.adherencePercentage).toBeGreaterThanOrEqual(0)
    expect(result.current.adherenceStats.adherencePercentage).toBeLessThanOrEqual(100)
  })
})