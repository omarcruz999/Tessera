// filepath: /Users/alexmatei/git/tessera/src/App.tsx
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About';
//import { UserContext } from './UserContext';
//import { useState, useContext } from 'react';

function App() {


  {/* 
  
  // Get the user information and functions from userContext
  const userContext = useContext(UserContext);
  
  // If there is no userContext show an error
  if (!userContext) {
    return <div>Error: UserContext is not provided</div>;
  }

  // Extract user, login, and logout from the context
  const { user, login, logout } = userContext;
  
  */}

  return (

    
    <Router>
      

      <div>
        {/* Nav Bar
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
        */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div> 
    

      {/*
      // Section for User Login and Logout
      <div>
        {user ? (
          <div>
            <p>Welcome, {user.name}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => login({ id: '1', name: 'John Doe', email: 'john@example.com' })}>
            Login
          </button>
        )}
      </div>
      */}
    </Router>
  );
}

export default App;