// src/services/medicationService.ts
import { supabase } from "@/lib/supabase";

export const getMedications = async (userId: string) => {
    const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', userId);
    return data
};
export const addMedication = async (medication: any) => {
    const { error } = await supabase.from("medications").insert([medication]);
    if (error) throw new Error(error.message);
};

export const updateMedication = async ({ id, ...rest }: any) => {
    const { error } = await supabase.from("medications").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
};

export const deleteMedication = async (id: number) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw new Error(error.message);
};
export const markAsTaken = async (id: number) => {
    const { error } = await supabase
        .from('medications')
        .update({ taken_today: true })
        .eq('id', id);
    if (error) throw error;
};
