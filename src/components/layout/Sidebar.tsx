import React from 'react'
import {
  Home,
  Pill,
  BarChart3,
  Bell,
  User,
  UserCheck,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen
}) => {
  const { user, currentRole, switchRole, signOut } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, showFor: 'both' },
    { id: 'taken-today', label: 'Taken today', icon: BarChart3, showFor: 'patient' },
    { id: 'notifications', label: 'Notifications', icon: Bell, showFor: 'both' },
  ]
  // console.log(menuItems)
  const filteredMenuItems = menuItems.filter(item =>
    item.showFor === 'both' ||
    (item.showFor === 'patient' && currentRole === 'patient') ||
    (item.showFor === 'caretaker' && currentRole === 'caretaker')
  )

  const handleRoleSwitch = () => {
    const newRole: UserRole = currentRole === 'patient' ? 'caretaker' : 'patient'
    switchRole(newRole)
  }

  return (
    <>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />


      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full">

          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Pill className="w-5 h-5 text-white" />
                </div>
                <div>
                   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
                  {/* <h1 className="text-lg font-bold text-gray-900">MediCare Companion</h1> */}
                  <h2 className="text-sm mt-2 font-600 text-gray-500">MediCare Companion</h2>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>


          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                {currentRole === 'patient' ? (
                  <User className="w-6 h-6 text-primary-600" />
                ) : (
                  <UserCheck className="w-6 h-6 text-secondary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>


            <div className="bg-gray-50 rounded-lg">
              <button
                onClick={handleRoleSwitch}
                className={`w-full px-4 py-3 flex items-center justify-between rounded-lg border transition
                  ${currentRole === 'patient'
                    ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100'
                    : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
                  }`}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate text-sm font-medium">
                    Switch to {currentRole === 'patient' ? 'Caretaker' : 'Patient'} View
                  </span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>


          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition
                        ${isActive
                          ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-500'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>


          <div className="p-4 border-t border-gray-200">
            <button
              onClick={signOut}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
