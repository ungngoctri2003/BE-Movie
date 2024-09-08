const express = require("express");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { Films, Cinemas } = require("../models");
const {
  create,
  getAll,
  getDetails,
  deleteFilm,
  updateFilm,
  getFilmByIDCinema,
} = require("../controllers/Film.controller");
const { uploadImage } = require("../middleware/uploads/upload-images");
const filmsRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: Film management API
 */

/**
 * @swagger
 * /api/v1/films:
 *   post:
 *     summary: Create a new film
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               cinemaId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Film created successfully
 *       400:
 *         description: Bad request
 */
filmsRouter.post("/", authentication, authorize, uploadImage("films"), create);

/**
 * @swagger
 * /api/v1/films:
 *   get:
 *     summary: Get all films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: List of all films
 */
filmsRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/films/cinemaID/{id}:
 *   get:
 *     summary: Get films by cinema ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cinema ID
 *     responses:
 *       200:
 *         description: List of films for the specified cinema
 *       404:
 *         description: Cinema not found
 */
filmsRouter.get("/cinemaID/:id", checkExists(Cinemas), getFilmByIDCinema);

/**
 * @swagger
 * /api/v1/films/{id}:
 *   get:
 *     summary: Get film details by ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The film ID
 *     responses:
 *       200:
 *         description: Film details
 *       404:
 *         description: Film not found
 */
filmsRouter.get("/:id", checkExists(Films), checkActive(Films), getDetails);

/**
 * @swagger
 * /api/v1/films/{id}:
 *   put:
 *     summary: Update a film by ID
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The film ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               cinemaId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Film updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Film not found
 */
filmsRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Films),
  checkActive(Films),
  uploadImage("films"),
  updateFilm
);

/**
 * @swagger
 * /api/v1/films/{id}:
 *   delete:
 *     summary: Delete a film by ID
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The film ID
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       404:
 *         description: Film not found
 */
filmsRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Films),
  deleteFilm
);

module.exports = {
  filmsRouter,
};
