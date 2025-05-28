const Joi = require("joi");

const createQuestionSchema = Joi.object({
  type_id: Joi.number().integer().positive().required().messages({
    "any.required": "Typ pytania jest wymagany.",
  }),
  query: Joi.string().trim().max(255).required().messages({
    "string.empty": "Pytanie nie może być puste.",
    "string.max": "Pytanie nie może zawierać wiecej niż {#limit} znaków",
    "any.required": "Pytanie jest wymagane.",
  }),
  quizz_id: Joi.number().integer().positive().required().messages({
    "any.required": "Quizz jest wymagany.",
  }),
});

const updateQuestionSchema = Joi.object({
  type_id: Joi.number().integer().positive(),
  query: Joi.string().trim().max(255).messages({
    "string.max": "Pytanie nie może zawierać wiecej niż {#limit} znaków",
  }),
  quizz_id: Joi.number().integer().positive(),
});

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
};
