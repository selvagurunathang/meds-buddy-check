import { useNavigate } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToDashboard: () => navigate('/dashboard'),
    goToLogin: () => navigate('/'),
    goTo: (path: string) => navigate(path),
  };
};
