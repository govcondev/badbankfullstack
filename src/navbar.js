import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from './firebase';  
import { UserContext } from './UserContext';

function NavBar() {
  const { user, setUser } = useContext(UserContext);
  const [logoutMessage, setLogoutMessage] = useState('');
  const navigate = useNavigate();

  // Handle user sign-out
  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setUser(null);  // Clear user context on sign-out
        setLogoutMessage('Successfully logged out');  // Set the logout message

        // Delay navigation to '/' page by 3 seconds
        setTimeout(() => {
          setLogoutMessage('');  // Clear the message
          navigate('/', { replace: true });  // Redirect to home page
        }, 3000);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">BadBank</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {/* Public links */}
          <li className="nav-item">
            <a className="nav-link" href="#/CreateAccount/">Create Account</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#/login/">Login</a>
          </li>
          {/* Conditional rendering based on user state */}
          {user && (
            <>
              <li className="nav-item">
                <a className="nav-link" href="#/deposit/">Deposit</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/withdraw/">Withdraw</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/balance/">Balance</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#/alldata/">All Data</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-light nav-link" onClick={handleSignOut}>Logout</button>
              </li>
            </>
          )}
        </ul>
      {/* Logout Message Display - Conditionally show message when it exists */}
      {logoutMessage && (
        <div className="alert alert-success text-center" style={{ position: 'absolute', right: '20px', top: '10px' }}>
          {logoutMessage}
        </div>
        )}
      
      {/* User Information Section - Shows user email if logged in */}
      {user && (
          <div className="navbar-text d-flex align-items-center">
            {/* Display user email with padding for spacing */}
            <span style={{ paddingRight: '15px', fontWeight: 'bold' }}>
              {user.email}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
