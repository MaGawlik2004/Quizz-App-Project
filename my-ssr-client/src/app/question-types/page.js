export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";

async function getQuestionTypes() {
  const res = await fetch("http://localhost:4003/question-type", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

  const data = await res.json();
  return data.questionTypes;
}

export default async function QuestionTypesPage() {
  const questionTypes = await getQuestionTypes();

  async function deleteQuestionType(formData) {
    "use server";
    const id = formData.get("id");

    const res = await fetch(`http://localhost:4003/question-type/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    redirect("/question-types");
  }

  return (
    <section>
      <h1>Question Types</h1>
      <Link href="/addQuestionType">
        <button className="bg-blue-500 px-2 py-1 rounded text-white">
          Add Question Type
        </button>
      </Link>
      <ul className="mt-4 space-y-2">
        {questionTypes.map((qt) => (
          <li key={qt.id} className="flex items-center space-x-2">
            <span>{qt.name}</span>

            <Link href={`/question-types/${qt.id}`}>
              <button className="bg-yellow-500 px-2 py-1 rounded text-white">
                Edit
              </button>
            </Link>

            <form action={deleteQuestionType}>
              <input type="hidden" name="id" value={qt.id} />
              <button
                type="submit"
                className="bg-red-500 px-2 py-1 rounded text-white"
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
