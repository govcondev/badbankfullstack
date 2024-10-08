import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';  

// Create a UserContext to hold the user state
export const UserContext = createContext();

// Create a UserProvider component to wrap the app and manage user state
export function UserProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [balance, setBalance] = useState(0);  
  const [loading, setLoading] = useState(false);  // Add loading state

  useEffect(() => {
    console.log("Setting up Firebase auth state change listener");

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDetails = {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
        };
        setUser(userDetails);
        console.log("User set in context:", userDetails);  // Log user details

        const fetchedBalance = await fetchBalance(userDetails.email);
        setBalance(fetchedBalance);
      } else {
        setUser(null);
        setBalance(0);
        console.log("User logged out or session expired");
      }
      setLoading(false);  // Set loading to false once user state is determined
    });

    return () => {
      console.log("Cleaning up Firebase auth state change listener");
      unsubscribe();
    };
  }, []);

  // Function to fetch the user's balance from the backend
  const fetchBalance = async (email) => {
    try {
      const response = await fetch(`/account/balance/${email}`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      return data.balance || 0;  // Return balance, default to 0 if undefined
    } catch (error) {
      console.error("Error fetching balance in UserContext:", error);
      return 0;  // Default balance to 0 on error
    }
  };

  const updateBalance = async (email, amount) => {
    try {
      const newBalance = balance + amount;
      const response = await fetch('/account/updateBalance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newBalance }),
      });

      if (!response.ok) {throw new Error('Failed to update balance');
      }

      setBalance(newBalance);
      console.log(`New balance set: ${newBalance}`);
    } catch (error) {
      console.error("Error updating balance in UserContext:", error);
    }
  };

  const isAuthenticated = () => typeof user === "object";

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        balance,
        setBalance,
        isAuthenticated,
        updateBalance,
        fetchBalance, // Include fetchBalance in the context value
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
