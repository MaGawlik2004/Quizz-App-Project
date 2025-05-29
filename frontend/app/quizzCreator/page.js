"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import * as yup from "yup";
import { Formik, Field, Form, FieldArray } from "formik";
import Link from "next/link";

const validationSchema = yup.object().shape({
  name: yup.string().max(100).required("Quizz name is required"),
  description: yup.string(),
  time_in_minutes: yup.number().positive().required("Quizz time is required"),
  is_global: yup.boolean().required("Quizz publicy is required"),
  category_id: yup.number().required(),
  level_id: yup.number().required(),
  questions: yup.array().of(
    yup.object({
      query: yup.string().max(255).required("Wymagana treść pytania"),
      type_id: yup.number().required("Wymagany typ pytania"),
      answers: yup.array().of(
        yup.object({
          text: yup.string().max(255).required("Wymagana treść odpowiedzi"),
          is_answer: yup.boolean(),
        })
      ),
    })
  ),
});

export default function quizzCreator() {
  const [allCategories, setAllCategories] = useState([]);
  const [allLevels, setAllLevels] = useState([]);
  const [allQuestionTypes, setAllQuestionTypes] = useState([]);

  const { token, profile } = useContext(AuthContext);

  async function SendJsonToQuizzApi(data, { resetForm }) {
    try {
      console.log("PEŁNY payload z pytaniami:", data);
      const payload = {
        name: data.name,
        description: data.description,
        category_id: data.category_id,
        level_id: data.level_id,
        time_in_minutes: data.time_in_minutes,
        is_global: data.is_global,
      };

      console.log("Sending to API:", payload);

      const quizzResponse = await fetch("http://localhost:4003/quizz/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!quizzResponse.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdQuizz = await quizzResponse.json();
      const quizz_id = createdQuizz.quizz.id;
      console.log("Created quizz with ID:", quizz_id);

      for (const question of data.questions) {
        const questionPayload = {
          query: question.query,
          type_id: question.type_id,
          quizz_id: quizz_id,
        };

        const questionResponse = await fetch(
          "http://localhost:4003/question/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(questionPayload),
          }
        );

        if (!questionResponse.ok) {
          throw new Error(
            `Question creatio failed: ${questionResponse.status}`
          );
        }

        const createdQuestion = await questionResponse.json();
        const question_id = createdQuestion.question.id;
        console.log("Created question with ID:", question_id);

        for (const answer of question.answers) {
          const answerPayload = {
            text: answer.text,
            is_answer: answer.is_answer,
            question_id: question_id,
          };

          const answerResponse = await fetch(
            "http://localhost:4003/answer/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(answerPayload),
            }
          );

          if (!answerResponse.ok) {
            throw new Error(`Answer creation failes: ${answerResponse.status}`);
          }

          console.log("Answer created");
        }
      }

      console.log("Wszystko dodane");
      resetForm();
      fetchAllCategories();
    } catch (error) {
      console.error(`Error sending quizz data to API:`, error);
    }
  }

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
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchAllLevels();
  }, []);

  useEffect(() => {
    fetchAllQuestionTypes();
  }, []);
  return (
    <Formik
      initialValues={{
        name: "",
        description: "",
        time_in_minutes: 10,
        is_global: false,
        category_id: "",
        level_id: "",
        questions: [],
      }}
      validationSchema={validationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values, helpers) => {
        SendJsonToQuizzApi(values, helpers);
      }}
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
            onChange={(e) => setFieldValue("level_id", Number(e.target.value))}
          >
            <option value={0}>Chose Level</option>
            {allLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </Field>

          <FieldArray name="questions">
            {({ push: pushQuestion, remove: removeQuestion }) => (
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
                      {({ push: pushAnswer, remove: removeAnswer }) => (
                        <div>
                          {(values.questions[qi].answers || []).map((a, ai) => (
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
                                onClick={() => removeAnswer(ai)}
                              >
                                Usuń odpowiedź
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              pushAnswer({ text: "", is_answer: false })
                            }
                          >
                            Dodaj odpowiedź
                          </button>
                        </div>
                      )}
                    </FieldArray>

                    <button type="button" onClick={() => removeQuestion(qi)}>
                      Usuń pytanie
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    pushQuestion({ query: "", type_id: 1, answers: [] })
                  }
                >
                  Dodaj pytanie
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit">Wyślij quiz</button>
          <Link href="/">Wróć</Link>
        </Form>
      )}
    </Formik>
  );
}
