export const dynamic = "force-dynamic";

import Link from "next/link";
import { revalidatePath } from "next/cache";

async function deleteCategory(formData) {
  "use server";

  const id = formData.get("id");

  const res = await fetch(`http://localhost:4003/category/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete category with ID ${id}`);
  }

  revalidatePath("/categories");
}

async function getCategories() {
  const res = await fetch("http://localhost:4003/category", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error fetching categories: ${res.status}`);
  }

  const data = await res.json();
  return data.categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section>
      <h1>Category</h1>
      <Link href="/addCategory">
        <button>Add Category</button>
      </Link>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>
            {cat.name}
            <Link href={`/categories/${cat.id}`}>
              <button className="bg-yellow-500 px-2 py-1 rounded text-white">
                Edytuj
              </button>
            </Link>

            <form action={deleteCategory}>
              <input type="hidden" name="id" value={cat.id} />
              <button
                type="submit"
                className="bg-red-600 px-2 py-1 rounded text-white"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
