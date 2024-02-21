
import { createContext, useContext, useState } from 'react';

// Create the context
const UserIdContext = createContext();

// Create a context provider component
export const UserIdProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  // Function to set the user ID
  const setUserIdContext = (newUserId) => {
    setUserId(newUserId);
  };

  return (
    <UserIdContext.Provider value={{ userId, setUserIdContext }}>
      {children}
    </UserIdContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUserId must be used within a UserIdProvider');
  }
  return context;
};
