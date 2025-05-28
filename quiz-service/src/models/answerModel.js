const { pool } = require("../config/db");
const {
  createAnswerSchema,
  updateAnswerSchema,
} = require("../schema/answerSchema");

const createAnswerModel = async (answerData) => {
  try {
    const { error, value } = createAnswerSchema.validate(answerData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji : ${messages}`);
    }

    const { text, is_answer, question_id } = value;

    const query = `
      INSERT INTO answer (
       text, is_answer, question_id
      ) VALUES ($1, $2, $3)
      RETURNING id, text, is_answer, question_id
    `;

    const values = [text, is_answer, question_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating answer: ${err.message}`);
  }
};

const updateAnswerModel = async (id, answerData) => {
  try {
    const { error, value } = updateAnswerSchema.validate(answerData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji : ${messages}`);
    }

    const existingAnswer = await getAnswerByIdModel(id);
    if (!existingAnswer) return null;

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (value.text !== undefined) {
      fields.push(`text = $${paramCount++}`);
      values.push(value.text);
    }

    if (value.is_answer !== undefined) {
      fields.push(`is_answer = $${paramCount}`);
      values.push(value.is_answer);
    }

    if (fields.length === 0) return null;

    values.push(id);

    const query = `
      UPDATE answer
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, text, is_answer, question_id
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating answer: ${err.message}`);
  }
};

const deleteAnswerModel = async (id) => {
  try {
    const existingAnswer = await getAnswerByIdModel(id);
    if (!existingAnswer) return null;

    const query = `
      DELETE FROM answer
      WHERE id = $1
      RETURNING id, text, is_answer, question_id
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting answer: ${err.message}`);
  }
};

const getAnswerByIdModel = async (id) => {
  try {
    const query = `
      SELECT
        a.id, a.text, a.is_answer, a.question_id, qt.query AS question_query
      FROM answer a
      LEFT JOIN question qt ON a.question_id = qt.id
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching answer: ${err.message}`);
  }
};

const getAllAnswersByQuestionIdModel = async (question_id) => {
  try {
    const query = `
      SELECT
        a.id, a.text, a.is_answer, a.question_id, qt.query AS question_query
      FROM answer a
      LEFT JOIN question qt ON a.question_id = qt.id
      WHERE a.question_id = $1
    `;

    const result = await pool.query(query, [question_id]);

    if (result.rows.length === 0) return null;
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching answers: ${err.message}`);
  }
};

const getCorrectAnswersByQuestionIdModel = async (question_id) => {
  try {
    const query = `
      SELECT
        a.id, a.text, a.is_answer, a.question_id, qt.query AS question_query
      FROM answer a
      LEFT JOIN question qt ON a.question_id = qt.id
      WHERE a.question_id = $1 AND is_answer = true
    `;

    const result = await pool.query(query, [question_id]);

    if (result.rows.length === 0) return null;
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching answers: ${err.message}`);
  }
};

module.exports = {
  createAnswerModel,
  updateAnswerModel,
  deleteAnswerModel,
  getAnsweByIdModel,
  getAllAnswersByQuestionIdModel,
  getCorrectAnswersByQuestionIdModel,
};
