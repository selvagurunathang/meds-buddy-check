import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import MedicationForm from "@/components/MedicationForm";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";
import { Medication } from "@/types/medication";


const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const {
    items: medications,
    addItem,
    updateItem,
    removeItem,
  } = useLocalStorageList<Medication>("medications", []);

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isTodaySelected = isToday(selectedDate);

  const takenDates = new Set(
    medications.flatMap((m) => m.takenOn)
  );

  const isSelectedDateTaken = medications.every((m) =>
    m.takenOn.includes(selectedDateStr)
  );

  const handleMarkTaken = (date: string, imageFile?: File, medicationId?: string) => {
  if (!medicationId) return;

  const med = medications.find((m) => m.id === medicationId);
  if (!med) return;

  if (!med.takenOn.includes(date)) {
    updateItem(med.id, {
      ...med,
      takenOn: [...med.takenOn, date],
    });
  }

  if (imageFile) {
    console.log("Proof image uploaded:", imageFile.name);
  }
};


  const getStreakCount = () => {
    let streak = 0;
    const currentDate = new Date(today);

    while (takenDates.has(format(currentDate, "yyyy-MM-dd")) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getAdherenceRate = () => {
  const totalDays = 30;
  const trackedDates = Array.from({ length: totalDays }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return format(d, "yyyy-MM-dd");
  });

  const totalExpected = medications.length * totalDays;
  const totalTaken = medications.reduce((acc, med) => {
    const takenInRange = med.takenOn.filter((date) => trackedDates.includes(date));
    return acc + takenInRange.length;
  }, 0);

  if (totalExpected === 0) return 0;
  return Math.round((totalTaken / totalExpected) * 100);
};


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Good{" "}
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                ? "Afternoon"
                : "Evening"}
              !
            </h2>
            <p className="text-white/90 text-lg">
              Ready to stay on track with your medication?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {takenDates.has(todayStr) ? "✓" : "○"}
            </div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">
              {getAdherenceRate()}%
            </div>
            <div className="text-white/80">Monthly Adherence</div>

          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {isTodaySelected
                  ? "Today's Medication"
                  : `Medication for ${format(selectedDate, "MMMM d, yyyy")}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationTracker
                date={selectedDateStr}
                isTaken={isSelectedDateTaken}
                onMarkTaken={handleMarkTaken}
                isToday={isTodaySelected}
                medications={medications}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex justify-between">
                Your Medications
                <Button size="sm" onClick={() => {
                  setEditingMed(null);
                  setFormOpen(true);
                }}>
                  + Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="border rounded p-2 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.time}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingMed(med);
                      setFormOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              ))}
              {medications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No medications added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(today));
                    const isCurrentDay = isToday(date);

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full" />
                        )}
                      </div>
                    );
                  },
                }}
              />

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Medication taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Missed medication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Medication Form Dialog */}
      <MedicationForm
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        initialData={editingMed || undefined}
        onSave={(med) => {
          if (editingMed) {
            updateItem(med.id, med);
          } else {
            addItem(med);
          }
          setFormOpen(false);
        }}
        onDelete={
          editingMed
            ? () => {
                removeItem(editingMed.id);
                setFormOpen(false);
              }
            : undefined
        }
      />
    </div>
  );
};

export default PatientDashboard;
