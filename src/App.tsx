import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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

function App() {
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log("App rendering, auth state:", 
      userContext?.isLoading ? "loading" : userContext?.user ? "authenticated" : "not authenticated");
  }, [userContext]);

  if (!userContext || userContext.isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading user info...</div>;
  }
  
  // Check if user is logged in
  const isLoggedIn = !!userContext.user;
  console.log("Is user logged in:", isLoggedIn);

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex flex-col h-screen">
          <NavBar />
          <div className="flex-1 overflow-auto pt-16"> {/* Add padding for the fixed navbar */}
            <Routes>
              <Route path="/" element={<Connections />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/direct-messages" element={<DirectMessages />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/landing" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              
              {/* Add this new route for user profiles */}
              <Route path="/user/:userId" element={<ProfileWrapper />} />
              
              {/* Keep your existing username route for backward compatibility */}
              <Route path="/:username" element={<ProfileWrapper />} />
              
              {/* Catch-all must be last */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
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