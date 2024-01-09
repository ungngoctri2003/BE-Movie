const express = require('express');
const { TypeUser } = require('../models');
const { createTypeUser, getAll, getDetails, deleteTypeUser, update } = require('../controllers/TyepeUser.controllers');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');

const TypeUserRouter = express.Router();

TypeUserRouter.post('/', authentication, authorize, createTypeUser);
TypeUserRouter.get('/', authentication, authorize, getAll);
TypeUserRouter.get('/:id', authentication, authorize, checkActive(TypeUser), getDetails);
TypeUserRouter.delete('/:id', authentication, authorize, checkExists(TypeUser), deleteTypeUser);
TypeUserRouter.put('/:id', authentication, authorize, checkExists(TypeUser), checkActive(TypeUser), update);


module.exports = {
    TypeUserRouter
}