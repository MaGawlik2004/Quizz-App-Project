export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

async function getQuestionTypeById(id) {
  const res = await fetch(`http://localhost:4003/question-type/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Question type not found");

  return res.json();
}

export default async function EditQuestionTypePage({ params }) {
  const questionType = await getQuestionTypeById(params.id);

  async function updateQuestionType(formData) {
    "use server";
    const name = formData.get("name");

    const res = await fetch(
      `http://localhost:4003/question-type/${params.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );

    if (!res.ok) throw new Error("Failed to update question type");

    redirect("/question-types");
  }

  return (
    <form action={updateQuestionType}>
      <h1>Edit Question Type</h1>
      <input
        type="text"
        name="name"
        defaultValue={questionType.name}
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
