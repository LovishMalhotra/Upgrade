import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null); // Add userId and setUserId

    return (
        <UserContext.Provider value={{ userRole, setUserRole, userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);