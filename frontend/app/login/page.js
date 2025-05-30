// "use client";

// import { useContext, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { AuthContext } from "../context/AuthContext";

// export default function LoginPage() {
//   const { isAuthenticated, login, token } = useContext(AuthContext);
//   const router = useRouter();

//   useEffect(() => {
//     if (isAuthenticated) {
//       // Jeśli już zalogowany - przekieruj do profilu lub strony głównej
//       router.push("/profile");
//     } else {
//       // Jeśli nie zalogowany, wywołaj login (jeśli ta funkcja jest poprawnie zdefiniowana)
//       if (login) {
//         login();
//       }
//     }
//   }, [isAuthenticated, login, router]);

//   return <p>Przekierowuje do logowania...</p>;
// }

"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { isAuthenticated, login, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && token) {
      // Parsujemy token jeśli nie masz już zrobione
      const parsedToken = JSON.parse(atob(token.split(".")[1]));

      const roles = parsedToken?.realm_access?.roles || [];

      if (roles.includes("admin")) {
        router.push("http://localhost:4000"); // lub /admin-panel jeśli SSR app działa pod konkretną ścieżką
      } else {
        router.push("/profile");
      }
    } else {
      // Jeśli nie zalogowany, uruchamiamy Keycloak login
      if (login) {
        login();
      }
    }
  }, [isAuthenticated, login, router, token]);

  return <p>Przekierowuje do logowania...</p>;
}
