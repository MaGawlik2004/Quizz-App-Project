const Joi = require("joi");

const createQuestionTypeSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nazwa typ pytania nie może być pusta",
    "string.max": "Nazwa typ pytania nie może przekraczać {#limit} znaków",
    "any.required": "Nazwa typ pytania jest wymagana",
  }),
});

const updateQuestionTypeSchema = Joi.object({
  name: Joi.string().trim().max(100).messages({
    "string.max": "Nazwa typ pytania nie może przekraczać {#limit} znaków",
  }),
});

module.exports = {
  createQuestionTypeSchema,
  updateQuestionTypeSchema,
};
