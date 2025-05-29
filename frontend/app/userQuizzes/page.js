"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

export default function uesrQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizzCount, setQuizzCount] = useState(0);
  const { token, profile } = useContext(AuthContext);

  const handelDelete = async (quizz_id) => {
    try {
      const response = await fetch(
        `http://localhost:4003/quizz/delete/${quizz_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`);
      }

      const result = await response.json();
      await fetchUesrQuizzes();
      await fetchUesrQuizzesCount();
      console.log(result);

      setQuizzes((prevQuizz) =>
        prevQuizz.filter((quizz) => quizz.id !== quizz_id)
      );
    } catch (err) {
      console.error(`Error while deletein quizz: ${err}`);
    }
  };

  const fetchUesrQuizzes = async () => {
    try {
      const response = await fetch(`http://localhost:4003/quizz/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało sie pobrać quizów użytkownika");
      }

      const data = await response.json();
      setQuizzes(data.quizzes);
    } catch (err) {
      console.error("Błąd:", err);
    }
  };

  const fetchUesrQuizzesCount = async () => {
    try {
      const response = await fetch(`http://localhost:4003/quizz/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało sie policzyć quizów użytkownika");
      }

      const data = await response.json();
      setQuizzCount(data.count);
    } catch (err) {
      console.error("Błąd:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUesrQuizzes();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUesrQuizzesCount();
    }
  }, [token]);

  return (
    <div>
      <h2>Liczba Quizzów {quizzCount}</h2>
      <h2>Moje Quizzy</h2>
      {quizzes.map((quizz) => (
        <div key={quizz.id}>
          <h3>{quizz.name}</h3>
          <p>{quizz.description}</p>
          <p>Czas: {quizz.time_in_minutes} minut</p>
          <Link href={`/userQuizzes/${quizz.id}`}>
            <button>Edit</button>
          </Link>
          <button onClick={() => handelDelete(quizz.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
