const joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(6).required(),
  subscription: joi.string().valid("starter", "pro", "business"),
});

const emailSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required(),
}); 

const loginSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required(),
  password: joi.string().min(6).required(),
});

const subscribtionSchema = joi.object({
	subscription: joi.string().valid("starter", "pro", "business"),
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
