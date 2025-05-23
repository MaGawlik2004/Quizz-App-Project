import Link from "next/link";
import "../styles/home_page.css";
import AuthProvider from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head />
      <body>
        <AuthProvider>
          <header>
            <h1>Quizz App</h1>
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
