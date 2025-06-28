import { useEffect, useState, useCallback, memo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from './ui/select'

interface Medication {
    id: string
    name: string
    dosage: string
    schedule: string
}

const scheduleOptions = [
    'Once daily',
    'Twice daily',
    'Thrice daily',
    'Every 6 hours',
    'Every 8 hours',
    'Before sleep',
    'As needed',
]

// ✅ Memoized MedicationCard component
const MedicationCard = memo(function MedicationCard({
    med,
    isEditing,
    editedValues,
    onEditChange,
    onEditClick,
    onCancel,
    onSave,
    onDelete,
}: {
    med: Medication
    isEditing: boolean
    editedValues: { name: string; dosage: string; schedule: string }
    onEditChange: (field: keyof Medication, value: string) => void
    onEditClick: () => void
    onCancel: () => void
    onSave: () => void
    onDelete: () => void
}) {
    return (
        <div className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1">
                    {isEditing ? (
                        <>
                            <Input
                                placeholder="Name"
                                value={editedValues.name}
                                onChange={(e) => onEditChange('name', e.target.value)}
                            />
                            <div className="relative">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Dosage"
                                    value={editedValues.dosage}
                                    onChange={(e) =>
                                        onEditChange('dosage', e.target.value.replace(/\D/g, ''))
                                    }
                                    className="pr-10"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    mg
                                </span>
                            </div>
                            <Select
                                value={editedValues.schedule}
                                onValueChange={(val) => onEditChange('schedule', val)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                    {scheduleOptions.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </>
                    ) : (
                        <>
                            <div className="text-lg font-semibold text-gray-900">{med.name}</div>
                            <div className="text-sm text-gray-600">
                                {med.dosage} — {med.schedule}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-2 min-w-[90px]">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                onClick={onSave}
                                className="text-green-700 border-green-700"
                                variant="outline"
                            >
                                Save
                            </Button>
                            <Button size="sm" variant="ghost" onClick={onCancel}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={onEditClick}
                                className="text-blue-600 border-blue-600"
                            >
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={onDelete}>
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
})

export default function MedicationList() {
    const [medications, setMedications] = useState<Medication[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editedValues, setEditedValues] = useState<{
        name: string
        dosage: string
        schedule: string
    }>({ name: '', dosage: '', schedule: '' })

    const fetchMeds = useCallback(async () => {
        const { data, error } = await supabase
            .from('medications')
            .select('*')
            .order('created_at', { ascending: false })
        if (!error && data) setMedications(data)
    }, [])

    useEffect(() => {
        fetchMeds()
    }, [fetchMeds])

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('medications').delete().eq('id', id)
        if (!error) fetchMeds()
    }

    const handleEditClick = (med: Medication) => {
        setEditingId(med.id)
        setEditedValues({
            name: med.name,
            dosage: med.dosage.replace(' mg', ''),
            schedule: med.schedule,
        })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditedValues({ name: '', dosage: '', schedule: '' })
    }

    const handleSave = async (id: string) => {
        const { name, dosage, schedule } = editedValues
        if (!name.trim() || !dosage || isNaN(Number(dosage)) || !schedule) return

        const { error } = await supabase
            .from('medications')
            .update({
                name: name.trim(),
                dosage: `${dosage} mg`,
                schedule,
            })
            .eq('id', id)

        if (!error) {
            setEditingId(null)
            setEditedValues({ name: '', dosage: '', schedule: '' })
            fetchMeds()
        }
    }

    const handleEditChange = (field: keyof Medication, value: string) => {
        setEditedValues((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div className="grid gap-4 mt-6">
            {medications.length === 0 ? (
                <div className="text-gray-500 text-center py-8 border rounded-md">
                    No medications found.
                </div>
            ) : (
                medications.map((med) => (
                    <MedicationCard
                        key={med.id}
                        med={med}
                        isEditing={editingId === med.id}
                        editedValues={editedValues}
                        onEditChange={handleEditChange}
                        onEditClick={() => handleEditClick(med)}
                        onCancel={handleCancelEdit}
                        onSave={() => handleSave(med.id)}
                        onDelete={() => handleDelete(med.id)}
                    />
                ))
            )}
        </div>
    )
}
