import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { setToken } from '../utils/auth';

function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    }
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#888888]">Signing you in...</p>
    </div>
  );
}

export default AuthCallback;