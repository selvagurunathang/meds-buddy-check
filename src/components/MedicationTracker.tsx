import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, Image, Camera, Clock, Plus, Edit, Trash2, Pill, Calendar, CheckCircle, Circle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  description: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface MedicationTaken {
  id?: string;
  medication_id: string;
  user_id: string;
  date: string;
  taken_at: Date;
  image_url?: string;
  created_at?: Date;
}

interface MedicationTrackerProps {
  date: string;
  isTaken: boolean;
  onMarkTaken: (date: string, imageFile?: File) => void;
  isToday: boolean;
}

const MedicationTracker = ({ date, isTaken, onMarkTaken, isToday }: MedicationTrackerProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  const [medicationsTaken, setMedicationsTaken] = useState<MedicationTaken[]>([]);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state for add/edit medication
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Daily",
    time: "8:00 AM",
    description: ""
  });

  // Fetch medications from Supabase (only for current user)
  const fetchMedications = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMedications([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", user.id)
      // .eq("scheduled_for", date) // Uncomment if you add a scheduled_for column
      .order("created_at", { ascending: true });
    if (!error) {
      setMedications(data || []);
      console.log('Fetched medications:', data);
    } else {
      console.error('Error fetching medications:', error);
    }
    setLoading(false);
  };

  // Fetch medications taken from Supabase
  const fetchMedicationsTaken = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMedicationsTaken([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("medications_taken")
        .select("*")
        .eq("user_id", user.id)
        .order("taken_at", { ascending: false });
      
      if (error) {
        if (error.message.includes('relation "medications_taken" does not exist')) {
          console.log('medications_taken table does not exist yet. Please run the setup SQL.');
          setMedicationsTaken([]);
        } else {
          console.error('Error fetching medications taken:', error);
          setMedicationsTaken([]);
        }
      } else if (data) {
        setMedicationsTaken(data);
        console.log('Fetched medications taken:', data);
      }
    } catch (catchError) {
      console.error('Unexpected error fetching medications taken:', catchError);
      setMedicationsTaken([]);
    }
  };

  useEffect(() => {
    fetchMedications();
    fetchMedicationsTaken();
  }, []);

  // Real-time subscription with proper user filtering
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping subscription setup');
        return;
      }

      console.log('Setting up real-time subscription for user:', user.id);
      
      const medicationsChannel = supabase
        .channel(`medications-${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'medications',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time medication update received:', payload);
            // Immediately fetch updated data
            fetchMedications();
          }
        )
        .subscribe((status) => {
          console.log('Medications subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to medication changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Medications subscription channel error');
          }
        });

      const medicationsTakenChannel = supabase
        .channel(`medications-taken-${user.id}`)
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'medications_taken',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Real-time medication taken update received:', payload);
            // Immediately fetch updated data
            fetchMedicationsTaken();
          }
        )
        .subscribe((status) => {
          console.log('Medications taken subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to medication taken changes');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('Medications taken subscription channel error');
          }
        });

      return () => {
        console.log('Cleaning up subscriptions for user:', user.id);
        supabase.removeChannel(medicationsChannel);
        supabase.removeChannel(medicationsTakenChannel);
      };
    };

    const cleanup = setupSubscription();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Debug: Log the current user's ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      console.log('Current user:', user);
    });
  }, []);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check if a specific medication was taken on the current date
  const isMedicationTaken = (medicationId: string, date: string) => {
    return medicationsTaken.some(taken => 
      taken.medication_id === medicationId && taken.date === date
    );
  };

  // Get medications taken for the current date
  const getMedicationsTakenForDate = (date: string) => {
    return medicationsTaken.filter(taken => taken.date === date);
  };

  // Mark a specific medication as taken
  const handleMarkMedicationTaken = async (medicationId: string, imageFile?: File) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to mark medication as taken.', variant: 'destructive' });
      return;
    }

    // Check if already taken today
    if (isMedicationTaken(medicationId, date)) {
      toast({ title: 'Already taken', description: 'This medication has already been marked as taken today.', variant: 'default' });
      return;
    }

    setActionLoading(true);
    
    try {
      // Upload image if provided
      let imageUrl = undefined;
      if (imageFile) {
        try {
          const fileName = `medication-proof/${user.id}/${medicationId}/${Date.now()}-${imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('medication-proofs')
            .upload(fileName, imageFile);
          
          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            toast({ title: 'Warning', description: 'Failed to upload image, but medication was marked as taken.', variant: 'default' });
          } else {
            const { data: urlData } = supabase.storage
              .from('medication-proofs')
              .getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
          }
        } catch (imageError) {
          console.error('Error handling image upload:', imageError);
          // Continue without image if upload fails
        }
      }

      // Save medication taken record to database
      const { data, error } = await supabase
        .from("medications_taken")
        .insert([
          {
            medication_id: medicationId,
            user_id: user.id,
            date: date,
            taken_at: new Date().toISOString(),
            image_url: imageUrl,
          },
        ])
        .select();

      if (error) {
        console.error('Error marking medication as taken:', error);
        
        // Check if it's a table not found error
        if (error.message.includes('relation "medications_taken" does not exist')) {
          toast({ 
            title: 'Database Setup Required', 
            description: 'Please run the medications_taken table setup SQL in your Supabase dashboard first.', 
            variant: 'destructive' 
          });
        } else if (error.message.includes('foreign key')) {
          toast({ 
            title: 'Invalid Medication', 
            description: 'The medication reference is invalid. Please try again.', 
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Error', 
            description: `Failed to mark medication as taken: ${error.message}`, 
            variant: 'destructive' 
          });
        }
        return;
      }

      console.log('Medication marked as taken:', data);
      toast({ title: 'Success', description: 'Medication marked as taken successfully!' });
      
      // Refresh the medications taken list
      await fetchMedicationsTaken();
      
      // Clear image if it was used
      if (imageFile) {
        setSelectedImage(null);
        setImagePreview(null);
      }
    } catch (catchError) {
      console.error('Unexpected error in handleMarkMedicationTaken:', catchError);
      toast({ 
        title: 'Unexpected Error', 
        description: 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Mark all medications as taken
  const handleMarkAllTaken = async () => {
    const activeMedicationIds = activeMedications.map(med => med.id);
    
    for (const medicationId of activeMedicationIds) {
      if (!isMedicationTaken(medicationId, date)) {
        await handleMarkMedicationTaken(medicationId, selectedImage || undefined);
      }
    }

    // Call the parent onMarkTaken function
    onMarkTaken(date, selectedImage || undefined);
    
    // Clear image
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Get taken time for a medication on a specific date
  const getTakenTime = (medicationId: string, date: string) => {
    const takenRecord = medicationsTaken.find(taken => 
      taken.medication_id === medicationId && taken.date === date
    );
    return takenRecord ? format(takenRecord.taken_at, 'h:mm a') : null;
  };

  // CRUD Operations
  const handleAddMedication = async () => {
    setActionLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to add medication.', variant: 'destructive' });
      setActionLoading(false);
      return;
    }
    if (!formData.name || !formData.dosage) {
      toast({ title: 'Error', description: 'Name and dosage are required.', variant: 'destructive' });
      setActionLoading(false);
      return;
    }
    
    const { data, error } = await supabase.from("medications").insert([
      {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time: formData.time,
        description: formData.description || '',
        is_active: true,
        user_id: user.id,
      },
    ]).select();
    
    setActionLoading(false);
    if (error) {
      console.error('Error adding medication:', error);
      toast({ title: 'Failed to add medication', description: error.message, variant: 'destructive' });
      return;
    }
    
    console.log('Medication added successfully:', data);
    toast({ title: 'Medication added', description: 'Medication was added successfully.' });
    setIsAddDialogOpen(false);
    resetForm();
    
    // Force refresh the medications list
    await fetchMedications();
  };

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      description: medication.description
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedication = async () => {
    if (!editingMedication) return;
    setActionLoading(true);
    const { error } = await supabase
      .from("medications")
      .update({
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        time: formData.time,
        description: formData.description || '',
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingMedication.id);
    setActionLoading(false);
    if (error) {
      console.error('Error updating medication:', error);
      toast({ title: 'Failed to update medication', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Medication updated', description: 'Medication was updated successfully.' });
    setIsEditDialogOpen(false);
    resetForm();
    setEditingMedication(null);
    
    // Force refresh the medications list
    await fetchMedications();
  };

  const handleDeleteMedication = async (medicationId: string) => {
    setActionLoading(true);
    const { error } = await supabase.from("medications").delete().eq("id", medicationId);
    setActionLoading(false);
    if (error) {
      console.error('Error deleting medication:', error);
      toast({ title: 'Failed to delete medication', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Medication deleted', description: 'Medication was deleted successfully.' });
    
    // Force refresh the medications list
    await fetchMedications();
  };

  const handleToggleMedicationStatus = async (medicationId: string) => {
    setActionLoading(true);
    const med = medications.find(m => m.id === medicationId);
    if (!med) {
      setActionLoading(false);
      return;
    }
    const { error } = await supabase
      .from("medications")
      .update({ is_active: !med.is_active, updated_at: new Date().toISOString() })
      .eq("id", medicationId);
    setActionLoading(false);
    if (error) {
      console.error('Error toggling medication status:', error);
      toast({ title: 'Failed to update status', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Medication status updated', description: `Medication marked as ${!med.is_active ? 'active' : 'inactive'}.` });
    
    // Force refresh the medications list
    await fetchMedications();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dosage: "",
      frequency: "Daily",
      time: "8:00 AM",
      description: ""
    });
  };

  const activeMedications = medications.filter(med => med.is_active);
  const medicationsTakenToday = getMedicationsTakenForDate(date);
  const allMedicationsTaken = activeMedications.length > 0 && 
    activeMedications.every(med => isMedicationTaken(med.id, date));

  if (allMedicationsTaken) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              All Medications Taken!
            </h3>
            <p className="text-green-600">
              Great job! You've taken all {activeMedications.length} medications for {format(new Date(date), 'MMMM d, yyyy')}.
            </p>
          </div>
        </div>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              {activeMedications.map((medication) => {
                const takenTime = getTakenTime(medication.id, date);
                return (
                  <div key={medication.id} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
            <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                        <h4 className="font-medium text-green-800">{medication.name}</h4>
                        <p className="text-sm text-green-600">{medication.dosage}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="w-3 h-3 mr-1" />
                      {takenTime}
            </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medication Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Today's Medications</h3>
          <p className="text-sm text-muted-foreground">
            {medicationsTakenToday.length} of {activeMedications.length} taken
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter medication name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 1 tablet, 10mg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                    <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="As Needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional notes about the medication"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedication} disabled={!formData.name || !formData.dosage || actionLoading}>
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading medications...</p>
            </CardContent>
          </Card>
        ) : activeMedications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Pill className="w-12 h-12 text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">No Medications Added</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first medication to start tracking
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>
        ) : (
          activeMedications.map((medication) => {
            const isTaken = isMedicationTaken(medication.id, date);
            const takenTime = getTakenTime(medication.id, date);
            
            return (
              <Card key={medication.id} className={`hover:shadow-md transition-shadow ${isTaken ? 'border-green-200 bg-green-50/50' : ''}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isTaken ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {isTaken ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Pill className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${isTaken ? 'text-green-800' : ''}`}>
                        {medication.name}
                      </h4>
                      <p className={`text-sm ${isTaken ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {medication.dosage} • {medication.frequency}
                      </p>
            </div>
          </div>
                  <div className="flex items-center gap-2">
                    {isTaken ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {takenTime}
                      </Badge>
                    ) : (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
                        {medication.time}
          </Badge>
                    )}
                    <div className="flex items-center gap-1">
                      {!isTaken && isToday && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkMedicationTaken(medication.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          disabled={actionLoading}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMedication(medication)}
                        disabled={actionLoading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actionLoading}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{medication.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteMedication(medication.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={actionLoading}
                            >
                              {actionLoading ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
        </CardContent>
      </Card>
            );
          })
        )}
      </div>

      {/* Edit Medication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Medication Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter medication name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dosage">Dosage</Label>
              <Input
                id="edit-dosage"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="e.g., 1 tablet, 10mg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-frequency">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                  <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="As Needed">As Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional notes about the medication"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMedication} disabled={!formData.name || !formData.dosage || actionLoading}>
              Update Medication
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Upload Section */}
      <Card className="border-dashed border-2 border-border/50">
        <CardContent className="p-6">
          <div className="text-center">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Add Proof Photo (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a photo of your medication or pill organizer as confirmation
            </p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
            >
              <Camera className="w-4 h-4 mr-2" />
              {selectedImage ? "Change Photo" : "Take Photo"}
            </Button>
            
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Medication proof"
                  className="max-w-full h-32 object-cover rounded-lg mx-auto border-2 border-border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Photo selected: {selectedImage?.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mark All as Taken Button */}
      <Button
        onClick={handleMarkAllTaken}
        className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
        disabled={!isToday || activeMedications.length === 0 || allMedicationsTaken || actionLoading}
      >
        <Check className="w-5 h-5 mr-2" />
        {actionLoading ? "Marking as Taken..." : (isToday ? "Mark All as Taken" : "Cannot mark future dates")}
      </Button>

      {!isToday && (
        <p className="text-center text-sm text-muted-foreground">
          You can only mark today's medication as taken
        </p>
      )}

      {isToday && activeMedications.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Add medications to track them
        </p>
      )}

      {isToday && allMedicationsTaken && (
        <p className="text-center text-sm text-green-600 font-medium">
          All medications have been taken today! 🎉
        </p>
      )}
    </div>
  );
};

export default MedicationTracker;
