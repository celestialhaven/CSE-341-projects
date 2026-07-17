const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');
const { asyncHandler } = require('../middleware/error');
const validation = require('../middleware/validate');

router.get('/', asyncHandler(usersController.getAll));

router.get('/:id', validation.validateObjectId('Must use a valid user id to find a user.'), asyncHandler(usersController.getSingle));

router.post('/', validation.saveUser, asyncHandler(usersController.createUser));

router.put('/:id', validation.validateObjectId('Must use a valid user id to update a user.'), validation.saveUser, asyncHandler(usersController.updateUser));

router.delete('/:id', validation.validateObjectId('Must use a valid user id to delete a user.'), asyncHandler(usersController.deleteUser));

module.exports = router;
