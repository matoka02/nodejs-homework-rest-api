const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorType = error.details[0];
      // PATCH/contacts/contactId/favorite
      if (errorType.path[0] === 'favorite') {
        throw HttpError(400, `missing field favorite`)
      }      
      // POST/contacts, POST/contacts/contactId
      else if (errorType.type === 'any.required') {
        throw HttpError(400, `missing required ${errorType.path[0]} field`)
      }
      // проверка на валидность
      throw HttpError(400, `${errorType.message}`)
    };

    next();
  };

  return func;
};

module.exports = { 
  validateBody, 
};

