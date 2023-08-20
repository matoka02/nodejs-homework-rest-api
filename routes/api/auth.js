const express = require("express");

const ctrl = require("../../controllers/auth");

const {validateBody, authenticate} = require("../../middlewares");

const {schemas} = require("../../schemas/validatorUsers");

const router = express.Router();

// signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);


module.exports = router;