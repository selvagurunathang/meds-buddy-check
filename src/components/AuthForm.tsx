import { useState, useCallback, useMemo } from 'react';
import { signInWithEmail, signUpWithEmail } from '../lib/supabaseService';
import { useAppNavigation } from '../hooks/use-navigate';
import { useEmailInput, usePasswordInput } from '../hooks/useFormInput';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Link } from 'react-router-dom';

type AuthType = 'LOGIN' | 'SIGNUP';

export default function AuthForm() {
  
  const emailInput = useEmailInput();
  const passwordInput = usePasswordInput();

  const [authType, setAuthType] = useState<AuthType>('LOGIN');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { goToDashboard } = useAppNavigation();

  const isLogin = authType === 'LOGIN';

  const buttonLabel = useMemo(() => {
    return loading ? 'Please wait...' : isLogin ? 'Login' : 'Signup';
  }, [loading, isLogin]);

  const toggleText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const toggleButtonLabel = isLogin ? 'Sign up' : 'Log in';

  const toggleAuthType = useCallback(() => {
    setAuthType(prev => (prev === 'LOGIN' ? 'SIGNUP' : 'LOGIN'));
    setMessage('');
  }, []);

  const handleAuth = useCallback(async () => {
    const sanitizedEmail = emailInput.value.trim().toLowerCase();
    const sanitizedPassword = passwordInput.value.trim();

    if (!emailInput.isValid) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (!passwordInput.isValid) {
      setMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.'
      );
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(sanitizedEmail, sanitizedPassword);

        if (error) {
          setMessage(error.message);
        } else {
          goToDashboard();
        }
      } else {
        const { data, error } = await signUpWithEmail(sanitizedEmail, sanitizedPassword);

        if (error || data.user.role === "") {
          if (data.user.role === "") {
            setMessage('Email already exists. Please log in instead.');
          } else {
            setMessage(error.message);
          }
        } else {
          setMessage('Signup successful! Check your email to confirm.');
        }
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [emailInput, passwordInput, isLogin, goToDashboard]);

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border border-gray-200 rounded-2xl shadow-md bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {isLogin ? 'Login to your account' : 'Create a new account'}
      </h2>

      <Input
        type="email"
        placeholder="Email"
        value={emailInput.value}
        onChange={emailInput.onChange}
        className="w-full p-3 border-gray-300 rounded-lg mb-4"
      />
      {!emailInput.isValid && (
        <p className="text-sm text-red-600 -mt-2 mb-3">Invalid email format</p>
      )}

      <Input
        type="password"
        placeholder="Password"
        value={passwordInput.value}
        onChange={passwordInput.onChange}
        className="w-full p-3 border-gray-300 rounded-lg mb-4"
      />
      {!passwordInput.isValid && (
        <p className="text-sm text-red-600 -mt-2 mb-3">
          Weak password: Must include upper, lower, number & symbol
        </p>
      )}

      <Button
        className={`w-full mt-6 text-white py-3 text-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        onClick={handleAuth}
        disabled={loading}
      >
        {buttonLabel}
      </Button>

      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}

      <p className="mt-6 text-center text-sm text-gray-700">
        {toggleText}{' '}
        <Button
          type="button"
          variant="link"
          onClick={toggleAuthType}
          className="text-blue-600 font-medium hover:underline ml-1"
        >
          {toggleButtonLabel}
        </Button>
      </p>

      {isLogin && (
        <p className="mt-2 text-center text-sm text-gray-700">
          <Link
            to="/forgotPassword"
            className="text-blue-600 font-medium hover:underline ml-1"
          >
            Forgot password?
          </Link>
        </p>
      )}
    </div>
  );
}
