import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('items');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const [allCart, setAllCart] = useState(() => {
    const savedAllCart = localStorage.getItem('allCart');
    return savedAllCart ? JSON.parse(savedAllCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('allCart', JSON.stringify(allCart));
  }, [allCart]);

  return (
    <UserContext.Provider value={{ items, setItems, allCart, setAllCart }}>
      {children}
    </UserContext.Provider>
  );
};
