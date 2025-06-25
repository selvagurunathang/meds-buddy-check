import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { MedicationProvider } from '@/contexts/MedicationContext'
import { AuthForm } from '@/components/auth/AuthForm'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/components/dashboard/Dashboard'
// import { EmptyState } from './components/dashboard/EmptyState'
import TakenDetails from '@/components/dashboard/Taken'
import Notification from '@/pages/Notification'
import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard'
      // case 'calendar': return 'Calendar'
      case 'taken-today': return 'Taken today'
      case 'notifications': return 'Notifications'
      default: return 'Dashboard'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'notifications':
        return <Notification />
      case 'taken-today':
        return <TakenDetails />
      default:
        return <Dashboard />
    }
  }

  return (
    <MedicationProvider>
      <div className="h-screen bg-gray-50 flex overflow-hidden">

        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col lg:ml-0">
          <Header
            title={getPageTitle()}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </MedicationProvider>

  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App