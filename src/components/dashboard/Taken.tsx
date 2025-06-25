import React from 'react';
import { Clock, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMedication } from '@/contexts/MedicationContext';

function Taken() {
    const { medicationLogs, handleRemove } = useMedication();
    return (
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="text-blue-500" size={20} />
                    Taken Today List
                </h3>
            </div>

            {/* Content */}
            {medicationLogs.length === 0 ? (
                <div className="text-center py-8 rounded-lg bg-gray-50">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-500 font-medium">No medications taken today</p>
                    <p className="text-sm text-gray-400 mt-1">Your taken medications will appear here</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {medicationLogs.map((log: any, index: number) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all bg-white"
                        >

                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <div
                                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                        style={{ backgroundColor: log.medication?.color || '#3B82F6' }}
                                    />
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {log?.name || log?.photoUrl?.name || 'Medication'}
                                        </h4>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {log?.dosage || log?.
                                                photoUrl?.dosage}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {new Date(log.takenAt).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </span>
                            </div>


                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Date Taken</p>
                                        <p className="text-sm text-gray-700">
                                            {new Date(log.takenAt).toLocaleDateString([], {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {log.photoUrl && (
                                        <div className="flex items-center space-x-2">
                                            <Camera className="text-gray-400" size={16} />
                                            <span className="text-sm text-gray-500">Photo attached</span>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => handleRemove(log?.id)}
                                >
                                    Remove
                                </Button>
                            </div>


                            {log.notes && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                                    <p className="font-medium">Notes:</p>
                                    <p className="mt-1">{log.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
};

export default Taken;