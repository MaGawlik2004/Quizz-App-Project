export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function AddLevelPage() {
  async function handleAddLevel(formData) {
    "use server";
    const name = formData.get("name");

    const res = await fetch("http://localhost:4003/level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to create level");

    redirect("/level");
  }

  return (
    <form action={handleAddLevel}>
      <h1>Add Level</h1>
      <input
        type="text"
        name="name"
        placeholder="Level name"
        required
        className="border px-2 py-1"
      />
      <div className="space-x-2 mt-4">
        <button
          type="submit"
          className="bg-blue-500 px-2 py-1 rounded text-white"
        >
          Add
        </button>
        <a href="/level">
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
