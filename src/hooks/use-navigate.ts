import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToDashboard = useCallback(() => navigate('/dashboard'), [navigate]);
  const goToLogin = useCallback(() => navigate('/'), [navigate]);
  const goTo = useCallback((path: string) => navigate(path), [navigate]);

  return {
    goToDashboard,
    goToLogin,
    goTo,
  };
};
