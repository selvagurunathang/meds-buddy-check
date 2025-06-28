import { useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { usePasswordInput } from '../hooks/useFormInput';

export default function UpdatePassword() {
  const passwordInput = usePasswordInput();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = useCallback(async () => {
    const trimmedPassword = passwordInput.value.trim();

    if (!trimmedPassword || !passwordInput.isValid) {
      setMessage('Password must be strong: 6+ characters with upper, lower, number, and symbol.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password: trimmedPassword,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully!');
    }
  }, [passwordInput]);

  const buttonLabel = useMemo(() => loading ? 'Updating...' : 'Update Password', [loading]);

  const isSuccess = message === 'Password updated successfully!';
  const messageColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto mt-16 p-6 border border-gray-200 rounded-2xl shadow-md bg-white">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Set a New Password
        </h2>

        <Input
          type="password"
          placeholder="New password"
          value={passwordInput.value}
          onChange={passwordInput.onChange}
          className="w-full p-3 border-gray-300 rounded-lg"
        />

        {!passwordInput.isValid && (
          <p className="text-sm text-red-600 mt-6">
            Must include upper, lower, number & special character.
          </p>
        )}

        <Button
          className={`w-full mt-6 text-white py-3 text-lg ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleUpdate}
          disabled={loading}
        >
          {buttonLabel}
        </Button>

        {message && (
          <div>
            <p className={`mt-4 text-center text-sm ${messageColor}`}>
              {message}
            </p>
            {isSuccess && (
              <p className="mt-2 text-center text-sm text-gray-700">
                <Link
                  to="/"
                  className="text-blue-600 font-medium hover:underline ml-1"
                >
                  Login!
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
