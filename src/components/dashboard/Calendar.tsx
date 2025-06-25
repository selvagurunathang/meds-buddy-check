// components/Calendar.tsx
import React, { useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  format,
  isAfter
} from 'date-fns'

interface CalendarDay {
  date: Date
  takenCount: number
  missedCount: number
}

interface CalendarProps {
  data: CalendarDay[]
}

export const Calendar: React.FC<CalendarProps> = ({ data }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const getDayData = (date: Date) => {
    const match = data.find(d => isSameDay(d.date, date))
    return {
      takenCount: match?.takenCount || 0,
      missedCount: isAfter(date, today) ? 0 : match?.missedCount || 0,  
    }
  }

  const generateCalendarGrid = () => {
    const days: JSX.Element[] = []
    let current = startDate

    while (current <= endDate) {
      const dayData = getDayData(current)
      const inMonth = isSameMonth(current, currentMonth)
      const isFuture = isAfter(current, today)

      days.push(
        <div
          key={current.toISOString()}
          className={`h-16 border rounded-md text-center text-sm flex flex-col items-center justify-start py-1 relative
            ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
            ${isToday(current) ? 'border-blue-500 border-2' : 'border-gray-200'}
            ${isFuture ? 'opacity-75' : ''}
          `}
        >
          <div className={`text-xs font-medium ${isToday(current) ? 'text-blue-600' : ''}`}>
            {format(current, 'd')}
          </div>

          <div className="absolute bottom-1 flex gap-1">
            {dayData.takenCount > 0 && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
            {dayData.missedCount > 0 && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
          </div>
        </div>
      )

      current = addDays(current, 1)
    }

    return days
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentMonth(prev => subMonths(prev, 1))} className="text-sm px-3 py-1 border rounded">
          ‹
        </button>
        <h2 className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(prev => addMonths(prev, 1))} className="text-sm px-3 py-1 border rounded">
          ›
        </button>
      </div>

      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-7 gap-1">
        {generateCalendarGrid()}
      </div>

      
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Taken</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Missed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  )
}