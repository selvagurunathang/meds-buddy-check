import { useEffect } from 'react';
import { useAppNavigation } from '../hooks/use-navigate';
import Header from '../components/Header';
import AuthForm from '../components/AuthForm';
import { checkSession } from '../lib/supabaseService';

function LoginForm() {
  const { goToDashboard } = useAppNavigation();

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      try {
        const session = await checkSession();
        if (isMounted && session?.user) {
          goToDashboard();
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };

    getSession();

    return () => {
      isMounted = false;
    };
  }, [goToDashboard]);

  return (
    <>
      <Header />
      <AuthForm />
    </>
  );
}

export default LoginForm;
