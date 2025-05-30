import Link from "next/link";

export default async function HomePage() {
  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Witamy w Quizz-App! 🎉</h1>
      <p className="mb-6 text-gray-700">
        To aplikacja do zarządzania quizami, kategoriami, poziomami i nie tylko.
      </p>
      <section>
        <h2 className="text-xl font-semibold mb-2">Nawigacja</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/categories" className="text-blue-600 hover:underline">
              Zarządzaj kategoriami
            </Link>
          </li>
          <li>
            <Link href="/level" className="text-blue-600 hover:underline">
              Zarządzaj poziomami
            </Link>
          </li>
          <li>
            <Link
              href="/question-types"
              className="text-blue-600 hover:underline"
            >
              Zarządzaj typami pytań
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
