const Joi = require("joi");

const createQuizzSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nazwa quizzu nie może być pusta.",
    "string.max": "Nazwa quizzu nie może przekraczać {#limit} znaków",
    "any.required": "Nazwa quizzu jest wymagana.",
  }),
  user_id: Joi.string().required().messages({
    "any.required": "Id użytkownika jest wymagane.",
  }),
  description: Joi.string().allow("", null),
  category_id: Joi.number().integer().positive().required().messages({
    "any.required": "Kategoria jest wymagana.",
  }),
  level_id: Joi.number().integer().positive().required().messages({
    "any.required": "Poziom jest wymagany",
  }),
  time_in_minutes: Joi.number().positive().required().messages({
    "number.base": "Czas musi być podany jako liczba minut.",
    "number.positive": "Czas musi być większy od zera",
    "any.required": "Czas jest wymagany",
  }),
  is_global: Joi.boolean().required().messages({
    "any.required": "Dostępność musi być podana.",
  }),
});

const updateQuizzSchema = Joi.object({
  name: Joi.string().trim().max(100).messages({
    "string.max": "Nazwa quizzu nie może przekraczać {#limit} znaków",
  }),
  user_id: Joi.string(),
  description: Joi.string().allow("", null),
  category_id: Joi.number().integer().positive(),
  level_id: Joi.number().integer().positive(),
  time_in_minutes: Joi.number().positive().messages({
    "number.base": "Czas musi być podany jako liczba minut.",
    "number.positive": "Czas musi być większy od zera",
  }),
  is_global: Joi.boolean(),
});

module.exports = {
  createQuizzSchema,
  updateQuizzSchema,
};
