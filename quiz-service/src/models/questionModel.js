const { pool } = require("../config/db");
const {
  createQuestionSchema,
  updateQuestionSchema,
} = require("../schema/questionSchema");

const createQuestionModel = async (questionData) => {
  try {
    const { error, value } = createQuestionSchema.validate(questionData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { type_id, query, quizz_id } = value;

    const questionQuery = `
      INSERT INTO question (
        type_id, query, quizz_id
      ) VALUES ($1, $2, $3)
       RETURNING id, type_id, query, quizz_id
    `;

    const values = [type_id, query, quizz_id];

    const result = await pool.query(questionQuery, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating question: ${err.message}`);
  }
};

const updateQuestionModel = async (id, questionData) => {
  try {
    const { error, value } = updateQuestionSchema.validate(questionData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const exisitingQuestion = await getQuestionByIdModel(id);
    if (!exisitingQuestion) return null;

    const fileds = [];
    const values = [];
    let paramCount = 1;

    if (value.type_id !== undefined) {
      fileds.push(`type_id = $${paramCount++}`);
      values.push(value.type_id);
    }

    if (value.query !== undefined) {
      fileds.push(`query = $${paramCount++}`);
      values.push(value.query);
    }

    if (fileds.length === 0) return exisitingQuestion;

    values.push(id);

    const questionQuery = `
      UPDATE question
      SET ${fileds.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, type_id, query, quizz_id
    `;

    const result = await pool.query(questionQuery, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating question: ${err.message}`);
  }
};

const deleteQuestionModel = async (id) => {
  try {
    const exisitingQuestion = await getQuestionByIdModel(id);
    if (!exisitingQuestion) return null;

    const query = `
      DELETE FROM question
      WHERE id = $1
      RETURNING id, type_id, query, quizz_id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting question: ${err.message}`);
  }
};

const getAllQuestionByQuizzIdModel = async (quizz_id) => {
  try {
    const query = `
      SELECT qt.id, qt.type_id, t.name AS type_name, qt.query, qt.quizz_id, q.name AS quizz_name
      FROM question qt
      LEFT JOIN question_type t ON qt.type_id = t.id
      LEFT JOIN quizz q ON qt.quizz_id = q.id
      WHERE qt.quizz_id = $1
    `;

    const result = await pool.query(query, [quizz_id]);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching questions: ${err.message}`);
  }
};

const getQuestionByIdModel = async (id) => {
  try {
    const query = `
      SELECT qt.id, qt.type_id, t.name AS type_name, qt.query, qt.quizz_id, q.name AS quizz_name
      FROM question qt
      LEFT JOIN question_type t ON qt.type_id = t.id
      LEFT JOIN quizz q ON qt.quizz_id = q.id
      WHERE qt.id = $1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching question: ${err.message}`);
  }
};

const getQuestionsWithAnswersByQuizIdModel = async (quizz_id) => {
  try {
    const questionQuery = `
      SELECT q.id, q.query, qt.name AS type_name
      FROM question q
      LEFT JOIN question_type qt ON q.type_id = qt.id
      WHERE q.quizz_id = $1
    `;

    const answersQuery = `
      SELECT a.id, a.text, a.is_answer, a.question_id
      FROM answer a
      WHERE a.question_id IN (
        SELECT id FROM question WHERE quizz_id = $1
      )
    `;

    const [questionResult, answerResult] = await Promise.all([
      pool.query(questionQuery, [quizz_id]),
      pool.query(answersQuery, [quizz_id]),
    ]);

    const questions = questionResult.rows.map((question) => ({
      ...question,
      answers: answerResult.filter((a) => a.question_id === question.id),
    }));

    return questions;
  } catch (err) {
    throw new Error(`Error fetching questions with answers: ${err.message}`);
  }
};

module.exports = {
  createQuestionModel,
  updateQuestionModel,
  deleteQuestionModel,
  getAllQuestionByQuizzIdModel,
  getQuestionByIdModel,
  getQuestionsWithAnswersByQuizIdModel,
};
