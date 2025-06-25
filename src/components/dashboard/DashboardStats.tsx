import React from 'react'
import { TrendingUp, Calendar, Target, Award, User } from 'lucide-react'
import { useMedication } from '@/contexts/MedicationContext'
import { useAuth } from '@/contexts/AuthContext'
function DashboardStats() {
  const { adherenceStats } = useMedication()
  const { currentRole } = useAuth()

  const stats = [
    {
      label: 'Today\'s Progress',
      value: `${adherenceStats.takenToday}/${adherenceStats.totalMedications}`,
      percentage: adherenceStats.adherencePercentage,
      icon: Target,
      color: 'primary',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600'
    },
    {
      label: 'Adherence Rate',
      value: `${adherenceStats.adherencePercentage}%`,
      icon: TrendingUp,
      color: 'success',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600'
    },
    {
      label: 'Current Streak',
      value: `${adherenceStats.currentStreak} days`,
      icon: Calendar,
      color: 'secondary',
      bgColor: 'bg-secondary-50',
      iconColor: 'text-secondary-600'
    },
    {
      label: 'Best Streak',
      value: `${adherenceStats.longestStreak} days`,
      icon: Award,
      color: 'accent',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ]

  return (
    <div
    // className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {/* {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              {stat.percentage !== undefined && (
                <div className="text-right">
                  <div className={`text-2xl font-bold ${stat.percentage >= 80 ? 'text-success-600' :
                    stat.percentage >= 60 ? 'text-warning-600' : 'text-error-600'
                    }`}>
                    {stat.percentage}%
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        )
      })} */}
      <div className={`${currentRole === "caretaker" ? 'bg-gradient-to-r from-blue-500 to-green-500 ' : 'bg-gradient-to-r from-green-500 to-blue-500 '}rounded-2xl p-8 text-white`}>
        <div className="gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            {currentRole === "caretaker" ? <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
              :<h2 className="text-3xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</h2> }
            <p className="text-white/90 text-lg">{currentRole === "patient" ? "Ready to stay on track with your medication?" : "Monitoring Eleanor Thompson's medication adherence"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 w-full">
          {/* {stats.map((stat, index) => {
            // const Icon = stat.icon
            return ( */}
          {
            currentRole === "patient" &&
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{adherenceStats.takenToday}/{adherenceStats.totalMedications}</div>
              <div className="text-white/80">Today's Progress</div>
            </div>
          }
          {
            currentRole === "patient" &&
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{adherenceStats.takenToday}</div>
              <div className="text-white/80">Today Taken</div>
            </div>
          }

          {currentRole === "caretaker" && <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.adherencePercentage}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </div>}

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.currentStreak} days</div>
            <div className="text-white/80">Current Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{adherenceStats.longestStreak} days</div>
            <div className="text-white/80">Best Streak</div>
          </div>
          {/* <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">${adherenceStats.takenToday}/${adherenceStats.totalMedications}</div>
            <div className="text-white/80">'Today\'s Progress</div>
          </div> */}
          {/* )
          })} */}
        </div>
      </div>
    </div>
  )
}
export default DashboardStats