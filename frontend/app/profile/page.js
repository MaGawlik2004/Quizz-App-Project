"use client";

import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Brak tokena w localStorage");
      return;
    }

    fetch("http://localhost:4001/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Unauthorized")))
      .then((data) => {
        console.log(data.user);
        setUserData(data.user);
      })
      .catch((err) => {
        console.error(err);
        setUserData(null);
      });
  }, []);

  if (!userData)
    return (
      <div className="profile-container">
        <p className="error-message">Brak dostępu lub brak danych.</p>
      </div>
    );

  return (
    <div className="profile-container">
      <h1>Witaj, {userData.username}!</h1>
      <LogoutButton />
    </div>
  );
}
