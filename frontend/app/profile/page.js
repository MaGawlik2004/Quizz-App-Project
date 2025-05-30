"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { profile, keycloak, token } = useContext(AuthContext);

  const handleLogout = () => {
    if (keycloak?.idToken) {
      keycloak.logout({
        redirectUri: "http://localhost:3000/",
        idTokenHint: keycloak.idToken,
      });
    } else {
      // fallback
      window.location.href = `http://localhost:8080/realms/quizz-app/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(
        "http://localhost:3000/"
      )}`;
    }
  };

  const isAdmin = useMemo(() => {
    if (!token) return false;
    try {
      const parsed = JSON.parse(atob(token.split(".")[1]));
      return parsed?.realm_access?.roles?.includes("admin");
    } catch (e) {
      return false;
    }
  }, [token]);

  if (!profile) return <p>Ładowanie...</p>;

  return (
    <div className="profile-container">
      <h1>Witaj, {profile.preferred_username}!</h1>

      <button onClick={handleLogout}>Wyloguj</button>

      <Link href="/">
        <button>Home</button>
      </Link>

      {isAdmin && (
        <Link href="http://localhost:4000">
          <button className="bg-blue-500 text-white rounded px-4 py-2 mt-4">
            Przejdź do panelu admina
          </button>
        </Link>
      )}
    </div>
  );
}
