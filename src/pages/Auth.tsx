import { useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
// import Image from 'next/image';
import LoginBg from "@/assest/images/loginbg.png"

type FormData = {
    email: string;
    password: string;
};

import { Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 10
        }
    }
};

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [authError, setAuthError] = useState('');
    const navigate= useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>();

    const handleAuth = async (data: FormData) => {
        setLoading(true);
        setAuthError('');

        try {
            const { error } = isSignUp
                ? await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: { role: "patient" }
                    }
                })
                : await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password
                });

            if (error) throw error;
            reset();
            navigate('/')


        } catch (error: any) {
            setAuthError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hidden md:flex items-center justify-center"
                >
                    <div className="relative w-full h-96">
                        <img
                            src={LoginBg}
                            alt="Login"
                            className="object-contain"
                            style={{ width: '90%', height: '90%' }}
                        />
                    </div>
                </motion.div>

              
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-8">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-3xl font-bold text-gray-900 py-2">
                                    {isSignUp ? 'Join Meds Buddy' : 'Welcome Back'}
                                </h2>
                                <p className="mt-2 text-gray-600">
                                    {isSignUp ? 'Create your account to manage medications' : 'Sign in to your medication tracker'}
                                </p>
                            </motion.div>
                        </div>

                        {authError && (
                            <motion.div
                                variants={itemVariants}
                                className="mb-6 p-4 bg-red-50 rounded-lg"
                            >
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 text-red-500 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium text-red-800">
                                        {authError}
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(handleAuth)} className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        className={`block w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:ring-2 focus:outline-none transition-all`}
                                    />
                                    {errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-600"
                                        >
                                            {(errors.email as FieldError).message}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                        className={`block w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:ring-2 focus:outline-none transition-all`}
                                    />
                                    {errors.password && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-1 text-sm text-red-600"
                                        >
                                            {(errors.password as FieldError).message}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${loading ? 'bg-blue-400' : 'bg-[#C22D8A] hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center`}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : isSignUp ? (
                                        'Create Account'
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    reset();
                                    setAuthError('');
                                }}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                            >
                                {isSignUp
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Sign up"}
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}