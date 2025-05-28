const { pool } = require("../config/db");
const {
  createLevelSchema,
  updateLevelSchema,
} = require("../schema/levelSchema");

const createLevelModel = async (levelData) => {
  try {
    const { error, value } = createLevelSchema.validate(levelData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { name } = value;

    const query = `
            INSERT INTO level (name) VALUES ($1) RETURNING id, name
        `;

    const values = [name];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating level: ${err.message}`);
  }
};

const updateLevelModel = async (id, levelData) => {
  try {
    const { error, value } = updateLevelSchema.validate(levelData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const existingLevel = await getLevelByIdModel(id);
    if (!existingLevel) return null;

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
            UPDATE level
            SET ${fields.join(", ")}
            WHERE id = $${paramCount}
            RETURNING id, name
        `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating level: ${err.message}`);
  }
};

const deleteLevelModel = async (id) => {
  try {
    const existingLevel = await getLevelByIdModel(id);
    if (!existingLevel) return null;

    const query = `
            DELETE FROM level 
            WHERE id = $1
            RETURNING id, name
        `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting level: ${err.message}`);
  }
};

const getLevelByIdModel = async (id) => {
  try {
    const query = `
            SELECT * FROM level
            WHERE id = $1
        `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching level: ${err.message}`);
  }
};

const getAllLevelsModel = async () => {
  try {
    const query = `
            SELECT * FROM level
        `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching levels: ${err.message}`);
  }
};

const getLevelByNameModel = async (name) => {
  try {
    const query = `
            SELECT * FROM level
            WHERE name = $1
        `;

    const result = await pool.query(query, [name]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching level: ${err.message}`);
  }
};

module.exports = {
  createLevelModel,
  updateLevelModel,
  deleteLevelModel,
  getLevelByIdModel,
  getAllLevelsModel,
  getLevelByNameModel,
};
