const express = require("express");
const { GroupCinemas } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { uploadImage } = require("../middleware/uploads/upload-images");
const {
  create,
  deleteGrCinemas,
  getAll,
  getDetails,
  update,
} = require("../controllers/GroupCinema.controller");
const groupCinemasRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: GroupCinemas
 *   description: Group Cinemas management API
 */

/**
 * @swagger
 * /api/v1/groupCinemas:
 *   post:
 *     summary: Create a new group cinema
 *     tags: [GroupCinemas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Group cinema created successfully
 *       400:
 *         description: Bad request
 */
groupCinemasRouter.post(
  "/",
  authentication,
  authorize,
  uploadImage("group_cinemas"),
  create
);

/**
 * @swagger
 * /api/v1/groupCinemas:
 *   get:
 *     summary: Get all group cinemas
 *     tags: [GroupCinemas]
 *     responses:
 *       200:
 *         description: List of all group cinemas
 */
groupCinemasRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/groupCinemas/{id}:
 *   get:
 *     summary: Get group cinema details by ID
 *     tags: [GroupCinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The group cinema ID
 *     responses:
 *       200:
 *         description: Group cinema details
 *       404:
 *         description: Group cinema not found
 */
groupCinemasRouter.get(
  "/:id",
  checkExists(GroupCinemas),
  checkActive(GroupCinemas),
  getDetails
);

/**
 * @swagger
 * /api/v1/groupCinemas/{id}:
 *   delete:
 *     summary: Delete a group cinema by ID
 *     tags: [GroupCinemas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The group cinema ID
 *     responses:
 *       200:
 *         description: Group cinema deleted successfully
 *       404:
 *         description: Group cinema not found
 */
groupCinemasRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(GroupCinemas),
  deleteGrCinemas
);

/**
 * @swagger
 * /api/v1/groupCinemas/{id}:
 *   put:
 *     summary: Update a group cinema by ID
 *     tags: [GroupCinemas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The group cinema ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Group cinema updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Group cinema not found
 */
groupCinemasRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(GroupCinemas),
  checkActive(GroupCinemas),
  uploadImage("group_cinemas"),
  update
);

module.exports = {
  groupCinemasRouter,
};
