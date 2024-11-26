import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [ user, setUser ] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser): null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const userContextValue = useMemo(() => ({ user, updateUser }));

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);