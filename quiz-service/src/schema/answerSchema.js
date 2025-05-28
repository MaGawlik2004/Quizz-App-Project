const Joi = require("joi");

const createAnswerSchema = Joi.object({
  text: Joi.string().trim().max(255).required().messages({
    "string.empty": "Odpowiedz nie może być pusta.",
    "string.max":
      "Odpowiedz nie może składać sie z większej ilości znaków niż {#limit}",
    "any.required": "Odpowiedz jest wymagana",
  }),
  is_answer: Joi.boolean().required().messages({
    "any.required": "Dostępność musi być podana.",
  }),
  question_id: Joi.number().integer().positive().required().messages({
    "any.required": "Pytanie jest wymagane",
  }),
});

const updateAnswerSchema = Joi.object({
  text: Joi.string().trim().max(255).messages({
    "string.max":
      "Odpowiedz nie może składać sie z większej ilości znaków niż {#limit}",
  }),
  is_answer: Joi.boolean(),
  question_id: Joi.number().integer().positive(),
});

module.exports = {
  createAnswerSchema,
  updateAnswerSchema,
};
