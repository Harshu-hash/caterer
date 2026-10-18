import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, adminMe } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminMe()
      .then((data) => setAdmin(data))
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    await adminLogin(credentials);
    const data = await adminMe();
    setAdmin(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await adminLogout();
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
