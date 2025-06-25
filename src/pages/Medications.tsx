// src/pages/Medications.tsx
import { useState } from 'react';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import {
    getMedications,
    addMedication,
    updateMedication,
    deleteMedication,
    markAsTaken,
} from '@/services/medicationService';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { useForm } from 'react-hook-form';

type FormValues = {
    name: string;
    dosage: string;
    frequency: string;
};

const Medications = ({ userId }: { userId: string }) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormValues>();

    const { data: medications = [], isLoading } = useQuery({
        queryKey: ['medications', userId],
        queryFn: () => getMedications(userId),
        refetchOnWindowFocus: true,
        refetchOnMount: true,

    });
    console.log("userId:", userId);


    const addMutation = useMutation({
        mutationFn: addMedication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications', userId] });
            closeDialog();
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateMedication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medications', userId] });
            closeDialog();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteMedication,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications', userId] }),
    });

    const markTakenMutation = useMutation({
        mutationFn: markAsTaken,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['medications', userId] }),
    });

    const openDialog = (med?: FormValues & { id?: number }) => {
        if (med) {
            setValue('name', med.name);
            setValue('dosage', med.dosage);
            setValue('frequency', med.frequency);
            setEditingId(med.id || null);
        } else {
            reset();
            setEditingId(null);
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        reset();
        setEditingId(null);

    };

    const onSubmit = (formData: FormValues) => {
        if (editingId) {
            updateMutation.mutate({ ...formData, id: editingId });
        } else {
            addMutation.mutate({ ...formData, user_id: userId });

        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Medications</h1>
                <button
                    onClick={() => openDialog()}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add New
                </button>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-4">
                    {medications.map((med: any) => (
                        <li key={med.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{med.name}</p>
                                <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                            </div>
                            <div className="flex gap-3">
                                {!med.taken_today && (
                                    <button
                                        onClick={() => markTakenMutation.mutate(med.id)}
                                        className="text-green-600 hover:underline"
                                    >
                                        Mark Taken
                                    </button>
                                )}
                                <button
                                    onClick={() => openDialog({ ...med })}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(med.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Dialog
                open={isOpen}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        background: '#f9fafb'
                    }
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 600,
                            color: 'primary.main',
                            borderBottom: '1px solid #e5e7eb',
                            py: 2,
                            backgroundColor: 'white'
                        }}
                    >
                        {editingId ? 'Edit Medication' : 'Add Medication'}
                    </DialogTitle>

                    <DialogContent dividers sx={{ py: 3, backgroundColor: 'white' }}>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                size="small"
                                label="Medication Name"
                                fullWidth
                                margin="dense"
                                {...register('name', { required: 'Medication name is required' })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                            borderWidth: '1px'
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        color: 'text.secondary'
                                    }
                                }}
                                inputProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        py: 1
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                size="small"
                                label="Dosage"
                                fullWidth
                                margin="dense"
                                {...register('dosage', { required: 'Dosage is required' })}
                                error={!!errors.dosage}
                                helperText={errors.dosage?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                            borderWidth: '1px'
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        color: 'text.secondary'
                                    }
                                }}
                                inputProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        py: 1
                                    }
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 1 }}>
                            <TextField
                                size="small"
                                label="Frequency"
                                fullWidth
                                margin="dense"
                                {...register('frequency', { required: 'Frequency is required' })}
                                error={!!errors.frequency}
                                helperText={errors.frequency?.message}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '& fieldset': {
                                            borderColor: '#e5e7eb',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                            borderWidth: '1px'
                                        },
                                    },
                                }}
                                InputLabelProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        color: 'text.secondary'
                                    }
                                }}
                                inputProps={{
                                    sx: {
                                        fontSize: '0.875rem',
                                        py: 1
                                    }
                                }}
                            />
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, py: 2, backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
                        <Button
                            onClick={closeDialog}
                            variant="outlined"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                borderColor: '#e5e7eb',
                                color: 'text.secondary',
                                '&:hover': {
                                    borderColor: '#d1d5db',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                py: 1,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none',
                                    backgroundColor: 'primary.dark'
                                }
                            }}
                        >
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default Medications;
