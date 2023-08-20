const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

// const { SECRET_KEY } = process.env;

const register = async (req, resp) => {
  // заполнение поля по умолчанию
  let { subscription } = req.body;
  if (!subscription) {
    subscription = 'starter';
  };
  // проверка существования пользователя по email
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  resp.status(201).json({
    email: newUser.email,
    // password: newUser.password,
    password: password,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  // login: ctrlWrapper(login),
  // getCurrent: ctrlWrapper(getCurrent),
  // logout: ctrlWrapper(logout),
};