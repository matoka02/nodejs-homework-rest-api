const {validateBody, validateFavorite} = require("./validateBody");
const {isValidId, isValidIdUser} = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./upload');

module.exports = {
    validateBody,
    validateFavorite,
    isValidId,
    isValidIdUser,
    authenticate,
    upload,
}