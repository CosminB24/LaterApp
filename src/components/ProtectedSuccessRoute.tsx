import { Navigate, useSearchParams } from 'react-router-dom';

interface ProtectedSuccessRouteProps {
  children: React.ReactNode;
}

export default function ProtectedSuccessRoute({ children }: ProtectedSuccessRouteProps) {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return <Navigate to="/premium" replace />;
  }

  return <>{children}</>;
} 