import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MedicationCard } from '../components/dashboard/MedicationCard'
import { MedicationProvider } from '../contexts/MedicationContext'
import { Medication } from '../types'

const mockMedication: Medication = {
  id: '1',
  name: 'Test Medication',
  dosage: '10mg',
  frequency: 'once',
  time: ['08:00'],
  color: '#3B82F6',
  notes: 'Test notes',
  createdAt: new Date('2024-01-01')
}

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <MedicationProvider>
      {component}
    </MedicationProvider>
  )
}

describe('MedicationCard', () => {
  it('renders medication information correctly', () => {
    renderWithProvider(<MedicationCard medication={mockMedication} onEdit={vi.fn()} />)
    
    expect(screen.getByText('Test Medication')).toBeInTheDocument()
    expect(screen.getByText('10mg')).toBeInTheDocument()
    expect(screen.getByText('Once daily')).toBeInTheDocument()
    expect(screen.getByText('08:00')).toBeInTheDocument()
    expect(screen.getByText('Test notes')).toBeInTheDocument()
  })

  it('shows correct status when medication is not taken', () => {
    renderWithProvider(<MedicationCard medication={mockMedication} onEdit={vi.fn()} />)
    
    expect(screen.getByText('Not taken')).toBeInTheDocument()
    expect(screen.getByText('Mark Taken')).toBeInTheDocument()
  })

  it('allows marking medication as taken', () => {
    renderWithProvider(<MedicationCard medication={mockMedication} onEdit={vi.fn()} />)
    
    const markTakenButton = screen.getByText('Mark Taken')
    fireEvent.click(markTakenButton)
    
  
    expect(screen.getByText('Taken today')).toBeInTheDocument()
  })
})