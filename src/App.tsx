import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import NavBar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";

import Connections from "./pages/Connections";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import ProfileWrapper from "./pages/ProfileWrapper";
import DirectMessages from "./pages/DirectMessages";
import ErrorPage from "./pages/ErrorPage";

import { UserContext } from "./UserContext";

////////////////////////////////////////////////////////////////////////////////
//  App – with public and logged-in states
////////////////////////////////////////////////////////////////////////////////
function App() {
  const userContext = useContext(UserContext);

  // Show loading screen while initializing
  if (!userContext || userContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E7A691] mx-auto mb-4"></div>
          <p className="text-[#424242] text-lg">Loading Tessera Demo...</p>
        </div>
      </div>
    );
  }

  const { user, login } = userContext;

  // Public routes for logged-out state
  const PublicApp = () => (
    <div className="flex flex-col h-screen">
      <PublicNavbar />
      <div className="flex-1 overflow-auto pt-16">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/demo" element={<DemoRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );

  // Component to handle demo login and redirect
  const DemoRedirect = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
      const handleDemoLogin = async () => {
        await login();
        navigate('/home');
      };
      
      handleDemoLogin();
    }, []);
    
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-[#FAE8E0] to-[#FDF7F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E7A691] mx-auto mb-4"></div>
          <p className="text-[#424242] text-lg">Entering Demo Mode...</p>
        </div>
      </div>
    );
  };

  // Logged-in routes
  const LoggedInApp = () => (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex-1 overflow-auto pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Connections />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/direct-messages/:selectedUserId?" element={<DirectMessages />} />
          <Route path="/user/:userId" element={<ProfileWrapper />} />
          <Route path="/:username" element={<ProfileWrapper />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  );

  return (
    <Router>
      {user ? <LoggedInApp /> : <PublicApp />}
    </Router>
  );
}

export default App;