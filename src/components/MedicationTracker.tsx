import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Image, Camera, Clock } from "lucide-react";
import { format } from "date-fns";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  status_for_today: "taken" | "pending" | "missed";
}

interface MedicationTrackerProps {
  date: string;
  medications: Medication[];
  onMarkTaken: (medicationId: string, date: string, imageFile?: File) => void;
  isToday: boolean;
}

const MedicationTracker = ({
  date,
  medications,
  onMarkTaken,
  isToday
}: MedicationTrackerProps) => {
  const [imageMap, setImageMap] = useState<{ [medId: string]: File | null }>({});
  const [previewMap, setPreviewMap] = useState<{ [medId: string]: string | null }>({});
  const fileInputRefs = useRef<{ [medId: string]: HTMLInputElement | null }>({});

  const handleImageSelect = (medId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageMap(prev => ({ ...prev, [medId]: file }));
      setPreviewMap(prev => ({ ...prev, [medId]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleMark = (medId: string) => {
    const imageFile = imageMap[medId] || undefined;
    onMarkTaken(medId, date, imageFile);
  };

  const allTaken = medications.length > 0 && medications.every(med => med.status_for_today === "taken");

  return (
    <div className="space-y-6">
      {medications.length === 0 ? (
        <p>No medications scheduled for today.</p>
      ) : allTaken ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Medication Completed!
              </h3>
              <p className="text-green-600">
              Great job! You've taken your medication for {format(new Date(date), 'MMMM d, yyyy')}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        medications.map((med) => {
          const isTaken = med.status_for_today === "taken";
          const isMissed = med.status_for_today === "missed";
          const isPending = med.status_for_today === "pending";
          const imagePreview = previewMap[med.id];

          return (
            <Card key={med.id} className="border shadow-sm">
              <CardContent className="p-4 space-y-3">
                {/* Medication Info */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-lg">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">{med.dosage}</p>
                    <p className="text-sm text-muted-foreground">{med.schedule}</p>
                  </div>
                  {isTaken ? (
                    <Badge className="bg-green-100 text-green-700">Taken</Badge>
                  ) : isMissed ? (
                    <Badge className="bg-red-100 text-red-700">Missed</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-700">
                      Pending
                    </Badge>
                  )}
                </div>

                {!isTaken && isPending && (
                  <div className="text-center mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => (fileInputRefs.current[med.id] = el)}
                      onChange={(e) => handleImageSelect(med.id, e)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[med.id]?.click()}
                      className="mb-2"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {imageMap[med.id] ? "Change Photo" : "Add Photo"}
                    </Button>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Medication proof"
                          className="h-24 object-cover rounded-md border mx-auto"
                        />
                        <p className="text-xs mt-1 text-muted-foreground">
                          {imageMap[med.id]?.name}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!isTaken && isPending && (
                  <Button
                    onClick={() => handleMark(med.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!isToday}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isToday ? "Mark as Taken" : "Cannot mark future date"}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default MedicationTracker;
