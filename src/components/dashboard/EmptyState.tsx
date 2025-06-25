import React from 'react'
import { Bell, BellOff } from 'lucide-react'

interface EmptyStateProps {
  type: 'notifications' | 'calendar' | 'analytics' | 'settings'
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const getContent = () => {
    switch (type) {
      case 'notifications':
        return {
          icon: Bell,
          title: 'No notifications',
          description: 'You\'re all caught up! Notifications will appear here when you have medication reminders or updates.',
          action: 'Notification settings coming soon'
        }
      case 'calendar':
        return {
          icon: BellOff,
          title: 'Calendar View',
          description: 'Track your medication history and plan ahead with our calendar view.',
          action: 'Calendar feature coming soon'
        }
      case 'analytics':
        return {
          icon: BellOff,
          title: 'Analytics Dashboard',
          description: 'View detailed insights about your medication adherence and patterns.',
          action: 'Analytics feature coming soon'
        }
      case 'settings':
        return {
          icon: BellOff,
          title: 'Settings',
          description: 'Customize your medication tracking experience and notification preferences.',
          action: 'Settings panel coming soon'
        }
      default:
        return {
          icon: BellOff,
          title: 'Coming Soon',
          description: 'This feature is under development.',
          action: 'Stay tuned for updates'
        }
    }
  }

  const content = getContent()
  const Icon = content.icon

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{content.title}</h3>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">
          {content.description}
        </p>
        <p className="text-sm text-primary-600 font-medium">
          {content.action}
        </p>
      </div>
    </div>
  )
}