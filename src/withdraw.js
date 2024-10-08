import React, { useState, useEffect, useCallback } from 'react';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { Card } from './context';
import { useNavigate } from 'react-router-dom';

function Withdraw() {
  const { user, balance, updateBalance, fetchBalance, isAuthenticated } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);  // Local loading state
  const [updatingBalance, setUpdatingBalance] = useState(false);  // Separate state to indicate balance update
  const navigate = useNavigate();

  // Fetch updated balance when the component mounts or user state changes
  useEffect(() => {
    if (user?.email) {
      fetchBalance(user.email);
    }
  }, [user?.email, fetchBalance]);

  // Handle the withdraw action with useCallback to prevent unnecessary re-renders
  const handleWithdraw = useCallback(async () => {
    if (loading) return;  // Prevent further API calls if already in progress

    if (amount <= 0) {
      setStatus('Withdrawal amount must be greater than zero.');
      return;
    }

    if (amount > balance) {
      setStatus('Insufficient funds.');
      return;
    }

    setLoading(true);  // Set local loading state to true

    try {
      await updateBalance(user.email, -Number(amount));  // Perform the withdrawal operation
      setStatus(`Successfully withdrew $${amount}.`);

      setUpdatingBalance(true);  // Indicate balance is being updated

      // Use setTimeout to delay balance update by 3 seconds
      setTimeout(async () => {
        await fetchBalance(user.email);  // Fetch updated balance after withdrawal
        setUpdatingBalance(false);  // Reset updating balance state
      }, 3000);

      setAmount('');  // Clear the amount input field after successful withdrawal
    } catch (error) {
      setStatus('Failed to withdraw funds. Please try again later.');
    } finally {
      setLoading(false);  // Ensure loading state is reset
    }
  }, [amount, balance, user.email, updateBalance, fetchBalance, loading]);

  // Show loading state while data is being fetched
  if (loading) return <div>Loading...</div>;

  // Redirect to login if user is not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="d-flex justify-content-center">
        <Card
          bgcolor="warning"
          header={<div className="text-center">Withdraw</div>}
          status="User not logged in or session expired"
          body={
            <>
              <h5>Please log in to withdraw funds.</h5>
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
        header={<div className="text-center">Withdraw</div>}
        status={status}
        body={
          <>
            <h5>Welcome, {user?.email}</h5>
            {/* Display current balance with efficient state management */}
            <h5
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                margin: '20px 0',
              }}
            >
              Your current balance is: ${updatingBalance ? 'Updating...' : balance !== null ? balance : 'Loading...'}
            </h5>
            <h5>Withdrawal Amount:</h5>
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}  // Ensure value is converted to number
            />
            <div className="d-flex justify-content-center mt-3">
              <button className="btn btn-light" onClick={handleWithdraw} disabled={loading}>
                {loading ? 'Processing...' : 'Withdraw'} {/* Show button loading state */}
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}

export default Withdraw;
