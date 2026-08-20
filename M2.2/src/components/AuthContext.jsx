import { createContext, useState, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loginStatus, setLoginStatus] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [admin, setAdmin] = useState(false);
  return (
    <AuthContext.Provider value={{ loginStatus, setLoginStatus, admin, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
