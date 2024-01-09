const express = require('express');
const { Rooms, Cinemas } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getAll, getDetails, deleteRoom, update, getRoomByIDCinema } = require('../controllers/Room.controller');

const roomRouter = express.Router();
roomRouter.post('/', authentication, authorize, create);
roomRouter.get('/', getAll);
roomRouter.get('/cinemaID/:id', checkExists(Cinemas), getRoomByIDCinema)
roomRouter.get('/:id', authentication, authorize, checkExists(Rooms), checkActive(Rooms), getDetails);
roomRouter.delete('/:id', authentication, authorize, checkExists(Rooms), deleteRoom);
roomRouter.put('/:id', authentication, authorize, checkExists(Rooms), checkActive(Rooms), update);
module.exports = {
    roomRouter
}