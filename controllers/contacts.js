const { Contact } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res, next) => {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (contact) {
    res.status(200).json(contact);
  } else {
    throw HttpError(404, "Not found");
  }
};

const add = async (req, res, next) => {
  // заполнение поля по умолчанию
  let { favorite } = req.body;
  if (!favorite) {
    favorite = false;
  };
  // проверка на пустое тело
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    throw HttpError(400, `missing fields`);
  };

  const contact = await Contact.create(req.body);
  res.status(201).json(contact);
};

const updateById = async (req, res, next) => {
  // проверка на пустое тело
  const { name, email, phone } = req.body;
  if (!name && !email && !phone) {
    throw HttpError(400, `missing fields`);
  };
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
};

const updateStatusContact = async (req, res, next) => {
  // проверка на пустое тело
  const { favorite } = req.body;
  if (!favorite && favorite !== false) {
    throw HttpError(400, `missing field favorite`);
  };
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
};

const deleteById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndDelete(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
