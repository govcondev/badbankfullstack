import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Card } from './context';

function CreateAccount() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleCreateAccount = async () => {
    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send the new user information to the backend to store it in MongoDB
      const response = await fetch('/account/storeUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: user.email,
          uid: user.uid  // Include Firebase UID for unique identification
        })
      });

      if (response.ok) {
        setStatus(`Account created successfully! Welcome, ${user.email}`);
      } else {
        const error = await response.json();
        setStatus('Failed to store user in the database: ' + error.message);
      }

      console.log('User created and stored:', user);
    } catch (error) {
      setStatus('Failed to create account: ' + error.message);
      console.error('Error creating account:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card
        bgcolor="primary"
        header={<div className="text-center">Create Account</div>}
        status={status}
        body={
          <>
            Name<br/>
            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} /><br/>
            Email<br/>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} /><br/>
            Password<br/>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} /><br/>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-light" onClick={handleCreateAccount}>Create Account</button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default CreateAccount;