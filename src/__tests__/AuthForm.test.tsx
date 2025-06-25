import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthForm } from '../components/auth/AuthForm'
import { AuthProvider } from '../contexts/AuthContext'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    }
  }
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AuthProvider>
      {component}
    </AuthProvider>
  )
}

describe('AuthForm', () => {
  it('renders login form by default', () => {
    renderWithProvider(<AuthForm />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
  })

  it('switches to signup form when clicked', () => {
    renderWithProvider(<AuthForm />)
    
    const switchButton = screen.getByText("Don't have an account? Sign up")
    fireEvent.click(switchButton)
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByText('Patient')).toBeInTheDocument()
    expect(screen.getByText('Caretaker')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    renderWithProvider(<AuthForm />)
    
    const submitButton = screen.getByText('Sign In')
    fireEvent.click(submitButton)
    
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeRequired()
    expect(screen.getByPlaceholderText('Enter your password')).toBeRequired()
  })
})