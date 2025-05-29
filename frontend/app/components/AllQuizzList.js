"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const QuizzLst = () => {
  const [quizzes, setQuizzes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4003/quizz");
        if (!response.ok) {
          throw new Error("Błąd podczas pobierania produktów");
        }
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (err) {
        console.error("Błąd:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div>
        {quizzes.map((quizz) => (
          <div key={quizz.id}>
            <h3>{quizz.name}</h3>
            <p>{quizz.description}</p>
            <small>{quizz.time_in_minutes} min</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizzLst;
