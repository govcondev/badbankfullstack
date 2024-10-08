import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Card } from './context';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user.email) {
        setStatus(`Welcome back, ${userCredential.user.email}`);
        console.log('User signed in:', userCredential.user);

        const timeoutId = setTimeout(() => {
          navigate('/balance');
        }, 3000);
        
      } else {
        setStatus('Login failed. Please check your credentials.');
        setIsLoggingIn(false);
      }

    } catch (error) {
      setStatus('Failed to sign in: ' + error.message);
      console.error('Error signing in:', error);
      setIsLoggingIn(falese);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card
        bgcolor="secondary"
        header={<div className="text-center">Login</div>}
        status={status}
        body={
          <>
            Email<br/>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} /><br/>
            Password<br/>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} /><br/>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-light" onClick={handleLogin}>Login</button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default Login;