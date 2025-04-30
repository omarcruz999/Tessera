import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import NavBar from "./components/Navbar";
import Connections from "./pages/Connections";
import About from "./pages/About";
import Profile from "./pages/Profile";
import DirectMessages from "./pages/DirectMessages";
import Landing from "./pages/Landing";
import { UserContext } from "./UserContext";
import ProfileWrapper from "./pages/ProfileWrapper";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import PublicNavbar from "./components/PublicNavbar";
import React from "react";

// Create a wrapper component that handles path-based rendering
const AuthenticatedLayout = ({ needsOnboarding }) => {
  // Get the current location
  const location = useLocation();
  
  // Add this line to get userContext
  const userContext = useContext(UserContext);
  
  // Check if we're on the onboarding page
  const isOnboardingPage = location.pathname === '/onboarding';
  
  // Check registration flags for additional context
  const isNewRegistration = 
    (localStorage.getItem('recently_registered') === 'true' && 
     localStorage.getItem('recently_registered_user_id') === userContext?.user?.id);
  
  // Determine if this user needs onboarding
  const requiresOnboarding = needsOnboarding || isNewRegistration;
  
  // Only show navbar if not in onboarding OR if onboarding is complete
  const showNavbar = !isOnboardingPage && !requiresOnboarding;
  
  return (
    <div className="flex flex-col h-screen">
      {showNavbar && <NavBar />}
      <div className={`flex-1 overflow-auto ${showNavbar ? 'pt-16' : 'pt-0'}`}>
        <Routes>
          <Route path="/" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <Connections />} />
          <Route path="/about" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <About />} />
          <Route path="/profile" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <Profile />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/direct-messages" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <DirectMessages />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/user/:userId" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <ProfileWrapper />} />
          <Route path="/:username" element={requiresOnboarding ? <Navigate to="/onboarding" replace /> : <ProfileWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

// Main App component
function App() {
  const userContext = useContext(UserContext);

  // Use React Router's navigate for redirection
  const navigate = (path) => {
    window.location.href = path;
  };

  // Always call all hooks in the same order every time
  // First useEffect - logging
  useEffect(() => {
    console.log("App rendering, auth state:", 
      userContext?.isLoading ? "loading" : userContext?.user ? "authenticated" : "not authenticated");
  }, [userContext]);

  // Second useEffect - onboarding check
  useEffect(() => {
    // Check multiple conditions for needing onboarding
    const isNewRegistration = 
      (localStorage.getItem('recently_registered') === 'true' && 
       localStorage.getItem('recently_registered_user_id') === userContext?.user?.id) ||
      sessionStorage.getItem('force_onboarding') === 'true';
    
    if (userContext?.user && 
        (userContext.needsOnboarding || isNewRegistration) && 
        window.location.pathname !== '/onboarding') {
      
      console.log("User needs onboarding, redirecting...");
      
      // Clear the force flag if we're using it
      if (sessionStorage.getItem('force_onboarding') === 'true') {
        sessionStorage.removeItem('force_onboarding');
      }
      
      navigate('/onboarding');
    }
  }, [userContext?.user, userContext?.needsOnboarding]);

  if (!userContext || userContext.isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading user info...</div>;
  }
  
  // Check if user is logged in
  const isLoggedIn = !!userContext.user;
  console.log("Is user logged in:", isLoggedIn);

  return (
    <Router>
      {isLoggedIn ? (
        <AuthenticatedLayout needsOnboarding={userContext.needsOnboarding} />
      ) : (
        <div>
          <PublicNavbar />
          <div className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/about" element={<About />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="*" element={<Navigate to="/landing" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;