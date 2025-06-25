import React, { useState } from 'react'
import { Clock, Check, Camera, MoreVertical, EditIcon, Trash, X } from 'lucide-react'
import { Medication } from '@/types'
import { useMedication } from '@/contexts/MedicationContext'
import { Button } from '@/components/ui/button'

interface MedicationCardProps {
  medication: Medication;
  onEdit: (med: Medication) => void;
}

interface TakenDetailsProps {
  medication: Medication;
  onClose: () => void;
}

const TakenDetails: React.FC<TakenDetailsProps> = ({ medication, onClose }) => {
  console.log(medication)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Medication Taken Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: medication.color }}
            />
            <span className="font-medium">{medication.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Dosage</p>
              <p>{medication.dosage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Taken</p>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {new Date(medication?.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
          </div>

          {/* <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Camera className="mr-2" size={16} />
              Add Photo
            </Button>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onEdit }) => {
  const { markMedicationTaken, isMedicationTakenToday, deleteMedication, medicationLogs } = useMedication()
  const [showTakenDetails, setShowTakenDetails] = useState(false)
  const isTaken = isMedicationTakenToday(medication.id)

  const handleMarkTaken = (medication: any) => {
    if (!isTaken) {
      markMedicationTaken(medication.id, medication, 'Marked as taken from dashboard')
    }
    setShowTakenDetails(true)
  }
  console.log(medicationLogs)
  const frequencyText = {
    once: 'Once daily',
    twice: 'Twice daily',
    three_times: '3 times daily',
    four_times: '4 times daily'
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: medication.color }}
            />
            <div>
              <h3 className="font-semibold text-gray-900">{medication.name}</h3>
              <p className="text-sm text-gray-500">{medication.dosage}</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              className="p-1 rounded-lg hover:bg-gray-100"
              onClick={() => onEdit(medication)}
            >
              <EditIcon size={16} className="text-gray-400" />
            </button>
            <Button
              size="sm"
              variant="ghost"
              className="p-2"
              onClick={() => {
                if (confirm('Are you sure you want to delete this medication?')) {
                  deleteMedication(medication.id)
                }
              }}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>{frequencyText[medication.frequency]}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Times:</span>
            <div className="flex space-x-1">
              {medication.time.map((time, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>

          {medication.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              {medication.notes}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            className={`flex items-center space-x-2 ${isTaken ? 'text-green-600' : 'text-gray-400'}`}
            onClick={() => isTaken && setShowTakenDetails(true)}
          >
            <Check size={16} />
            <span className="text-sm font-medium">
              {isTaken ? 'Taken today' : 'Not taken'}
            </span>
          </button>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              className="p-2"
            >
              <Camera size={16} />
            </Button>
            <Button
              size="sm"
                             className={`px-4 py-3 flex items-cente justify-between rounded-lg border bg-purple-50 text-black text-sm font-medium hover:text-gray-900 border-purple-300`}

              onClick={() => handleMarkTaken(medication)}
              disabled={isTaken}
              variant={isTaken ? 'ghost' : 'primary'}
            >
              {isTaken ? 'Taken' : 'Mark Taken'}
            </Button>
          </div>
        </div>
      </div>

      {showTakenDetails && (
        <TakenDetails
          medication={medication}
          onClose={() => setShowTakenDetails(false)}
        />
      )}
    </>
  )
}