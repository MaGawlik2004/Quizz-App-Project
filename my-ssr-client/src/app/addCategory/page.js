import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AddCategoryPage() {
  return (
    <section className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dodaj kategorię</h1>

      <form
        action={async (formData) => {
          "use server";

          const name = formData.get("name");

          const res = await fetch("http://localhost:4003/category", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
          });

          if (!res.ok) {
            throw new Error("Nie udało się dodać kategorii");
          }

          const { redirect } = await import("next/navigation");
          redirect("/categories");
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Nazwa kategorii
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full border px-3 py-2 rounded shadow-sm"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Dodaj kategorię
          </button>

          <Link
            href="/categories"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Powrót
          </Link>
        </div>
      </form>
    </section>
  );
}
