"use client";

import { useState, useEffect } from "react";

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

  if (!userData) return <div>Brak dostępu lub brak danych.</div>;

  return (
    <div>
      <h1>Witaj, {userData.username}</h1>
    </div>
  );
}
