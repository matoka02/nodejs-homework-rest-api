const joi = require("joi");

const emailRegexp = require("../models/user");

const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(6).required(),
});

const loginSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(6).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
};

module.exports = {
  // registerSchema,
  // loginSchema,
  schemas,
};
