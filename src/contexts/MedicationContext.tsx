import React, { createContext, useContext, useState, useMemo } from "react";
import { format, subDays, isBefore, isToday, startOfDay } from "date-fns";

type MedicationRecord = {
  date: string; // Format: yyyy-MM-dd
  taken: boolean;
  time?: string;
};

type MedicationContextType = {
  records: MedicationRecord[];
  addRecord: (record: MedicationRecord) => void;
  adherenceRate: number;
  currentStreak: number;
  missedCount: number;
  hasTakenToday: boolean;
};

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<MedicationRecord[]>([
    { date: "2024-06-10", taken: true },
    { date: "2024-06-09", taken: true },
    { date: "2024-06-08", taken: false },
    { date: "2024-06-07", taken: true },
    { date: "2024-06-06", taken: true },
    { date: "2024-06-05", taken: true },
    { date: "2024-06-04", taken: true },
    { date: "2024-06-02", taken: true },
    { date: "2024-06-01", taken: true },
  ]);

  const addRecord = (record: MedicationRecord) => {
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== record.date);
      return [...filtered, record].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const past30Days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) =>
      format(subDays(new Date(), i), "yyyy-MM-dd")
    );
  }, []);

  const adherenceRate = useMemo(() => {
    const takenCount = past30Days.filter((date) =>
      records.find((r) => r.date === date && r.taken)
    ).length;
    return Math.round((takenCount / 30) * 100);
  }, [records, past30Days]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const rec = records.find((r) => r.date === dateStr);
      if (rec?.taken) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [records]);

  const missedCount = useMemo(() => {
    return records.filter(
      (r) =>
        !r.taken && isBefore(startOfDay(new Date(r.date)), startOfDay(new Date()))
    ).length;
  }, [records]);

  const hasTakenToday = useMemo(() => {
    return records.some((r) => r.date === todayStr && r.taken);
  }, [records, todayStr]);

  return (
    <MedicationContext.Provider
      value={{
        records,
        addRecord,
        adherenceRate,
        currentStreak,
        missedCount,
        hasTakenToday,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error("useMedication must be used within a MedicationProvider");
  }
  return context;
};
