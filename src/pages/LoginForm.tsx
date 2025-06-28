import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import AuthForm from '../components/AuthForm';
import { useAppNavigation } from '../hooks/use-navigate';
import Header from '../components/Header';

function LoginForm() {
  const { goToDashboard } = useAppNavigation();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (isMounted && data.session?.user) {
          goToDashboard();
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };

    checkSession();

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
