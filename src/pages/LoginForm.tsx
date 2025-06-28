import { useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';
import AuthForm from '../components/AuthForm';
import { useAppNavigation } from '../hooks/use-navigate';
import Header from '../components/Header';

function LoginForm() {
  const { goToDashboard } = useAppNavigation();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        goToDashboard();
      }
    }

    checkSession()
  }, [goToDashboard])

  return <><Header /><AuthForm /></>
}

export default LoginForm;
