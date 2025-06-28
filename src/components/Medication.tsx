import MedicationForm from './MedicationForm'
import MedicationList from './MedicationList'
import { useState } from 'react'

export default function Medication() {
    const [refresh, setRefresh] = useState(false)

    return (
        <div className="max-w-xl mx-auto mt-10">
            <MedicationList key={refresh.toString()} />
            <MedicationForm onSuccess={() => setRefresh(!refresh)} />
        </div>
    )
}
