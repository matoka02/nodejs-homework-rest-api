const {validateBody, validateFavorite} = require("./validateBody");
const {isValidId, isValidIdUser} = require('./isValidId');
const authenticate = require('./authenticate');

module.exports = {
    validateBody,
    validateFavorite,
    isValidId,
    isValidIdUser,
    authenticate
}