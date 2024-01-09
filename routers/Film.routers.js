const express = require('express');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive')
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');



const { Films, Cinemas } = require('../models');
const { create, getAll, getDetails, deleteFilm, updateFilm, getFilmByIDCinema } = require('../controllers/Film.controller');
const { uploadImage } = require('../middleware/uploads/upload-images');
const filmsRouter = express.Router();

filmsRouter.post('/', authentication, authorize, uploadImage("films"), create);
filmsRouter.get('/', getAll);
filmsRouter.get('/cinemaID/:id', checkExists(Cinemas), getFilmByIDCinema)
filmsRouter.get('/:id', checkExists(Films), checkActive(Films), getDetails);
filmsRouter.put('/:id', authentication, authorize, checkExists(Films), checkActive(Films), uploadImage('films'), updateFilm);
filmsRouter.delete('/:id', authentication, authorize, checkExists(Films), deleteFilm);

module.exports = {
    filmsRouter
}