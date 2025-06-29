import { supabase } from './supabaseClient';

// --- Auth ---

export async function signInWithEmail(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
}

export async function checkSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
}

export function onAuthStateChange(callback: (session) => void) {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session);
    });
    return authListener.subscription;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function resetPassword(email: string, redirectTo: string) {
    return await supabase.auth.resetPasswordForEmail(email, { redirectTo });
}

export async function updateUserPassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("User not found");
    return user;
}

// --- Medications ---

export async function addMedication({
    name,
    dosage,
    schedule,
    userId,
}: {
    name: string;
    dosage: string;
    schedule: string;
    userId: string;
}) {
    const { error } = await supabase.from('medications').insert([
        { name, dosage, schedule, user_id: userId },
    ]);
    if (error) throw new Error("Failed to add medication. Try again.");
}

export async function getAllMedications() {
    const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getMedications(userId: string) {
    const { data, error } = await supabase
        .from('medications')
        .select('id')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

export async function getMedicationsWithLogs(userId: string) {
    const { data, error } = await supabase
        .from('medications')
        .select(`
      id,
      name,
      dosage,
      schedule,
      medication_logs (
        status,
        date
      )
    `)
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

export async function updateMedication(id: string, values: {
    name: string;
    dosage: string;
    schedule: string;
}) {
    const { error } = await supabase
        .from('medications')
        .update({
            name: values.name.trim(),
            dosage: `${values.dosage} mg`,
            schedule: values.schedule,
        })
        .eq('id', id);

    if (error) throw error;
}

export async function deleteMedication(id: string) {
    const { error } = await supabase.from('medications').delete().eq('id', id);
    if (error) throw error;
}

export async function getMedicationIds(userId: string) {
    const { data, error } = await supabase
        .from("medications")
        .select("id")
        .eq("user_id", userId);

    if (error) throw error;
    return data.map((m) => m.id);
}

// --- Logs ---

export async function getMedicationLogs(userId: string) {
    const { data, error } = await supabase
        .from("medication_logs")
        .select("date, medication_id, status")
        .eq("user_id", userId);

    if (error) throw error;
    return data;
}

export async function getMedicationLogsInRange(userId: string, start: string, end: string) {
    const { data, error } = await supabase
        .from("medication_logs")
        .select("date, medication_id, status")
        .eq("user_id", userId)
        .gte("date", start)
        .lte("date", end);

    if (error) throw error;
    return data;
}

export async function markMedicationTaken({
    userId,
    medicationId,
    date,
}: {
    userId: string;
    medicationId: string;
    date: string;
}) {
    const { error } = await supabase.from("medication_logs").upsert({
        medication_id: medicationId,
        user_id: userId,
        date,
        status: "taken",
    });

    if (error) throw error;
}
