import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Users,
  Bell,
  Calendar as CalendarIcon,
  Mail,
  AlertTriangle,
  Check,
  Clock,
} from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import { format, subDays, isToday, isBefore, startOfDay } from "date-fns";
import { useMedication } from "@/contexts/MedicationContext";

const CaretakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    records,
    adherenceRate,
    currentStreak,
    missedCount,
    hasTakenToday,
    addRecord,
  } = useMedication();

  const takenDates = new Set(records.filter((r) => r.taken).map((r) => r.date));

  const recentActivity = useMemo(() => {
    return [...records]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  }, [records]);

  const handleSendReminderEmail = () => {
    alert("Reminder sent.");
  };

  const handleMarkAsTaken = () => {
    const now = new Date();
    const dateStr = format(now, "yyyy-MM-dd");
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    addRecord({ date: dateStr, taken: true, time: timeStr });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-lg">Monitoring medication adherence</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{adherenceRate}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-white/80">Current Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{missedCount}</div>
            <div className="text-white/80">Missed This Month</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold">{records.filter((r) => r.taken).length}</div>
            <div className="text-white/80">Total Taken</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Daily Medication</h4>
                    <p className="text-sm text-muted-foreground">8:00 AM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={hasTakenToday ? "secondary" : "destructive"}>
                      {hasTakenToday ? "Completed" : "Pending"}
                    </Badge>
                    {!hasTakenToday && (
                      <Button size="sm" onClick={handleMarkAsTaken}>
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSendReminderEmail} className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder Email
                </Button>
                <Button onClick={() => setActiveTab("notifications")} className="w-full justify-start" variant="outline">
                  <Bell className="w-4 h-4 mr-2" />
                  Configure Notifications
                </Button>
                <Button onClick={() => setActiveTab("calendar")} className="w-full justify-start" variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Adherence Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={adherenceRate} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {adherenceRate}% of doses taken in the past 30 days.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      {a.taken ? (
                        <Check className="text-green-600" />
                      ) : (
                        <AlertTriangle className="text-red-600" />
                      )}
                      <div>
                        <p className="font-medium">{format(new Date(a.date), "EEEE, MMM d")}</p>
                        <p className="text-sm text-muted-foreground">
                          {a.taken ? `Taken at ${a.time ?? "8:00 AM"}` : "Missed"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={a.taken ? "secondary" : "destructive"}>
                      {a.taken ? "Completed" : "Missed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      const taken = takenDates.has(dateStr);
                      const missed = !taken && isBefore(date, startOfDay(new Date()));
                      return (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <span>{date.getDate()}</span>
                          {taken && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                          )}
                          {missed && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                          )}
                        </div>
                      );
                    },
                  }}
                />

                <div>
                  <h4 className="font-medium mb-2">Details for {format(selectedDate, "MMMM d, yyyy")}</h4>
                  {(() => {
                    const selectedStr = format(selectedDate, "yyyy-MM-dd");
                    if (takenDates.has(selectedStr)) {
                      return (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                          <Check className="text-green-600 inline mr-2" />
                          Medication was taken on this day.
                        </div>
                      );
                    } else if (isBefore(selectedDate, startOfDay(new Date()))) {
                      return (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <AlertTriangle className="text-red-600 inline mr-2" />
                          Medication was missed on this day.
                        </div>
                      );
                    } else if (isToday(selectedDate)) {
                      return (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <Clock className="text-blue-600 inline mr-2" />
                          Monitoring today’s medication.
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                          <CalendarIcon className="text-gray-600 inline mr-2" />
                          This date is in the future.
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaretakerDashboard;
