import {
    Route,
    createBrowserRouter,
    createRoutesFromElements
  } from "react-router-dom";
  import Home from "../pages/Home"
  import Signin from "../pages/Login";
  import Signup from "../pages/Register";
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">        
        <Route index element={<Home />} />
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Route>
    )
  );