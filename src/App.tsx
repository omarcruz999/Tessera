import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import NavBar from "./components/Navbar";

import Connections from "./pages/Connections";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ProfileWrapper from "./pages/ProfileWrapper";
import DirectMessages from "./pages/DirectMessages";
import ErrorPage from "./pages/ErrorPage";

import { UserContext } from "./UserContext";

////////////////////////////////////////////////////////////////////////////////
//  App – simplified for demo mode (user is always logged in)
////////////////////////////////////////////////////////////////////////////////
function App() {
  const userContext = useContext(UserContext);

  // Show loading screen while initializing demo user
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

  // In demo mode, user is always logged in
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <NavBar />
        <div className="flex-1 overflow-auto pt-16">
          <Routes>
            {/* Main app routes */}
            <Route path="/" element={<Connections />} />
            <Route path="/home" element={<Connections />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/direct-messages/:selectedUserId?" element={<DirectMessages />} />
            <Route path="/user/:userId" element={<ProfileWrapper />} />
            <Route path="/:username" element={<ProfileWrapper />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Redirect legacy routes */}
            <Route path="/landing" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="/onboarding" element={<Navigate to="/" replace />} />
            <Route path="/auth/callback" element={<Navigate to="/" replace />} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;