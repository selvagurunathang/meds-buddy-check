import { useState, useCallback, useMemo } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from './ui/select';
import { getCurrentUser, addMedication } from '../lib/supabaseService';

const SCHEDULE_OPTIONS = [
    { label: 'Once daily', value: 'Once daily' },
    { label: 'Twice daily', value: 'Twice daily' },
    { label: 'Thrice daily', value: 'Thrice daily' },
    { label: 'Every 6 hours', value: 'Every 6 hours' },
    { label: 'Every 8 hours', value: 'Every 8 hours' },
    { label: 'Before sleep', value: 'Before sleep' },
    { label: 'As needed', value: 'As needed' },
];

export default function MedicationForm({ onSuccess }: { onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [schedule, setSchedule] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const scheduleSelectItems = useMemo(
        () =>
            SCHEDULE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            )),
        []
    );

    const handleDosageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setDosage(value);
        }
    }, []);

    const handleAdd = useCallback(async () => {
        if (!name.trim()) return setError('Please enter medication name');
        if (!dosage || isNaN(Number(dosage))) return setError('Dosage must be a valid number');
        if (!schedule) return setError('Please select a schedule');

        setLoading(true);
        setError(null);

        try {
            const user = await getCurrentUser();
            await addMedication({
                name: name.trim(),
                dosage: `${dosage} mg`,
                schedule,
                userId: user.id,
            });

            setName('');
            setDosage('');
            setSchedule('');
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        }

        setLoading(false);
    }, [name, dosage, schedule, onSuccess]);

    return (
        <div className="mt-6 p-4 space-y-3 border rounded-md text-center max-w-md mx-auto">
            <Input
                placeholder="Medication Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="relative">
                <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Dosage"
                    value={dosage}
                    onChange={handleDosageChange}
                    className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">mg</span>
            </div>

            <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Schedule" />
                </SelectTrigger>
                <SelectContent>{scheduleSelectItems}</SelectContent>
            </Select>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
                onClick={handleAdd}
                disabled={loading}
                className="w-full mt-4 py-3 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Adding...' : 'Add Medication'}
            </Button>
        </div>
    );
}
