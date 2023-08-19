const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    // проверка на пустое тело
    // const { name, email, phone } = req.body;
    // if (!name && !email && !phone) {
    //   throw HttpError(400, `missing fields`)
    // };

    const { error } = schema.validate(req.body);
    if (error) {
      const errorType = error.details[0];
      if (errorType.path[0] === 'favorite') {
        throw HttpError(400, `missing field favorite`)
      }      
      // проверка на заполнение всех полей
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

// const validateFavorite = (schema) => {
//   const func = (req, res, next) => {
//     // проверка на пустое тело при updateStatusContact
//     const { favorite } = req.body;
//     if (!favorite && favorite !== false) {
//       throw HttpError(400, `missing field favorite`)
//     };
//     next();
//   };

//   return func;
// };

module.exports = { 
  validateBody, 
  // validateFavorite,
};

