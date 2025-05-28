const { pool } = require("../config/db");
const {
  createQuestionTypeSchema,
  updateQuestionTypeSchema,
} = require("../schema/questionTypeSchema");

const createQuestionTypeModel = async (questionTypeData) => {
  try {
    const { error, value } = createQuestionTypeSchema.validate(
      questionTypeData,
      {
        abortEarly: false,
      }
    );

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { name } = value;

    const query = `
            INSERT INTO question_type (name) VALUES ($1) RETURNING id, name
        `;

    const values = [name];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating question type: ${err.message}`);
  }
};

const updateQuestionTypeModel = async (id, questionTypeData) => {
  try {
    const { error, value } = updateQuestionTypeSchema.validate(
      questionTypeData,
      {
        abortEarly: false,
      }
    );

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const existingQuestionType = await getQuestionTypeByIdModel(id);
    if (!existingQuestionType) return null;

    const fields = [];
    const values = [];
    let paramCount = 1;

    if (value.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(value.name);
    }

    if (fields.length === 0) return null;

    values.push(id);

    const query = `
            UPDATE question_type
            SET ${fields.join(", ")}
            WHERE id = $${paramCount}
            RETURNING id, name
        `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating question type: ${err.message}`);
  }
};

const deleteQuestionTypeModel = async (id) => {
  try {
    const existingQuestionType = await getQuestionTypeByIdModel(id);
    if (!existingQuestionType) return null;

    const query = `
            DELETE FROM question_type
            WHERE id = $1
            RETURNING id, name
        `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting question type: ${err.message}`);
  }
};

const getQuestionTypeByIdModel = async (id) => {
  try {
    const query = `
            SELECT * FROM question_type
            WHERE id = $1
        `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching question type: ${err.message}`);
  }
};

const getAllQuestionTypesModel = async () => {
  try {
    const query = `
            SELECT * FROM question_type
        `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching question types: ${err.message}`);
  }
};

const getQuestionTypeByNameModel = async (name) => {
  try {
    const query = `
            SELECT * FROM question_type
            WHERE name = $1
        `;

    const result = await pool.query(query, [name]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching question type: ${err.message}`);
  }
};

module.exports = {
  createQuestionTypeModel,
  updateQuestionTypeModel,
  deleteQuestionTypeModel,
  getQuestionTypeByIdModel,
  getAllQuestionTypesModel,
  getQuestionTypeByNameModel,
};
