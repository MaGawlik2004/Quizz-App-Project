"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && token) {
      const parsedToken = JSON.parse(atob(token.split(".")[1]));

      const roles = parsedToken?.realm_access?.roles || [];

      if (roles.includes("admin")) {
        router.push("http://localhost:4000");
      } else {
        router.push("/profile");
      }
    } else {
      if (login) {
        login();
      }
    }
  }, [isAuthenticated, login, router, token]);

  return <p>Przekierowuje do logowania...</p>;
}
