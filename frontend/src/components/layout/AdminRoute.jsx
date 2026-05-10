import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/Spinner';

export default function AdminRoute() {
  const { user, sessionChecked } = useAuth();
  if (!sessionChecked) return <PageLoader />;
  if (!user) return <Navigate to="/login?redirect=/admin" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
