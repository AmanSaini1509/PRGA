import Joi from "joi";

export const registerSchema = Joi.object({
    fullName: Joi.string()
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .min(3)
    .max(50)
    .messages({
      "string.pattern.base": "Full name should contain only letters and spaces"
    }),

    email: Joi.string()
    .trim()
    .lowercase()
    .email({tlds: {allow: ['com']}})
    .required(),

    password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and a number"
    })
})

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({tlds: {allow: ['com']}})
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,20}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain uppercase, lowercase, and a number"
    })
})