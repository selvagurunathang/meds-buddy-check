
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import { format, isToday, isBefore, startOfDay, startOfMonth, endOfMonth } from "date-fns";
import { useEffect } from "react";
import {
  getCurrentUser,
  getMedicationsWithLogs,
  getMedicationIds,
  getMedicationLogsInRange,
  markMedicationTaken
} from "@/lib/supabaseService";

interface MedicationDisplay {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  status_for_today: "taken" | "missed" | "pending";
}

const PatientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [takenDates, setTakenDates] = useState<Set<string>>(new Set());
  const [medications, setMedications] = useState<MedicationDisplay[]>([]);
  const [medicationStatusMap, setMedicationStatusMap] = useState<Record<string, "taken" | "missed">>({});
  const [user, setUser] = useState(null);
  const [updateCalender, setUpdateCalender] = useState<boolean>(false);

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const isTodaySelected = isToday(selectedDate);

  const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date(today);
    
    while (takenDates.has(format(currentDate, 'yyyy-MM-dd')) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getDayClassName = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isPast = isBefore(date, startOfDay(today));
    const isCurrentDay = isToday(date);
    const isTaken = takenDates.has(dateStr);
    
    let className = "";
    
    if (isCurrentDay) {
      className += " bg-blue-100 border-blue-300 ";
    }
    
    if (isTaken) {
      className += " bg-green-100 text-green-800 ";
    } else if (isPast) {
      className += " bg-red-50 text-red-600 ";
    }
    
    return className;
  };

  useEffect(() => {
    const fetchMedications = async () => {
      if (!user) return;

      try {
        const meds = await getMedicationsWithLogs(user.id);
        const today = format(new Date(), 'yyyy-MM-dd');

        const result = meds.map((med) => {
          const todayLog = med.medication_logs.find((log) => log.date === today);
          return {
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            schedule: med.schedule,
            status_for_today: todayLog?.status ?? "pending"
          };
        });

        setMedications(result);
      } catch (err) {
        console.error("Error fetching medications:", err);
      }
    };

    fetchMedications();
  }, [user]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;

      try {
        const start = format(startOfMonth(today), 'yyyy-MM-dd');
        const end = format(endOfMonth(today), 'yyyy-MM-dd');
        const medIds = await getMedicationIds(user.id);
        const logs = await getMedicationLogsInRange(user.id, start, end);

        const groupedLogs: Record<string, { taken: number, total: number }> = {};

        for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, 'yyyy-MM-dd');
          groupedLogs[dateStr] = { taken: 0, total: medIds.length };
        }

        logs.forEach(log => {
          if (log.status === "taken") {
            groupedLogs[log.date].taken += 1;
          }
        });

        const statusMap: Record<string, "taken" | "missed"> = {};
        const takenSet = new Set<string>();

        for (const [date, { taken, total }] of Object.entries(groupedLogs)) {
          if (taken === total) {
            statusMap[date] = "taken";
            takenSet.add(date);
          } else {
            statusMap[date] = "missed";
          }
        }

        setMedicationStatusMap(statusMap);
        setTakenDates(takenSet);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, [user, updateCalender]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (err) {
        console.error("Error getting user:", err);
      }
    };
    fetchUser();
  }, []);

  const fetchMedicationsForDate = async (dateStr: string) => {
    if (!user) return;

    try {
      const meds = await getMedicationsWithLogs(user.id);
      const isPast = new Date(dateStr) < startOfDay(new Date());
      const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;

      const result = meds.map((med) => {
        const log = med.medication_logs.find((l) => l.date === dateStr);
        const status = log?.status ?? (isPast && !isToday ? "missed" : "pending");
        return {
          id: med.id,
          name: med.name,
          dosage: med.dosage,
          schedule: med.schedule,
          status_for_today: status
        };
      });

      setMedications(result);
    } catch (err) {
      console.error("Error fetching for date:", err);
    }
  };

  const handleMarkMedicationTaken = async (
    medicationId: string,
    date: string,
    imageFile?: File
  ) => {
    if (!user) return;

    try {
      await markMedicationTaken({
        userId: user.id,
        medicationId,
        date
      });

      setMedications((prev) =>
        prev.map((med) =>
          med.id === medicationId ? { ...med, status_for_today: "taken" } : med
        )
      );
      setUpdateCalender(prev => !prev);
      console.log("Marked taken:", medicationId, imageFile?.name);
    } catch (err) {
      console.error("Error marking taken:", err);
    }
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
            <h2 className="text-3xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</h2>
            <p className="text-white/90 text-lg">Ready to stay on track with your medication?</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{takenDates.has(todayStr) ? "✓" : "○"}</div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{Math.round((takenDates.size / 30) * 100)}%</div>
            <div className="text-white/80">Monthly Rate</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Medication */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {isTodaySelected ? "Today's Medication" : `Medication for ${format(selectedDate, 'MMMM d, yyyy')}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MedicationTracker
                date={selectedDateStr}
                medications={medications}
                onMarkTaken={handleMarkMedicationTaken}
                isToday={isTodaySelected}
              />
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
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(date);
                  fetchMedicationsForDate(format(date, 'yyyy-MM-dd'));
                }}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const status = medicationStatusMap[dateStr];
                    const isCurrentDay = isToday(date);

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {status === "taken" && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {status !== "taken" && isBefore(date, startOfDay(today)) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full" />
                        )}
                      </div>
                    );
                  }
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
    </div>
  );
};

export default PatientDashboard;
