import { useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { useAppNavigation } from '../hooks/use-navigate';
import { Button } from './ui/button';
import { Input } from './ui/input';

type AuthType = 'LOGIN' | 'SIGNUP';

export default function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authType, setAuthType] = useState<AuthType>('LOGIN');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { goToDashboard } = useAppNavigation();

    const handleAuth = async () => {
        setMessage('');
        setLoading(true);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPassword = password.trim();

        if (!emailRegex.test(sanitizedEmail)) {
            setMessage('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        if (!passwordRegex.test(sanitizedPassword)) {
            setMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            if (authType === 'LOGIN') {
                const { error } = await supabase.auth.signInWithPassword({ email: sanitizedEmail, password: sanitizedPassword });
                if (error) {
                    setMessage(error.message);
                } else {
                    setMessage('Logged in successfully');
                    goToDashboard();
                }
            } else {
                const { error } = await supabase.auth.signUp({ email: sanitizedEmail, password: sanitizedPassword });
                setMessage(error ? error.message : 'Signup successful! Check your email to confirm.');
            }
        } catch (err: any) {
            setMessage('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 border border-gray-200 rounded-2xl shadow-md bg-white">
            <h2 className="text-2xl font-semibold text-center mb-6">
                {authType === 'LOGIN' ? 'Login to your account' : 'Create a new account'}
            </h2>

            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-gray-300 rounded-lg mb-4"
            />

            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-gray-300 rounded-lg mb-4"
            />

            <Button
                className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg ${loading && 'bg-gray-400 cursor-not-allowed'}`}
                onClick={handleAuth}
                disabled={loading}
            >
                {loading ? 'Please wait...' : authType === 'LOGIN' ? 'Login' : 'Signup'}
            </Button>

            {message && (
                <p className="mt-4 text-center text-sm text-red-600">{message}</p>
            )}

            <p className="mt-6 text-center text-sm text-gray-700">
                {authType === 'LOGIN' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Button
                    type="button"
                    variant='link'
                    onClick={() => setAuthType(authType === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                    className="text-blue-600 font-medium hover:underline ml-1"
                >
                    {authType === 'LOGIN' ? 'Sign up' : 'Log in'}
                </Button>
            </p>
        </div>
    );
}
