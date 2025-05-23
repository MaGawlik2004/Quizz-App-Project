"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProfilePage() {
  const { profile, keycloak } = useContext(AuthContext);

  const handleLogout = () => {
    if (keycloak?.idToken) {
      keycloak.logout({
        redirectUri: "http://localhost:3000/",
        idTokenHint: keycloak.idToken,
      });
    } else {
      // fallback (niezalecany)
      window.location.href = `http://localhost:8080/realms/quizz-app/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(
        "http://localhost:3000/"
      )}`;
    }
  };

  if (!profile) return <p>Ładowanie...</p>;

  return (
    <div className="profile-container">
      <h1>Witaj, {profile.preferred_username}!</h1>
      <button onClick={handleLogout}>Wyloguj</button>;
      <Link href="/">
        <button>Home</button>
      </Link>
    </div>
  );
}
