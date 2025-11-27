'use client';

import { useEffect } from 'react';
import { useAuth } from '../../src/store/auth-store';
import { AdminShell } from '../../src/components/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        window.location.href = '/login';
      }
    }
  }, [user]);

  return <AdminShell>{children}</AdminShell>;
}
