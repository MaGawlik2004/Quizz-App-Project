import { Inter } from "next/font/google";
import Link from "next/link";
import { User } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Quizz App",
  description: "Zarządzaj quizami i kategoriami",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className={inter.className + " bg-gray-50 text-gray-900"}>
        <header className="bg-white shadow mb-6">
          <nav className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-600">Quizz App</h1>
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Strona główna
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:underline">
                  Kategorie
                </Link>
              </li>
              <li>
                <Link href="/level" className="hover:underline">
                  Poziomy
                </Link>
              </li>
              <li>
                <Link href="/question-types" className="hover:underline">
                  Typy pytań
                </Link>
              </li>
              <li>
                <Link href="http://localhost:3000/profile" prefetch={false}>
                  <User size={24} />
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
