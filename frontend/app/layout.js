"use client";

import Link from "next/link";
import { useContext } from "react";
import "../styles/home_page.css";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import { User } from "lucide-react";

function LayoutContent({ children }) {
  const { keycloak, profile, isInitialized } = useContext(AuthContext);

  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          <h1>Quizz App</h1>
          <ul>
            {!keycloak?.authenticated && isInitialized ? (
              <li>
                <Link href="/login">Zaloguj się</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/quizzCreator">Quizz Creator</Link>
                </li>
                <li>
                  <Link href="/profile">
                    <User size={24} />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
