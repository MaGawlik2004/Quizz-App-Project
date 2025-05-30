export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default function AddQuestionTypePage() {
  async function handleAddQuestionType(formData) {
    "use server";
    const name = formData.get("name");

    const res = await fetch("http://localhost:4003/question-type", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to create question type");

    redirect("/question-types");
  }

  return (
    <form action={handleAddQuestionType}>
      <h1>Add Question Type</h1>
      <input
        type="text"
        name="name"
        placeholder="Question type name"
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
        <a href="/question-types">
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
