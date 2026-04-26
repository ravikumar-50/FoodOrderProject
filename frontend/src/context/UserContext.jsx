import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const login = (email, password) => {
    // Mocking an authentication login
    const mockUser = {
      id: "usr_1234",
      name: email.split('@')[0],
      email: email,
      avatar: "https://ui-avatars.com/api/?name=" + email.split('@')[0] + "&background=22c55e&color=fff",
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  const register = (name, email, password) => {
     // Mocking an authentication registration
     const mockUser = {
      id: "usr_" + Math.floor(Math.random() * 10000),
      name: name,
      email: email,
      avatar: "https://ui-avatars.com/api/?name=" + name + "&background=22c55e&color=fff",
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  };

  const updateProfile = (name, email, avatar) => {
    setUser((prev) => {
      const updatedUser = { 
        ...prev, 
        name, 
        email, 
        avatar: avatar || prev.avatar 
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {

    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, register, updateProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};
