import React from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationList = () => {
  
  const unreadNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Medication Taken',
      message: 'You marked Lisinopril as taken at 08:00 AM',
      time: '10 min ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Missed Dose',
      message: 'Metformin was not taken at scheduled time (08:00 AM)',
      time: '1 hour ago',
      read: false
    }
  ];

  const readNotifications: Notification[] = [
    {
      id: '3',
      type: 'info',
      title: 'New Medication',
      message: 'Amoxicillin was added to your medications',
      time: 'Yesterday',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
     
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 px-4">Unread Notifications</h3>
        {unreadNotifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {unreadNotifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-500">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ""}
      </div>

    
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900 px-4">Earlier Notifications</h3>
        {readNotifications.length > 0 ? (
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {readNotifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">{notification.title}</p>
                    <p className="text-sm text-gray-400">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : ""}
      </div>
    </div>
  );
};

export default NotificationList;