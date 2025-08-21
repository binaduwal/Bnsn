'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setIsAdmin(true);
        router.push('/admin');
      } else {
        // Redirect non-admin users to dashboard
        router.push('/dashboard');
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
    setLoading(false);
  }, [user, router]);

  return { isAdmin, loading };
} 