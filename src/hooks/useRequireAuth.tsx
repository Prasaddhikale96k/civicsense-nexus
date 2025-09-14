import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const useRequireAuth = (redirectTo?: () => void) => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user && redirectTo) {
      redirectTo();
    }
  }, [user, loading, redirectTo]);

  return { user, loading, isAuthenticated: !!user };
};