import React, { useState } from 'react'
import { Activity, Bell, ChevronDown, ChevronUp, ClipboardList, Plus, User } from 'lucide-react'
import DashboardStats from '@/components/dashboard/DashboardStats'
import { MedicationCard } from '@/components/dashboard/MedicationCard'
import AddMedicationModal from '@/components/dashboard/AddMedicationModal'
import { Button } from '@/components/ui/button'
import { useMedication } from '@/contexts/MedicationContext'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar } from '@/components/dashboard/Calendar'
import { format, isToday, isSameDay, startOfDay, addDays } from 'date-fns'

export const Dashboard: React.FC = () => {
  const { medications, medicationLogs, getMedicationLogsForDate } = useMedication()
  const { currentRole } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState(null)
  const [activeTab, setActiveTab] = useState('monitoring');
  const [expandedReport, setExpandedReport] = useState<number | null>(null);


  const getCalendarData = () => {
    const today = startOfDay(new Date())
    const daysInView = 35
    const calendarDays = Array.from({ length: daysInView }, (_, i) => addDays(today, i - today.getDay() - 7))

    return calendarDays.map(day => {
      const logs = getMedicationLogsForDate(day)
      const medicationsForDay = medications.filter(med =>
        new Date(med.createdAt) <= day
      )

      const takenCount = logs.length
      const missedCount = medicationsForDay.length - takenCount

      return {
        date: day,
        isToday: isToday(day),
        takenCount,
        missedCount,
        medications: medicationsForDay.map(med => ({
          ...med,
          status: logs.some(log => log.medicationId === med.id) ? 'taken' : 'missed'
        }))
      }
    })
  }
  const complianceReports = [
    {
      id: 1,
      name: 'Weekly Compliance Report',
      date: '2023-11-01',
      complianceRate: '85%',
      details: {
        medications: medications.map(med => ({
          name: med.name,
          taken: medicationLogs.filter(log =>
            log.medicationId === med.id &&
            new Date(log.takenAt) >= new Date('2023-10-25') &&
            new Date(log.takenAt) <= new Date('2023-11-01')
          ).length,
          scheduled: med.frequency === 'once' ? 7 : 14
        }))
      }
    },
    {
      id: 2,
      name: 'Medication Adherence',
      date: '2023-10-25',
      complianceRate: '78%',
      details: {
        medications: medications.map(med => ({
          name: med.name,
          taken: medicationLogs.filter(log =>
            log.medicationId === med.id &&
            new Date(log.takenAt) >= new Date('2023-10-18') &&
            new Date(log.takenAt) <= new Date('2023-10-25')
          ).length,
          scheduled: med.frequency === 'once' ? 7 : 14
        }))
      }
    },
  ];
  const calendarData = getCalendarData()
  const alertSettings = {
    email: 'caretaker@example.com',
    notificationsEnabled: true,
    alertThreshold: 'missed_dose'
  };
  return (
    <div className="space-y-6">
      <DashboardStats />
      {/* <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {currentRole === 'patient' &&
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentRole === 'patient' ? 'My Medications' : 'Patient Medications'}
                </h2>
                <p className="text-sm text-gray-500">
                  {medications.length} medication{medications.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <Button className='text-gray-800 border-red-900' onClick={() => setShowAddModal(true)}>
                <Plus size={16} className="mr-2" />
                Add Medication
              </Button>
            </div>

            {medications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first medication to track.
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Your First Medication
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medications.map((medication) => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onEdit={(med: any) => setSelectedMedication(med)}
                  />
                ))}
              </div>
            )}
          </div>
        }

      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Medication History
        </h2>
        <Calendar data={calendarData} />

        <div className="mt-6 space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Medication taken
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Missed medication</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Today</span>
          </div>
        </div>
      </div> */}
      <AddMedicationModal
        isOpen={showAddModal || selectedMedication !== null}
        onClose={() => {
          setShowAddModal(false)
          setSelectedMedication(null)
        }}
        defaultValues={selectedMedication || undefined}
        isEdit={!!selectedMedication}
      />
      {currentRole === 'caretaker' ? (
        <div className="space-y-6">
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'monitoring' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
              <div className="flex items-center gap-2">
                <Activity size={16} />
                Monitoring
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'reports' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
              <div className="flex items-center gap-2">
                <ClipboardList size={16} />
                Reports
              </div>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'alerts' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            >
              <div className="flex items-center gap-2">
                <Bell size={16} />
                Alerts
              </div>
            </button>
          </div>

          {activeTab === 'monitoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Patient Medications</h2>
                    <p className="text-sm text-gray-500">
                      {medications.length} medication{medications.length !== 1 ? 's' : ''} total
                    </p>
                  </div>
                </div>

                {medications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No medications assigned</h3>
                    <p className="text-gray-500">The patient hasn't added any medications yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {medications.map((medication) => (
                      <MedicationCard
                        key={medication.id}
                        medication={medication}
                        onEdit={(med: any) => setSelectedMedication(med)}
                      // isCaretakerView={true}
                      />
                    ))}
                  </div>
                )}
              </div> */}

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Adherence History</h2>
                <Calendar data={calendarData} />
                <div className="mt-6 space-y-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Medication taken</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Missed medication</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' &&
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Compliance Reports</h2>
              {complianceReports.length > 0 ? (
                <div className="space-y-4">
                  {complianceReports.map(report => (
                    <div key={report.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4 hover:bg-gray-50 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-gray-500">Generated on {report.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-semibold text-blue-600">{report.complianceRate}</p>
                            <p className="text-xs text-gray-500">Adherence Rate</p>
                          </div>
                          <button
                            onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedReport === report.id ? <ChevronUp /> : <ChevronDown />}
                          </button>
                        </div>
                      </div>
                      {expandedReport === report.id && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <h4 className="font-medium mb-2">Detailed Breakdown</h4>
                          <div className="space-y-3">
                            {report.details.medications.map((med, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span>{med.name}</span>
                                <span className="font-medium">
                                  {med.taken}/{med.scheduled} doses ({Math.round((med.taken / med.scheduled) * 100)}%)
                                </span>
                              </div>
                            ))}
                            {/* <div>

</div> */}
                          </div>
                          {/* <Button variant="outline" size="sm" className="mt-4 w-full">
                            Download Full Report
                          </Button> */}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports available</h3>
                  <p className="text-gray-500">Compliance reports will be generated weekly.</p>
                </div>
              )}
            </div>
          }

          {activeTab === 'alerts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Alert Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">{alertSettings.email}</p>
                  </div>
                  {/* <Button variant="outline" size="sm">Change Email</Button> */}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Notification Alerts</h3>
                    <p className="text-sm text-gray-500">
                      {alertSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  {/* <Button
                    // variant={alertSettings.notificationsEnabled ? 'destructive' : 'outline'} 
                    size="sm"
                  >
                    {alertSettings.notificationsEnabled ? 'Disable' : 'Enable'}
                  </Button> */}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Alert Threshold</h3>
                    <p className="text-sm text-gray-500">
                      {alertSettings.alertThreshold === 'missed_dose' ? 'Notify on missed dose' : 'Custom settings'}
                    </p>
                  </div>
                  {/* <Button variant="outline" size="sm">Configure</Button> */}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My Medications</h2>
                <p className="text-sm text-gray-500">
                  {medications.length} medication{medications.length !== 1 ? 's' : ''} total
                </p>
              </div>
              <Button
                className={`px-4 py-3 flex items-cente justify-betwee rounded-lg border bg-purple-50 text-black text-sm font-medium hover:text-gray-900 border-purple-300`}
                // className="text-red-700 bg-transparent border border-red-700 hover:bg-red-50 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={16} className="mr-2" />
                Add Medication
              </Button>
            </div>

            {medications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medications yet</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first medication to track.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Your First Medication
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {medications.map((medication) => (
                  <MedicationCard
                    key={medication.id}
                    medication={medication}
                    onEdit={(med: any) => setSelectedMedication(med)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Medication History</h2>
            <Calendar data={calendarData} />
            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Medication taken</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Missed medication</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}