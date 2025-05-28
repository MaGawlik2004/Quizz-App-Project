const Joi = require("joi");

const createLevelSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    "string.empty": "Nazwa poziomu nie może być pusta",
    "string.max": "Nazwa poziomu nie może przekraczać {#limit} znaków",
    "any.required": "Nazwa poziomu jest wymagana",
  }),
});

const updateLevelSchema = Joi.object({
  name: Joi.string().trim().max(100).messages({
    "string.max": "Nazwa poziomu nie może przekraczać {#limit} znaków",
  }),
});

module.exports = {
  createLevelSchema,
  updateLevelSchema,
};
