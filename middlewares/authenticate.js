const jwt = require("jsonwebtoken");

const {User} = require("../models/user");
const {HttpError} = require("../helpers");

const {SECRET_KEY} = process.env;
// const SECRET_KEY = `5YLCJ6ByLH`;

const authenticate = async (req, resp, next) => {
  const {authorization = ''} = req.headers;
  const [bearer, token] = authorization.split(' ');
  if(bearer!=='Bearer'){
    next(HttpError(401))
  };
  try {
    const {id} = jwt.verify(token, SECRET_KEY);
    // console.log(id);
    const user = await User.findById(id);
    // проверка для вывода сообщения
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401))
    };
    // запись пользователя, который отправил запрос
    req.user = user;
    // команда идти к следующей функции, если все ок
    next();
  } catch (error) {
    next(HttpError(401))
  };


};

module.exports = authenticate;