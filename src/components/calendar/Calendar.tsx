 
import React from 'react'
import { format, isSameDay, isToday } from 'date-fns'

interface CalendarEvent {
  date: Date
  status: 'taken' | 'missed'
  medication?: string
}

interface CalendarProps {
  events: CalendarEvent[]
  today: Date
}

const Calendar: React.FC<CalendarProps> = ({ events, today }) => {
 
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))

  
  const getDayEvents = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day))
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dayEvents = getDayEvents(day)
          const isCurrentDay = isToday(day)
          
          return (
            <div 
              key={day.toString()}
              className={`h-10 border rounded-md flex flex-col items-center justify-center relative
                ${isCurrentDay ? 'border-2 border-blue-500' : 'border-gray-200'}`}
            >
              <span className={`text-sm ${isCurrentDay ? 'font-bold text-blue-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </span>
              
              <div className="absolute bottom-1 flex space-x-1">
                {dayEvents.map((event, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full 
                      ${event.status === 'taken' ? 'bg-green-500' : 'bg-red-500'}`}
                    title={`${event.medication || 'Medication'} ${event.status}`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default Calendar