import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';  
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './UserContext';  
import NavBar from './navbar';
import Home from './home';
import CreateAccount from './createaccount';
import Login from './login';
import Deposit from './deposit';
import Withdraw from './withdraw';
import Balance from './balance';
import AllData from './alldata';

// Create a PrivateRoute component to protect certain routes
function PrivateRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  console.log("User context in PrivateRoute:", user);  // Log user state in PrivateRoute

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user === undefined) {
    return <div>Loading user state...</div>;  // Show loading state if user is undefined
  }

  if (user === null) {
    return <div>User is not logged in or session expired.</div>
  }

  return children;
}

function Spa() {
  const { user } = useContext(UserContext);
  console.log("User context in Spa component:", user);

  if (user === undefined) {
    return <div>Loading...</div>;  // Show loading state if user is undefined
  }

  return (
    <HashRouter>
      <NavBar />
      <div className="container" style={{ padding: "20px" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/login" element={<Login />} />
          <Route path="/alldata" element={<AllData />} />
          
          {/* Private Routes */}
          <Route path="/balance" element={<PrivateRoute> <Balance /></PrivateRoute>} />
          <Route path="/deposit" element={<PrivateRoute ><Deposit /></PrivateRoute>} />
          <Route path="/withdraw" element={<PrivateRoute ><Withdraw /></PrivateRoute>} />
        </Routes>
      </div>
    </HashRouter>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);

import ErrorBoundary from './ErrorBoundary';

// Wrap Spa with UserProvider
root.render(
  <UserProvider>
    {/* <ErrorBoundary> */}
      <Spa />
    {/* </ErrorBoundary> */}
  </UserProvider>
);