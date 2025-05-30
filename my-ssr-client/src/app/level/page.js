export const dynamic = "force-dynamic";

import Link from "next/link";
import { revalidatePath } from "next/cache";

async function deleteLevel(formData) {
  "use server";
  const id = formData.get("id");

  const res = await fetch(`http://localhost:4003/level/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete level with ID ${id}`);
  }

  revalidatePath("/level");
}

async function getLevels() {
  const res = await fetch("http://localhost:4003/level", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch levels");

  const data = await res.json();
  return data.levels;
}

export default async function LevelsPage() {
  const levels = await getLevels();

  return (
    <section>
      <h1>Levels</h1>
      <Link href="/addLevel">
        <button className="bg-green-500 px-2 py-1 rounded text-white mb-4">
          Add Level
        </button>
      </Link>

      <ul className="space-y-2">
        {levels.map((level) => (
          <li key={level.id} className="flex items-center gap-4">
            <span>{level.name}</span>

            <Link href={`/level/${level.id}`}>
              <button className="bg-yellow-500 px-2 py-1 rounded text-white">
                Edit
              </button>
            </Link>

            <form action={deleteLevel}>
              <input type="hidden" name="id" value={level.id} />
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
