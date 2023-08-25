const joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
  }),
  password: joi.string().min(6).required().messages({
    'any.required': 'missing required password field',
  }),
  subscription: joi.string().valid("starter", "pro", "business"),
});

const emailSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
  }),
});

const loginSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required().messages({
    'any.required': 'missing required email field',
  }),
  password: joi.string().min(6).required().messages({
    'any.required': 'missing required password field',
  }),
});

const subscribtionSchema = joi.object({
  subscription: joi.string().valid("starter", "pro", "business").required().messages({
    'any.required': 'missing required subscription field',
  }),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscribtionSchema,
};

module.exports = {
  schemas,
};
