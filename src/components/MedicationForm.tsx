import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Medication } from "@/types/medication";

interface MedicationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (med: Medication) => void;
  onDelete?: () => void;
  initialData?: Medication;
}

const MedicationForm = ({
  open,
  onClose,
  onSave,
  onDelete,
  initialData,
}: MedicationFormProps) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDosage(initialData.dosage || "");
      setFrequency(initialData.frequency || "");
      setTime(initialData.time);
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDosage("");
      setFrequency("");
      setTime("");
      setDescription("");
    }
    setErrors({});
  }, [initialData]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!dosage.trim()) errs.dosage = "Dosage is required";
    if (!frequency.trim()) errs.frequency = "Frequency is required";
    if (!time.trim()) errs.time = "Time is required";
    return errs;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const med: Medication = {
      id: initialData?.id || crypto.randomUUID(),
      name,
      dosage,
      frequency,
      time,
      description,
      takenOn: initialData?.takenOn || [],
    };

    onSave(med);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <h2 className="text-xl font-semibold">
          {initialData ? "Edit Medication" : "Add Medication"}
        </h2>

        <Input
          placeholder="Medication name"
          type="text"
          pattern="[0-9a-zA-Z\s]+"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        <Input
          placeholder="Dosage (e.g., 500mg)"
          type="text"
          pattern="[0-9a-zA-Z\s]+"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        {errors.dosage && <p className="text-red-500 text-sm">{errors.dosage}</p>}

        <Input
          placeholder="Frequency (e.g., once a day)"
          type="text"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        />
        {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}

        <Input
          placeholder="Time (e.g., 8:00 AM)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between items-center pt-4">
          {onDelete && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
          <div className="ml-auto space-x-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {initialData ? "Save" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationForm;
