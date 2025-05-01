import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import NavBar from "./components/Navbar";
import PublicNavbar from "./components/PublicNavbar";

import Connections from "./pages/Connections";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ProfileWrapper from "./pages/ProfileWrapper";
import DirectMessages from "./pages/DirectMessages";
import Landing from "./pages/Landing";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import AuthCallback from "./pages/AuthCallback";

import { UserContext } from "./UserContext";

////////////////////////////////////////////////////////////////////////////////
//  AuthenticatedLayout — wraps all logged-in routes and handles onboarding
////////////////////////////////////////////////////////////////////////////////
const AuthenticatedLayout: React.FC<{ needsOnboarding: boolean }> = ({
  needsOnboarding,
}) => {
  const location = useLocation();
  const userContext = useContext(UserContext);

  const isOnboardingPage = location.pathname === "/onboarding";
  const isNewRegistration =
    localStorage.getItem("recently_registered") === "true" &&
    localStorage.getItem("recently_registered_user_id") ===
      userContext?.user?.id;

  const requiresOnboarding = needsOnboarding || isNewRegistration;
  const showNavbar = !isOnboardingPage && !requiresOnboarding;

  return (
    <div className="flex flex-col h-screen">
      {showNavbar && <NavBar />}
      <div className={`flex-1 overflow-auto ${showNavbar ? "pt-16" : "pt-0"}`}>
        <Routes>
          <Route
            path="/"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Connections />
              )
            }
          />
          <Route
            path="/about"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <About />
              )
            }
          />
          <Route
            path="/profile"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <Profile />
              )
            }
          />
          <Route path="/error" element={<ErrorPage />} />

          {/** ←—— Here’s the updated DM route ——— */}
          <Route
            path="/direct-messages/:selectedUserId?"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <DirectMessages />
              )
            }
          />

          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          <Route
            path="/user/:userId"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <ProfileWrapper />
              )
            }
          />
          <Route
            path="/:username"
            element={
              requiresOnboarding ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <ProfileWrapper />
              )
            }
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////
//  App – decides between AuthenticatedLayout and Public routes
////////////////////////////////////////////////////////////////////////////////
function App() {
  const userContext = useContext(UserContext);

  useEffect(() => {
    console.log(
      "App rendering, auth state:",
      userContext?.isLoading
        ? "loading"
        : userContext?.user
        ? "authenticated"
        : "not authenticated"
    );
  }, [userContext]);

  useEffect(() => {
    const isNewRegistration =
      localStorage.getItem("recently_registered") === "true" &&
      localStorage.getItem("recently_registered_user_id") ===
        userContext?.user?.id;

    if (
      userContext?.user &&
      (userContext.needsOnboarding || isNewRegistration) &&
      window.location.pathname !== "/onboarding"
    ) {
      console.log("User needs onboarding, redirecting...");
      window.location.href = "/onboarding";
    }
  }, [userContext?.user, userContext?.needsOnboarding]);

  if (!userContext || userContext.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading user info...
      </div>
    );
  }

  const isLoggedIn = !!userContext.user;
  const needsOnboarding = !!userContext.needsOnboarding;

  return (
    <Router>
      {isLoggedIn ? (
        <AuthenticatedLayout needsOnboarding={needsOnboarding} />
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
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="*" element={<Navigate to="/landing" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
