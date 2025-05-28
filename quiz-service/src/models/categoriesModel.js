const { pool } = require("../config/db");
const {
  createCategorieSchema,
  updateCategorieSchema,
} = require("../schema/categoriesSchema");

const createCategoryModel = async (categoryData) => {
  try {
    const { error, value } = createCategorieSchema.validate(categoryData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const { name } = value;

    const query =
      "INSERT INTO categories (name) VALUES ($1) RETURNING id, name";

    const values = [name];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error creating category: ${err.message}`);
  }
};

const updateCategoryModel = async (id, categoryData) => {
  try {
    const { error, value } = updateCategorieSchema.validate(categoryData, {
      abortEarly: false,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(`Błąd walidacji: ${messages}`);
    }

    const existingCategory = await getCategoryByIdModel(id);
    if (!existingCategory) return null;

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
        UPDATE categories 
        SET ${fields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING id, name
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error updating category: ${err.message}`);
  }
};

const deleteCategoryModel = async (id) => {
  try {
    const existingCategory = await getCategoryByIdModel(id);
    if (!existingCategory) return null;

    const query = `
            DELETE FROM categories 
            WHERE id = $1
            RETURNING id, name
        `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error deleting category: ${err.message}`);
  }
};

const getCategoryByIdModel = async (id) => {
  try {
    const query = `
            SELECT * FROM categories
            WHERE id = $1
        `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching cateogry: ${err.message}`);
  }
};

const getAllCategoriesModel = async () => {
  try {
    const query = `
            SELECT * FROM categories
        `;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw new Error(`Error fetching categories: ${err.message}`);
  }
};

const getCategoryByNameModel = async (name) => {
  try {
    const query = `
            SELECT * FROM categories
            WHERE name = $1
        `;

    const result = await pool.query(query, [name]);
    return result.rows[0];
  } catch (err) {
    throw new Error(`Error fetching cateogry: ${err.message}`);
  }
};

module.exports = {
  createCategoryModel,
  updateCategoryModel,
  deleteCategoryModel,
  getCategoryByIdModel,
  getAllCategoriesModel,
  getCategoryByNameModel,
};
