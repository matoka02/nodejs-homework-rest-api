const express = require("express");

const ctrl = require("../../controllers/auth");

const {validateBody, authenticate, isValidIdUser, upload} = require("../../middlewares");

const {schemas} = require("../../schemas/validatorUsers");

const router = express.Router();

// signUp
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// signIn
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get('/current', authenticate, ctrl.getCurrent);

router.patch('/:id/subscription', authenticate, isValidIdUser, validateBody(schemas.subscribtionSchema), ctrl.updateSubscribtion);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar);


module.exports = router;