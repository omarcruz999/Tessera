import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Tessera.svg";
import logoimage from "../assets/tesseraLogo.svg";
import profile from "../assets/Avatar.svg";
import acc from "../assets/Profile.svg";
import home from "../assets/Home Button.svg";
import dm from "../assets/Direct Messages Button.svg";
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

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
        // Redirects to Google
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
              <Link to="/profile">
                <img src={acc} alt="Profile" className="h-15" />
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={home} alt="Home" className="h-15" />
              </Link>
            </li>
            <li>
              <Link to="/direct-messages">
                <img src={dm} alt="Direct Messages" className="h-15" />
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
            className="h-10 w-10 rounded-full object-cover cursor-pointer" 
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
                        className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                      >
                        Logout
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