const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const { resizeImg } = require('../helpers');


const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");


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
  // хеширование пароля, генерация аватара, присвоение верификац.токена
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });

  const verifyEmail = {
    to: email,
    subject: 'Email verification',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"><strong>By clicking on the following link, you are confirming your email address VERIFY</strong></a>`
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription,
    }
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({verificationToken});
  if (!user) {
    throw HttpError(401, "User not found");
  };
  await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ''});

  res.status(200).json({
    message: 'Verification successful'
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, 'missing required field email')
  }
  const user = await User.findOne({email});
  if (!user) {
    throw HttpError(401, "Email not found");
  };  
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  };

  const verifyEmail = {
    to: email,
    subject: 'Email verification',
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"><strong>By clicking on the following link, you are confirming your email address VERIFY</strong></a>`
  };

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: 'Verification email sent'
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // проверка существования пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  };
  // проверка верификации
  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  };
  // проверка пароля
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  // генерация токена
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  await User.findByIdAndUpdate(user._id, {token});
  res.json({
    token,
    user: {
      _id: user.id,
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

const updateSubscribtion = async (req, res) => {
  const {id} = req.params;
  const user =  await User.findByIdAndUpdate({ _id: id }, req.body, { new: true });
  res.status(200).json(user);
};

const updateAvatar = async (req, res) => {
  const {_id} = req.user;
  if (!req.file) {
    // return res.send('Please add a picture for the avatar')
    throw HttpError(404, `Please add a picture for the avatar`)
  };
  const {path: tempUpload, originalname} = req.file;
  console.log(req.file);
  // resizeImg(tempUpload);

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDir, filename);

  await fs.rename(tempUpload, resultUpload);
  
  const avatarURL = path.join('avatars', filename);

  resizeImg(resultUpload);  
  
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({avatarURL});
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscribtion: ctrlWrapper(updateSubscribtion),
  updateAvatar: ctrlWrapper(updateAvatar),
};