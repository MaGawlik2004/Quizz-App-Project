"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Jeśli już zalogowany - przekieruj do profilu lub strony głównej
      router.push("/profile");
    } else {
      // Jeśli nie zalogowany, wywołaj login (jeśli ta funkcja jest poprawnie zdefiniowana)
      if (login) {
        login();
      }
    }
  }, [isAuthenticated, login, router]);

  return <p>Przekierowuje do logowania...</p>;
}
