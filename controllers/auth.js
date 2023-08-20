const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

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
  };

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });
  resp.status(201).json({
    email: newUser.email,
    // password: newUser.password,
    // password,
    subscription,
  });
};

const login = async (req, resp) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  // запись токена в БД
  await User.findByIdAndUpdate(user._id, {token});
  resp.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    }
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  // getCurrent: ctrlWrapper(getCurrent),
  // logout: ctrlWrapper(logout),
};