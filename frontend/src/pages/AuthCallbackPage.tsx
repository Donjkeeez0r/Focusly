import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/format';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');

    if (!token) {
      setError('Токен авторизации не найден');
      return;
    }

    void completeLogin(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((err) => setError(getErrorMessage(err)));
  }, [completeLogin, navigate]);

  if (error) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="grid min-h-screen place-items-center bg-page text-text">
      <div className="panel flex items-center gap-3">
        <Loader2 className="animate-spin text-primary" size={22} />
        Завершаем вход...
      </div>
    </div>
  );
}
