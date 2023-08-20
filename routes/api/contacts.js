const express = require('express');
const ctrl = require("../../controllers/contacts");

<<<<<<< HEAD
const {validateBody, isValidId} = require("../../middlewares");
const {schemas} = require("../../schemas/validatorContacts");
=======
const {validateBody} = require("../../middlewars");
const schemas = require("../../schemas/validatorContacts");
>>>>>>> master

const router = express.Router();

router.get('/', ctrl.getAll);

<<<<<<< HEAD
router.get('/:contactId', isValidId, ctrl.getById);

router.post('/', validateBody(schemas.addSchema),  ctrl.add);

router.delete('/:contactId', isValidId, ctrl.deleteById)

router.put('/:contactId', isValidId, validateBody(schemas.addSchema), ctrl.updateById);

router.patch('/:contactId/favorite', isValidId, validateBody(schemas.updateFavoriteSchema),  ctrl.updateStatusContact);

=======
router.get('/:contactId', ctrl.getById);

router.post('/', validateBody(schemas.addSchema),  ctrl.add);

router.delete('/:contactId', ctrl.deleteById)

router.put('/:contactId', validateBody(schemas.addSchema),  ctrl.updateById);
>>>>>>> master

module.exports = router;
