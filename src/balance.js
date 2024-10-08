import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { Card } from './context';
import { useNavigate } from 'react-router-dom';

function Balance() {
  const { user, loading } = useContext(UserContext);
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's balance when the component mounts
    async function fetchBalance() {
      if (!user) return; // Exit if no user is logged in

      try {
        const response = await fetch(`/account/balance/${user.email}`); // GET request to retrieve balance

        if (!response.ok) {
          throw new Error('Failed to fetch balance.');
        }

        const data = await response.json();
        setBalance(data.balance); // Update balance state with fetched balance
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }

    fetchBalance(); // Call the function to fetch balance
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center">
        <Card
          bgcolor="warning"
          header={<div className="text-center">Balance</div>}
          status="User not logged in or session expired"
          body={
            <>
              <h5>Please log in to view your balance.</h5>
              <button className="btn btn-light" onClick={() => navigate('/login')}>
                Login
              </button>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <Card
        bgcolor="info"
        header={<div className="text-center">Balance</div>}
        body={
          <>
            <h5>Welcome, {user?.email}</h5>
            <h5>Your current balance is:</h5>
            {/* Only Center the Dollar Amount */}
            <div style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '20px 0' }}>
              ${balance !== null ? balance : 'Loading...'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button className="btn btn-light" onClick={() => navigate('/deposit')}>
                Deposit
              </button>
              <button className="btn btn-light" onClick={() => navigate('/withdraw')}>
                Withdraw
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default Balance;
