import React from 'react'
import { Menu, Bell, SwitchCamera } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  title: string
  setSidebarOpen: (open: boolean) => void
}

export const Header: React.FC<HeaderProps> = ({ title, setSidebarOpen }) => {
  const { currentRole } = useAuth()
  // alert(currentRole)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button> */}
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 capitalize">
              {currentRole} Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            // onClick={handleRoleSwitch}
            className={`
    flex items-center
    px-4 py-2
    text-xs font-semibold
    rounded-full
    transition-all duration-200
    ${currentRole === 'patient'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }
    hover:shadow-xs
  `}
          >
            <SwitchCamera className="mr-2 h-3 w-3" />
            <span>
              {currentRole === 'patient' ? 'Caretaker' : 'Patient'} Mode
            </span>
          </button>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}