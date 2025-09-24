"use client";
import { createContext, useEffect, useState } from "react";

// Crée un contexte avec une valeur par défaut 'light'
export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const values = { users, getUsers };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
