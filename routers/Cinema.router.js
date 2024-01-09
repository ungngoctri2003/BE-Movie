const express = require('express');
const { Cinemas, GroupCinemas } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { uploadImage } = require('../middleware/uploads/upload-images');
const { create, getAll, getDetails, deleteCinemas, update, getAllByIdGroupCinema } = require('../controllers/Cinema.controller');
const cinemasRouter = express.Router();

cinemasRouter.post('/', authentication, authorize, uploadImage("cinemas"), create);
cinemasRouter.get('/', getAll);
cinemasRouter.get('/groupID/:id', checkExists(GroupCinemas), getAllByIdGroupCinema);
cinemasRouter.get('/:id', checkExists(Cinemas), checkActive(Cinemas), getDetails);
cinemasRouter.delete('/:id', authentication, authorize, checkExists(Cinemas), checkActive(Cinemas), deleteCinemas);
cinemasRouter.put('/:id', authentication, authorize, checkExists(Cinemas), checkActive(Cinemas), uploadImage('cinemas'), update);


module.exports = {
    cinemasRouter
}