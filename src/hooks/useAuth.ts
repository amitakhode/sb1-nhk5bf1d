import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        // Check if there's a redirect path in localStorage
        const redirectPath = localStorage.getItem('authRedirectPath');
        if (redirectPath) {
          localStorage.removeItem('authRedirectPath');
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/login');
      }
    });
  }, [setUser, navigate]);

  return null;
};