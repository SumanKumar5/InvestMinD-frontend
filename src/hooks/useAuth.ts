import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (redirectTo: string = '/portfolio') => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('investmind_token');
    if (token) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
};

export const useRequireAuth = (redirectTo: string = '/login') => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('investmind_token');
    if (!token) {
      navigate(redirectTo);
    }
  }, [navigate, redirectTo]);
};