import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem('selectedCurrency') || 'USD');

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('selectedCurrency', newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);