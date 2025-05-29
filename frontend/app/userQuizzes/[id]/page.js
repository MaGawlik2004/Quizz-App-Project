"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("Nazwa jest wymagana"),
  description: yup.string().nullable(),
  time_in_minutes: yup
    .number()
    .typeError("Czas musi być liczbą")
    .required("Czas jest wymagany"),

  is_global: yup.boolean(),

  category_id: yup.mixed().required("Wybierz kategorię"),
  level_id: yup.mixed().required("Wybierz poziom"),

  questions: yup.array().of(
    yup.object().shape({
      query: yup.string().required("Treść pytania jest wymagana"),
      type_id: yup.mixed().required("Typ pytania jest wymagany"),

      answers: yup
        .array()
        .of(
          yup.object().shape({
            text: yup.string().required("Treść odpowiedzi jest wymagana"),
            is_answer: yup.boolean().default(false),
          })
        )
        .min(1, "Każde pytanie musi mieć przynajmniej jedną odpowiedź"),
    })
  ),
});

export default function EditQuizzPage() {
  const [quizz, setQuizz] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [allQuestionTypes, setAllQuestionTypes] = useState([]);
  const { id } = useParams();
  const router = useRouter();

  const fetchQuizz = async () => {
    try {
      const response = await fetch(`http://localhost:4003/quizz/full/${id}`);
      const data = await response.json();
      setQuizz({
        id: data.quizz.id,
        name: data.quizz.name,
        description: data.quizz.description,
        time_in_minutes: data.quizz.time_in_minutes,
        is_global: data.quizz.is_global,
        category_id: data.quizz.category_id,
        level_id: data.quizz.level_id,
        questions: data.quizz.questions.map((q) => ({
          id: q.id,
          query: q.query,
          type_id: q.type_id,
          answers: q.answers.map((a) => ({
            id: a.id,
            text: a.text,
            is_answer: a.is_answer,
          })),
        })),
      });
    } catch (error) {
      console.error("Błąd ładowania quizu", error);
    }
  };

  const handleSubmit = async (values) => {
    console.log("ALALALAL");
    try {
      await fetch(`http://localhost:4003/quizz/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          time_in_minutes: values.time_in_minutes,
          is_global: values.is_global,
          category_id: values.category_id,
          level_id: values.level_id,
        }),
      });

      for (const question of values.questions) {
        if (question.id) {
          await fetch(`http://localhost:4003/question/update/${question.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: question.query,
              type_id: question.type_id,
            }),
          });
        } else {
          const res = await fetch(`http://localhost:4003/question/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: question.query,
              type_id: question.type_id,
              quizz_id: quizz.id,
            }),
          });

          const newQuestion = await res.json();
          question.id = newQuestion;
        }

        for (const answer of question.answers) {
          if (answer.id) {
            await fetch(`http://localhost:4003/answer/update/${answer.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: answer.text,
                is_answer: answer.is_answer,
              }),
            });
          } else {
            await fetch(`http://localhost:4003/answer/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: answer.text,
                is_answer: answer.is_answer,
                question_id: question.id,
              }),
            });
          }
        }
      }

      alert("Zaktualizowano quiz!");
      router.push("/userQuizzes");
    } catch (err) {
      console.error("Błąd podczas zapisu:", err);
    }
  };

  const handleDeleteQuestion = async (question_id) => {
    try {
      const response = await fetch(
        `http://localhost:4003/question/delete/${question_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      await fetchQuizz();
    } catch (err) {
      console.error(`Error while deleteing question: ${err}`);
    }
  };

  const handleDeleteAnswer = async (answer_id) => {
    try {
      const response = await fetch(
        `http://localhost:4003/answer/delete/${answer_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP while deleteing answer: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      await fetchQuizz();
    } catch (err) {
      console.error(`Error while deleting question: ${err}`);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await fetch("http://localhost:4003/category");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Fetched categories:", result);

      setAllCategories(result.categories);
    } catch (error) {
      console.error(`Error fetching categories: ${error}`);
    }
  };

  const fetchAllLevels = async () => {
    try {
      const response = await fetch("http://localhost:4003/level");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Fetched levels:", result);

      setAllLevels(result.levels);
    } catch (error) {
      console.error(`Error fetching levels: ${error}`);
    }
  };

  const fetchAllQuestionTypes = async () => {
    try {
      const response = await fetch("http://localhost:4003/question-type");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log("Fetched question types:", result);

      setAllQuestionTypes(result.questionTypes);
    } catch (error) {
      console.error(`Error fetchin question types: ${error}`);
    }
  };

  useEffect(() => {
    fetchQuizz();
  }, [id]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchAllLevels();
  }, []);

  useEffect(() => {
    fetchAllQuestionTypes();
  }, []);

  return (
    <div>
      <h2>Edycja quizu</h2>
      <Formik
        initialValues={{
          name: quizz.name || "",
          description: quizz.description || "",
          time_in_minutes: quizz.time_in_minutes || 10,
          is_global: quizz.is_global || false,
          category_id: quizz.category_id,
          level_id: quizz.level_id,
          questions: quizz.questions || [],
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Field name="name" placeholder="Nazwa quizu" />
            <Field name="description" placeholder="Opis" />
            <Field name="time_in_minutes" type="number" />
            <Field name="is_global" type="checkbox" />

            <Field
              as="select"
              name="category_id"
              onChange={(e) =>
                setFieldValue("category_id", Number(e.target.value))
              }
            >
              <option value={0}>Choose Category</option>
              {allCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Field>

            <Field
              as="select"
              name="level_id"
              onChange={(e) =>
                setFieldValue("level_id", Number(e.target.value))
              }
            >
              <option value={0}>Chose Level</option>
              {allLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </Field>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <div>
                  {values.questions.map((q, qi) => (
                    <div key={qi}>
                      <Field
                        name={`questions[${qi}].query`}
                        placeholder="Pytanie"
                      />
                      <Field
                        as="select"
                        name={`questions[${qi}].type_id`}
                        onChange={(e) =>
                          setFieldValue(
                            `questions[${qi}].type_id`,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value={0}>Chose Question Type</option>
                        {allQuestionTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Field>

                      <FieldArray name={`questions[${qi}].answers`}>
                        {({ push, remove }) => (
                          <>
                            {values.questions[qi].answers.map((a, ai) => (
                              <div key={ai}>
                                <Field
                                  name={`questions[${qi}].answers[${ai}].text`}
                                  placeholder="Odpowiedź"
                                />
                                <Field
                                  name={`questions[${qi}].answers[${ai}].is_answer`}
                                  type="checkbox"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const answerId =
                                      values.questions[qi]?.answers[ai]?.id;
                                    if (answerId) {
                                      await handleDeleteAnswer(answerId);
                                    }
                                    remove(ai);
                                  }}
                                >
                                  Usuń odpowiedź
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                push({ text: "", is_answer: false })
                              }
                            >
                              Dodaj odpowiedź
                            </button>
                          </>
                        )}
                      </FieldArray>
                      <button
                        type="button"
                        onClick={async () => {
                          const questionId = values.questions[qi]?.id;
                          if (questionId) {
                            await handleDeleteQuestion(questionId);
                          }
                          remove(qi);
                        }}
                      >
                        Usuń pytanie
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => push({ query: "", type_id: 1, answers: [] })}
                  >
                    Dodaj pytanie
                  </button>
                </div>
              )}
            </FieldArray>

            <button type="submit">Zapisz zmiany</button>
            <button
              type="button"
              onClick={() => router.push("/userQuizzes")}
              style={{ marginLeft: "1rem" }}
            >
              Anuluj
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
