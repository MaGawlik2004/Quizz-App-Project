import Link from "next/link";
import "../styles/home_page.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head />
      <body>
        <header>
          <h1>Quizz App</h1>
          <ul>
            <>
              <li>
                <Link href="register">Sing Up</Link>
              </li>
              <li>
                <Link href="login">Login</Link>
              </li>
            </>
          </ul>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
