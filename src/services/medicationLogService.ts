// src/services/medicationLogService.ts
import { supabase } from "@/lib/supabase";

export async function markMedicationTaken(userId: string, medicationId: number) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("medication_logs")
    .insert([{ user_id: userId, medication_id: medicationId, date_taken: today }]);

  if (error) throw error;
  return data;
}

export async function getTakenMedications(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("medication_logs")
    .select("medication_id")
    .eq("user_id", userId)
    .eq("date_taken", today);

  if (error) throw error;
  return data?.map((entry) => entry.medication_id);
}