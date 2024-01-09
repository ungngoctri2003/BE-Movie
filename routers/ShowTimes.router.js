const express = require('express');
const { ShowTimes } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getAll, getDetails, deleteShowTimes, update, getShowTimeWithIDCinemaIDFilm, showtimesWithGroupCinemas } = require('../controllers/ShowTimes.controller');

const showTimeRouter = express.Router();

showTimeRouter.post('/', authentication, authorize, create);
showTimeRouter.get('/', getAll);
showTimeRouter.get(`/listShowTime`, getShowTimeWithIDCinemaIDFilm)
showTimeRouter.get(`/lichChieuTheoHeThongRap`, showtimesWithGroupCinemas);
showTimeRouter.get('/:id', checkExists(ShowTimes), checkActive(ShowTimes), getDetails);
showTimeRouter.delete('/:id', authentication, authorize, checkExists(ShowTimes), deleteShowTimes);
showTimeRouter.put('/:id', authentication, authorize, checkExists(ShowTimes), checkActive(ShowTimes), update);


module.exports = {
    showTimeRouter
}