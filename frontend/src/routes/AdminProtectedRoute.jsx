import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LoadingState } from '../components/common/States';

export default function AdminProtectedRoute() {
  const { admin, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) return <LoadingState label="Checking session..." />;
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location }} />;

  return <Outlet />;
}
