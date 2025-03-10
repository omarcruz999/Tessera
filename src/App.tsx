import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile"; // Import the Profile component
import DirectMessages from "./pages/DirectMessages";
import { UserContext } from "./UserContext";

function App() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }

  return (
    <Router>
      <div>
        <NavBar /> {/* Include the NavBar component */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} /> {/* Add the profile route */}
          <Route path="/direct-messages" element={<DirectMessages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;