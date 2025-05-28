const { pool } = require("../config/db");
const {
  createQuizzSchema,
  updateQuizzSchema,
} = require("../schema/quizzSchema");

const createQuizzModel = async (quizzData) => {
  try {
    const { error, value } = createQuizzSchema.validate(quizzData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const {
      name,
      user_id,
      description,
      category_id,
      level_id,
      time_in_minutes,
      is_global,
    } = value;

    const query = `
      INSERT INTO quizz (
      name, user_id, description, category_id, level_id, time_in_minutes, is_global
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, user_id, description, category_id, level_id, time_in_minutes, is_global
    `;

    const values = [
      name,
      user_id,
      description || null,
      category_id,
      level_id,
      time_in_minutes,
      is_global,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating quizz: ${err.message}`);
  }
};

const updateQuizzModel = async (id, quizzData) => {
  try {
    const { error, value } = updateQuizzSchema.validate(quizzData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const existingQuizz = await getQuizzByIdModel(id);
    if (!existingQuizz) return null;

    const fileds = [];
    const values = [];
    let paramCount = 1;

    if (value.name !== undefined) {
      fileds.push(`name = $${paramCount++}`);
      values.push(value.name);
    }

    if (value.description !== undefined) {
      fileds.push(`description = $${paramCount++}`);
      values.push(value.description ?? null);
    }

    if (value.category_id !== undefined) {
      fileds.push(`category_id = $${paramCount++}`);
      values.push(value.category_id);
    }

    if (value.level_id !== undefined) {
      fileds.push(`level_id = $${paramCount++}`);
      values.push(value.level_id);
    }

    if (value.time_in_minutes !== undefined) {
      fileds.push(`time_in_minutes = $${paramCount++}`);
      values.push(value.time_in_minutes);
    }

    if (value.is_global !== undefined) {
      fileds.push(`is_global = $${paramCount++}`);
      values.push(value.is_global);
    }

    if (fileds.length === 0) return existingQuizz;

    values.push(id);

    const query = `
      UPDATE quizz
      SET ${fileds.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, name, user_id, description, category_id, level_id, time_in_minutes, is_global
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating quizz: ${err.message}`);
  }
};

const deleteQuizzModel = async (id) => {
  try {
    const existingQuizz = await getQuizzByIdModel(id);
    if (!existingQuizz) return null;

    const query = `
      DELETE FROM quizz
      WHERE id = $1
      RETURNING id, name, user_id, description, category_id, level_id, time_in_minutes, is_global
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting quizz: ${err.message}`);
  }
};

const getQuizzByIdModel = async (id) => {
  try {
    const query = `
      SELECT 
        q.id, q.name AS quizz_name, q.user_id, q.description, q.category_id, c.name AS category_name , q.level_id, l.name AS level_name, q.time_in_minutes, q.is_global
      FROM quizz q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN level l ON q.level_id = l.id
      WHERE q.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching quizz: ${err.message}`);
  }
};

const getAllQuizzModel = async (options = {}) => {
  try {
    const { is_global } = options;

    let query = `
      SELECT q.id, q.name, q.user_id, q.description, q.category_id, c.name AS category_name,
       q.level_id, l.name AS level_name, q.time_in_minutes, q.is_global
      FROM quizz q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN level l ON q.level_id = l.id
    `;

    const values = [];
    if (typeof is_global === "boolean") {
      query += "WHERE q.is_global = $1";
      values.push(is_global);
    }

    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching quizz: ${err.message}`);
  }
};

const getAllQuizzByUserModel = async (user_id) => {
  try {
    const query = `
      SELECT q.id, q.name, q.user_id, q.description, q.category_id, c.name AS category_name,
             q.level_id, l.name AS level_name, q.time_in_minutes, q.is_global
      FROM quizz q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN level l ON q.level_id = l.id
      WHERE q.user_id = $1
    `;

    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching user's quizzes: ${err.message}`);
  }
};

const getFullQuizzByIdModel = async (id) => {
  try {
    const quizzQuery = `
      SELECT q.id, q.name, q.user_id, q.description, q.category_id, c.name AS category_name,
        q.level_id, l.name AS level_name, q.time_in_minutes, q.is_global
      FROM quizz q
      LEFT JOIN categories c ON q.category_id = c.id
      LEFT JOIN level l ON q.level_id = l.id
      WHERE q.id = $1
    `;

    const questionQuery = `
      SELECT qt.name AS type, q.id, q.query
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

    const [quizzResult, questionResult, answerResult] = await Promise.all([
      pool.query(quizzQuery, [id]),
      pool.query(questionQuery, [id]),
      pool.query(answersQuery, [id]),
    ]);

    if (quizzResult.rows.length === 0) return null;

    const questions = questionResult.rows.map((question) => ({
      ...question,
      answers: answerResult.filter((a) => a.question_id === question.id),
    }));

    return {
      ...quizzResult.rows[0],
      questions,
    };
  } catch (err) {
    throw new Error(`Error fetching full quiz: ${err.message}`);
  }
};

const countQuizzesByUserModel = async (user_id) => {
  try {
    const query = `
      SELECT COUNT(*) AS total
      FROM quizz
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [user_id]);
    return parseInt(result.rows[0].total, 10);
  } catch (err) {
    throw new Error(`Error counting quizzes: ${err.message}`);
  }
};

module.exports = {
  createQuizzModel,
  updateQuizzModel,
  deleteQuizzModel,
  getQuizzByIdModel,
  getAllQuizzModel,
  getAllQuizzByUserModel,
  getFullQuizzByIdModel,
  countQuizzesByUserModel,
};
