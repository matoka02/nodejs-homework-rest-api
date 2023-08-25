const joi = require('joi');

const addSchema = joi.object({
	name: joi.string().min(3).required().messages({
    'any.required': 'missing required name field',
  }),
	email: joi.string().email().required().messages({
    'any.required': 'missing required email field',
  }),
	phone: joi.string().min(5).required().messages({
    'any.required': 'missing required phone field',
  }),
	favorite: joi.boolean(),
});

const updateFavoriteSchema = joi.object({
  favorite: joi.boolean().required().messages({
    'any.required': 'missing field favorite',
  }),
});

const schemas = { 
	addSchema, 
	updateFavoriteSchema,
  };


module.exports = {
	// addSchema,
	// updateFavoriteSchema,
	schemas
}