import { useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEmailInput } from '../hooks/useFormInput';

const updatePasswordPage = import.meta.env.VITE_UPDATE_PASSWORD_PAGE;

export default function ForgotPassword() {
    const emailInput = useEmailInput();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');
    const [loading, setLoading] = useState(false);

    const handleReset = useCallback(async () => {
        const trimmedEmail = emailInput.value.trim();

        if (!trimmedEmail || !emailInput.isValid) {
            setMessage('Please enter a valid email address.');
            setMessageType('error');
            return;
        }

        setLoading(true);
        setMessage('');
        setMessageType('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
                redirectTo: updatePasswordPage,
            });

            if (error) {
                setMessage(error.message);
                setMessageType('error');
            } else {
                setMessage('Check your email for the reset link.');
                setMessageType('success');
            }
        } finally {
            setLoading(false);
        }
    }, [emailInput]);

    const buttonLabel = useMemo(() => (loading ? 'Sending...' : 'Send Reset Link'), [loading]);

    return (
        <>
            <Header />
            <div className="max-w-md mx-auto mt-16 p-6 border border-gray-200 rounded-2xl shadow-md bg-white">
                <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

                <Input
                    type="email"
                    placeholder="Email"
                    value={emailInput.value}
                    onChange={emailInput.onChange}
                    className="w-full p-3 border-gray-300 rounded-lg"
                />

                {!emailInput.isValid && (
                    <p id="emailError" className="text-sm text-red-600 mt-2">
                        Invalid email format.
                    </p>
                )}

                <Button
                    className={`w-full mt-6 text-white py-3 text-lg ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleReset}
                    disabled={loading}
                >
                    {buttonLabel}
                </Button>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            messageType === 'error' ? 'text-red-600' : 'text-green-600'
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </>
    );
}
