const Joi = require("joi");

const createCategorieSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nazwa kategorii nie może być pusta",
    "string.max": "Nazwa kategorii nie może przekraczać {#limit} znaków",
    "any.required": "Nazwa kategorii jest wymagana",
  }),
});

const updateCategorieSchema = Joi.object({
  name: Joi.string().trim().max(100).messages({
    "string.max": "Nazwa kategorii nie może przekraczać {#limit} znaków",
  }),
});

module.exports = {
  createCategorieSchema,
  updateCategorieSchema,
};
