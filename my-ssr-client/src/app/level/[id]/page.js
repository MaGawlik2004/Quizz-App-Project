export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

async function getLevelById(id) {
  const res = await fetch(`http://localhost:4003/level/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Level not found");

  return res.json();
}

export default async function EditLevelPage({ params }) {
  const level = await getLevelById(params.id);

  async function updateLevel(formData) {
    "use server";
    const name = formData.get("name");

    const res = await fetch(`http://localhost:4003/level/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to update level");

    redirect("/level");
  }

  return (
    <form action={updateLevel}>
      <h1>Edit Level</h1>
      <input
        type="text"
        name="name"
        defaultValue={level.name}
        required
        className="border px-2 py-1"
      />
      <div className="space-x-2 mt-4">
        <button
          type="submit"
          className="bg-yellow-500 px-2 py-1 rounded text-white"
        >
          Update
        </button>
        <a href="/levels">
          <button
            type="button"
            className="bg-gray-500 px-2 py-1 rounded text-white"
          >
            Cancel
          </button>
        </a>
      </div>
    </form>
  );
}
