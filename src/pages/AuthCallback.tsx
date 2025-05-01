import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import supabase from '../services/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing...");
        
        // Retrieve the session (Supabase automatically processes the hash fragment)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth callback error:", error);
          navigate('/login?error=auth_failed');
          return;
        }
        
        if (data?.session) {
          console.log("Auth callback successful, session established");
          
          // The UserContext's auth state change listener will handle user state
          // Just redirect to the appropriate page
          
          // Check if onboarding is needed
          const isNewRegistration = localStorage.getItem('recently_registered') === 'true' && 
                                   localStorage.getItem('recently_registered_user_id') === data.session.user.id;
          
          const onboardingCompleted = localStorage.getItem(`onboarding_complete_${data.session.user.id}`) === 'true';
          
          if (isNewRegistration && !onboardingCompleted) {
            console.log("New user needs onboarding, redirecting...");
            navigate('/onboarding');
          } else {
            console.log("Authenticated user, redirecting to home");
            navigate('/');
          }
        } else {
          console.log("No session found in callback, redirecting to login");
          navigate('/login');
        }
      } catch (err) {
        console.error("Error processing auth callback:", err);
        navigate('/login?error=unknown');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8EB486] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <p className="text-lg">Completing your sign-in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;