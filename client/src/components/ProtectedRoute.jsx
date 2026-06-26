import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ auth, children }) {
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
