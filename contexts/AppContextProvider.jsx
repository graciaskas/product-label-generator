"use client";
import { createContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

// Crée un contexte avec une valeur par défaut 'light'
export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, []);

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
  const values = { users, getUsers, session, user };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}
