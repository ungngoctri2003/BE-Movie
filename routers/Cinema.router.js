const express = require("express");
const { Cinemas, GroupCinemas } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { uploadImage } = require("../middleware/uploads/upload-images");
const {
  create,
  getAll,
  getDetails,
  deleteCinemas,
  update,
  getAllByIdGroupCinema,
} = require("../controllers/Cinema.controller");
const cinemasRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cinemas
 *   description: Cinema management
 */

/**
 * @swagger
 * /api/v1/cinemas:
 *   post:
 *     summary: Create a new cinema
 *     tags: [Cinemas]
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cinema created
 *       400:
 *         description: Bad request
 */
cinemasRouter.post(
  "/",
  authentication,
  authorize,
  uploadImage("cinemas"),
  create
);

/**
 * @swagger
 * /api/v1/cinemas:
 *   get:
 *     summary: Get all cinemas
 *     tags: [Cinemas]
 *     responses:
 *       200:
 *         description: List of cinemas
 *       500:
 *         description: Internal server error
 */
cinemasRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/cinemas/groupID/{id}:
 *   get:
 *     summary: Get cinemas by group ID
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The group cinema ID
 *     responses:
 *       200:
 *         description: List of cinemas by group ID
 *       404:
 *         description: Group cinema not found
 *       500:
 *         description: Internal server error
 */
cinemasRouter.get(
  "/groupID/:id",
  checkExists(GroupCinemas),
  getAllByIdGroupCinema
);

/**
 * @swagger
 * /api/v1/cinemas/{id}:
 *   get:
 *     summary: Get cinema by ID
 *     tags: [Cinemas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cinema ID
 *     responses:
 *       200:
 *         description: Cinema data
 *       404:
 *         description: Cinema not found
 *       500:
 *         description: Internal server error
 */
cinemasRouter.get(
  "/:id",
  checkExists(Cinemas),
  checkActive(Cinemas),
  getDetails
);

/**
 * @swagger
 * /api/v1/cinemas/{id}:
 *   delete:
 *     summary: Delete a cinema
 *     tags: [Cinemas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cinema ID
 *     responses:
 *       200:
 *         description: Cinema deleted
 *       404:
 *         description: Cinema not found
 *       500:
 *         description: Internal server error
 */
cinemasRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Cinemas),
  checkActive(Cinemas),
  deleteCinemas
);

/**
 * @swagger
 * /api/v1/cinemas/{id}:
 *   put:
 *     summary: Update a cinema
 *     tags: [Cinemas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cinema ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cinema updated
 *       404:
 *         description: Cinema not found
 *       400:
 *         description: Bad request
 */
cinemasRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Cinemas),
  checkActive(Cinemas),
  uploadImage("cinemas"),
  update
);

module.exports = {
  cinemasRouter,
};
