import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getCategory(id) {
  const res = await fetch(`http://localhost:4003/category/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch category");

  return res.json();
}

export default async function EditCategoryPage({ params }) {
  const { id } = params;
  const category = await getCategory(id);

  async function updateCategoryAction(formData) {
    "use server";
    const name = formData.get("name");

    const res = await fetch(`http://localhost:4003/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      throw new Error("Update failed");
    }

    redirect("/categories");
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Edytuj kategorię</h1>
      <form action={updateCategoryAction} className="space-y-4">
        <input
          name="name"
          defaultValue={category.name}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Zaktualizuj
          </button>
          <a
            href="/categories"
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Wróć
          </a>
        </div>
      </form>
    </div>
  );
}
