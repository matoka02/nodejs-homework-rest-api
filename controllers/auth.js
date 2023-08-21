const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
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
  res.status(201).json({
    'user': {
      email: newUser.email,
      subscription,
    }
    // email: newUser.email,
    // // password: newUser.password,
    // // password,
    // subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // проверка существования пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  };
  // проверка пароля
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
  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    }
  });
};

const logout = async (req, res) => {
  const {_id} = req.user;
  await User.findByIdAndUpdate(_id, {token: ''});
  res.status(204).json({
    message: 'Logout success'
  })
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const update = async (req, res) => {
  const {id} = req.params;
  const user =  await User.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  res.status(200).json(user);
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  update: ctrlWrapper(update),
};