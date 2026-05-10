import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui/Spinner';

export default function PrivateRoute() {
  const { user, sessionChecked } = useAuth();
  const location = useLocation();
  if (!sessionChecked) return <PageLoader />;
  return user ? <Outlet /> : <Navigate to={`/login?redirect=${location.pathname}`} replace />;
}
