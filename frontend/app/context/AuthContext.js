import { createContext, useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const keycloakRef = useRef(null);

  useEffect(() => {
    if (!keycloakRef.current) {
      keycloakRef.current = new Keycloak({
        url: "http://localhost:8080",
        realm: "quizz-app",
        clientId: "frontend-client",
      });
    }

    keycloakRef.current
      .init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloakRef.current.token);
          setProfile(keycloakRef.current.tokenParsed);
        }
      })
      .finally(() => {
        setIsInitialized(true); // <- Ustaw flagę jak Keycloak się zainicjalizuje
      });
  }, []);

  const login = () => {
    if (keycloakRef.current) {
      keycloakRef.current.login();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        profile,
        login,
        keycloak: keycloakRef.current,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
