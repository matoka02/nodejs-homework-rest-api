const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../helpers");

// const isValidId = (req, res, next) => {
//   const { contactId } = req.params;
//   if (!isValidObjectId(contactId)) {
//     next(HttpError(400, `${contactId} is not valid id`));
//   }
//   next();
// };

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid id`));
  }
  next();
};

module.exports = isValidId;
