import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Image, Camera, Clock } from "lucide-react";
import { format } from "date-fns";
import { Medication } from "@/types/medication";

interface MedicationTrackerProps {
  date: string;
  isToday: boolean;
  onMarkTaken: (date: string, imageFile?: File, medicationId?: string) => void;
  medications: Medication[];
  isTaken: boolean;
}

const MedicationTracker = ({
  date,
  isToday,
  onMarkTaken,
  medications,
  isTaken,
}: MedicationTrackerProps) => {
  const [imageStates, setImageStates] = useState<Record<string, { file: File; preview: string }>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>, medId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageStates((prev) => ({
          ...prev,
          [medId]: {
            file,
            preview: e.target?.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkTaken = (medId: string) => {
    const image = imageStates[medId]?.file;
    onMarkTaken(date, image, medId);

    setImageStates((prev) => {
      const updated = { ...prev };
      delete updated[medId];
      return updated;
    });
  };

  if (medications.length === 0) {
    return <p className="text-muted-foreground">No medications scheduled.</p>;
  }

  return (
    <div className="space-y-6">
      {medications.map((med) => {
        const alreadyTaken = med.takenOn.includes(date);
        const imageData = imageStates[med.id];

        return (
          <div key={med.id} className="space-y-4">
            <Card
              className={`hover:shadow transition ${alreadyTaken ? "bg-green-50 border-green-300" : ""}`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">💊</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{med.name}</h4>
                    <p className="text-sm text-muted-foreground">{med.description}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {med.time}
                </Badge>
              </CardContent>
            </Card>

            {alreadyTaken ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                Taken for {format(new Date(date), "PPP")}
              </div>
            ) : isToday && (
              <div className="space-y-4">
                <Card className="border-dashed border-2">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Add Proof Photo (Optional)</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Take a photo of your medication or pill organizer
                      </p>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, med.id)}
                        ref={(el) => (fileInputRefs.current[med.id] = el)}
                        className="hidden"
                      />

                      <Button
                        variant="outline"
                        onClick={() => fileInputRefs.current[med.id]?.click()}
                        className="mb-4"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {imageData ? "Change Photo" : "Take Photo"}
                      </Button>

                      {imageData && (
                        <div className="mt-4">
                          <img
                            src={imageData.preview}
                            alt="Proof"
                            className="max-w-full h-32 object-cover rounded-lg mx-auto border"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Photo selected: {imageData.file.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => handleMarkTaken(med.id)}
                  className="w-full py-3 text-white bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Taken
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MedicationTracker;
