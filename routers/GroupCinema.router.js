const express = require('express');
const { GroupCinemas } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { uploadImage } = require('../middleware/uploads/upload-images');
const { create, deleteGrCinemas, getAll, getDetails, update } = require('../controllers/GroupCinema.controller');
const groupCinemasRouter = express.Router();

groupCinemasRouter.post('/', authentication, authorize, uploadImage("group_cinemas"), create);
groupCinemasRouter.get('/', getAll);
groupCinemasRouter.get('/:id', checkExists(GroupCinemas), checkActive(GroupCinemas), getDetails);
groupCinemasRouter.delete('/:id', authentication, authorize, checkExists(GroupCinemas), deleteGrCinemas);
groupCinemasRouter.put('/:id', authentication, authorize, checkExists(GroupCinemas), checkActive(GroupCinemas), uploadImage("group_cinemas"), update);


module.exports = {
    groupCinemasRouter
}