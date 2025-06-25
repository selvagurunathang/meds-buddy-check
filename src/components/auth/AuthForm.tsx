import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Mail, Lock, User, UserCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input-set'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/types'
import toast from 'react-hot-toast'

interface AuthFormData {
  email: string
  password: string
  name?: string
  role?: UserRole
}

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { signIn, signUp } = useAuth()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      role: 'patient'
    },
    mode: 'onBlur'
  })

  const role = watch('role')

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        await signIn(data.email, data.password)
        toast.success('Signed in successfully')
      } else {
        if (data.name && data.role) {
          await signUp(data.email, data.password, data.name, data.role)
          toast.success('Account created! Please check your email to confirm before signing in.')
          setTimeout(() => {
            reset({ email: '', password: '', name: '', role: 'patient' })
            setIsLogin(true)
          }, 1000)
        } else {
          throw new Error('Name and role are required')
        }
      }
    } catch (err: any) {
      reset({ password: '' })
      toast.error(err?.message || 'Something went wrong')
      throw err
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500"></div>

          <div className="p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h1>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to manage your medications' : 'Create your account in seconds'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {!isLogin && (
                <>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: 'Name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        label="Full Name"
                        type="text"
                        {...field}
                        placeholder="Your full name"
                        icon={<User className="w-5 h-5 text-gray-400" />}
                        error={errors.name?.message}
                      />
                    )}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('role', 'patient')}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${role === 'patient'
                          ? 'border-green-500 bg-green-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <User className="w-5 h-5 mb-1.5" />
                        <div className="text-sm font-medium">Patient</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('role', 'caretaker')}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${role === 'caretaker'
                          ? 'border-green-500 bg-green-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                      >
                        <UserCheck className="w-5 h-5 mb-1.5" />
                        <div className="text-sm font-medium">Caretaker</div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    type="email"
                    {...field}
                    placeholder="Enter your email"
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                // rules={{
                //     required: 'Password is required',
                //     minLength: {
                //       value: 6,
                //       message: 'Password must be at least 6 characters'
                //     }
                //   }}
                name="password"
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                render={({ field }) => (
                  <Input
                    label="Password"
                    type="password"
                    {...field}
                    placeholder="••••••••"
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    error={errors.password?.message}
                  />
                )}
              />

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full h-11 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-[#2BAD96]"
              // variant="gradient"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            {
              isLogin && (
                <div>

                  {/* <h2 className="text-sm text-gray-500 mt-6 mb-2">Demo Credentials</h2> */}
                  <h3 className="text-sm text-gray-700 mt-6 mb-2">Use these credentials to log in:</h3>
                  <div className='text-sm  text-gray-500'>Email : arunpandi@gmail.com</div>
                  <div className='text-sm  text-gray-500 '>Password : 12345678</div>
                </div>
              )
            }


            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  reset()
                  setIsLogin(!isLogin)
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {isLogin ? (
                  <>
                    Don't have an account? <span className="font-semibold">Sign up</span>
                  </>
                ) : (
                  <>
                    Already have an account? <span className="font-semibold">Sign in</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}