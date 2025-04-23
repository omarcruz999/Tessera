import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaHome, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/Tessera.svg";
import logoimage from "../assets/tesseraLogo.svg";
import profile from "../assets/Avatar.svg";
import { UserContext } from "../UserContext";

const NavBar = () => {
  const userContext = useContext(UserContext);
  const { user, loginWithGoogle, logout } = userContext || { 
    user: null, 
    loginWithGoogle: undefined, 
    logout: undefined 
  };
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  // Function to check if a route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
      } else {
        console.error('Google login function not available');
      }
    } catch (error: unknown) {
      console.error('Google login failed:', error);
    }
  };

  const navigateToLogin = () => {
    setIsDropdownOpen(false);
    navigate('/login');
  };
  
  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate('/landing');
      }
    } catch (error: unknown) {
      console.error('Logout failed:', error);
    }
  };

  // Common styles for icons
  const iconClass = "text-2xl transition-colors duration-200";
  const activeIconClass = "text-amber-500"; // Highlighted color for active route
  const inactiveIconClass = "text-white hover:text-amber-300";

  return (
    <div className="fixed top-0 left-0 w-full bg-[#3e2723] z-50">
      <nav className="flex w-full justify-between px-4 py-2">
        <div className="flex space-x-4 items-center">
          <Link to="/">
            <img src={logoimage} alt="Tessera" className="h-10" />
          </Link>
          <Link to="/">
            <img src={logo} alt="Tessera Logo" className="h-10 w-30" />
          </Link>
        </div>

        {user && (
          <ul className="flex text-align-center items-center space-x-10 mr-30">
            <li>
              <Link to="/profile" className="flex flex-col items-center">
                <FaUser 
                  className={`${iconClass} ${isActive('/profile') ? activeIconClass : inactiveIconClass}`} 
                  aria-label="Profile" 
                />
                <span className={`text-xs mt-1 ${isActive('/profile') ? activeIconClass : inactiveIconClass}`}>
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link to="/" className="flex flex-col items-center">
                <FaHome 
                  className={`${iconClass} ${isActive('/') ? activeIconClass : inactiveIconClass}`} 
                  aria-label="Connections" 
                />
                <span className={`text-xs mt-1 ${isActive('/') ? activeIconClass : inactiveIconClass}`}>
                  Connections
                </span>
              </Link>
            </li>
            <li>
              <Link to="/direct-messages" className="flex flex-col items-center">
                <FaEnvelope 
                  className={`${iconClass} ${isActive('/direct-messages') ? activeIconClass : inactiveIconClass}`} 
                  aria-label="Messages" 
                />
                <span className={`text-xs mt-1 ${isActive('/direct-messages') ? activeIconClass : inactiveIconClass}`}>
                  Messages
                </span>
              </Link>
            </li>
          </ul>
        )}
        
        <div
          className="relative flex items-center"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={user?.avatar_url || profile} 
            alt="Avatar" 
            className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-amber-500" 
          />
          {isDropdownOpen && (
            <div className="absolute right-0 top-full w-48 bg-white border rounded shadow-lg">
              <ul className="py-1">
                {user ? (
                  <>
                    <li>
                      <span className="block px-4 py-2 text-black font-medium border-b border-gray-100">
                        {user.full_name || 'Your Account'}
                      </span>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-black hover:bg-gray-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="my-1 border-gray-300" />
                    </li>
                    <li>
                      <span
                        onClick={handleLogout}
                        className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </span>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <span
                        onClick={navigateToLogin}
                        className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                      >
                        Login with Email
                      </span>
                    </li>
                    <li>
                      <span
                        onClick={handleGoogleLogin}
                        className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                      >
                        Login with Google
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;