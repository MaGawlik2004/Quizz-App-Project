"use client";

import { createContext, useEffect, useState } from "react";
import keycloak from "../lib/keycloak";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      setIsAuthenticated(authenticated);
      setToken(keycloak.token);
      setProfile(keycloak.tokenParsed);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, profile, keycloak }}>
      {children}
    </AuthContext.Provider>
  );
}
