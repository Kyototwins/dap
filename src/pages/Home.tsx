
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If authenticated, redirect to matches
        navigate('/matches');
      } else {
        // If not authenticated, redirect to login
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  // This component will only be briefly visible during the redirect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
}
