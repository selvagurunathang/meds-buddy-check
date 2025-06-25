import React, { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from '@/components/ui/modal-dia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input-set'
import { useMedication } from '@/contexts/MedicationContext'
import { Medication } from '@/types'

interface MedicationFormModalProps {
  isOpen: boolean
  onClose: () => void
  defaultValues?: Medication
  isEdit?: boolean
}

const medicationColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16']

const frequencyOptions = [
  { value: 'once', label: 'Once daily', times: 1 },
  { value: 'twice', label: 'Twice daily', times: 2 },
  { value: 'three_times', label: '3 times daily', times: 3 },
  { value: 'four_times', label: '4 times daily', times: 4 }
] as const

type FormValues = {
  name: string
  dosage: string
  frequency: typeof frequencyOptions[number]['value']
  notes?: string
  color: string
}

const MedicationFormModal: React.FC<MedicationFormModalProps> = ({
  isOpen,
  onClose,
  defaultValues,
  isEdit = false
}) => {
  const { addMedication, updateMedication } = useMedication()
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      dosage: '',
      frequency: 'once',
      color: medicationColors[0],
      notes: ''
    }
  })

  const frequency = watch('frequency')
  const [times, setTimes] = useState<string[]>(['08:00'])
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        dosage: defaultValues.dosage,
        frequency: defaultValues.frequency,
        color: defaultValues.color,
        notes: defaultValues.notes || ''
      })
      setTimes(defaultValues.time)
    } else {
      reset()
      setTimes(['08:00'])
    }
  }, [defaultValues, isOpen])


  useEffect(() => {
    const option = frequencyOptions.find(opt => opt.value === frequency)
    if (option) {
      const newTimes = Array(option.times).fill(0).map((_, index) => {
        const hour = 8 + index * 6
        return `${hour.toString().padStart(2, '0')}:00`
      })
      setTimes(newTimes)
    }
  }, [frequency])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      if (isEdit && defaultValues) {
        updateMedication(defaultValues.id, { ...data, time: times })
      } else {
        addMedication({ ...data, time: times })
      }
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times]
    newTimes[index] = value
    setTimes(newTimes)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Medication' : 'Add Medication'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <Input label="Medication Name" {...field} error={errors.name?.message} />
            )}
          />
          <Controller
            name="dosage"
            control={control}
            rules={{ required: 'Dosage is required' }}
            render={({ field }) => (
              <Input label="Dosage" {...field} error={errors.dosage?.message} />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {frequencyOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('frequency', option.value)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${watch('frequency') === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                  }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-500">{option.times} time{option.times > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />Times
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {times.map((time, index) => (
              <Input
                key={index}
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(index, e.target.value)}
                required
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex space-x-2">
                {medicationColors.map(color => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => field.onChange(color)}
                    className={`w-8 h-8 rounded-full border-2 ${field.value === color ? 'border-gray-600 scale-110' : 'border-gray-200'
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          />
        </div>

        {/* <div>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  {...field}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-400"
                />
              </>
            )}
          />
        </div> */}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            className={`px-4 py-3 flex items-cente justify-between rounded-lg border bg-purple-50 text-black text-sm font-medium hover:text-gray-900 border-purple-300`}
            type="submit" loading={loading}>
            {isEdit ? 'Update' : 'Add'} Medication
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default MedicationFormModal
