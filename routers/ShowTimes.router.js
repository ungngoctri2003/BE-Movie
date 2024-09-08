const express = require("express");
const { ShowTimes } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getAll,
  getDetails,
  deleteShowTimes,
  update,
  getShowTimeWithIDCinemaIDFilm,
  showtimesWithGroupCinemas,
  changeStatusShowTime,
} = require("../controllers/ShowTimes.controller");

const showTimeRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: ShowTimes
 *   description: ShowTimes management API
 */

/**
 * @swagger
 * /api/v1/showTimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cinemaId:
 *                 type: string
 *               filmId:
 *                 type: string
 *               showTime:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *       400:
 *         description: Bad request
 */
showTimeRouter.post("/", authentication, authorize, create);

/**
 * @swagger
 * /api/v1/showTimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [ShowTimes]
 *     responses:
 *       200:
 *         description: List of all showtimes
 *       404:
 *         description: Showtimes not found
 */
showTimeRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/showTimes/listShowTime:
 *   get:
 *     summary: Get showtimes by cinema and film ID
 *     tags: [ShowTimes]
 *     parameters:
 *       - in: query
 *         name: cinemaId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cinema
 *       - in: query
 *         name: filmId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the film
 *     responses:
 *       200:
 *         description: List of showtimes for the specified cinema and film
 *       404:
 *         description: Showtimes not found
 */
showTimeRouter.get(`/listShowTime`, getShowTimeWithIDCinemaIDFilm);

/**
 * @swagger
 * /api/v1/showTimes/lichChieuTheoHeThongRap:
 *   get:
 *     summary: Get showtimes by cinema system
 *     tags: [ShowTimes]
 *     responses:
 *       200:
 *         description: List of showtimes for the cinema system
 *       404:
 *         description: Showtimes not found
 */
showTimeRouter.get(`/lichChieuTheoHeThongRap`, showtimesWithGroupCinemas);

/**
 * @swagger
 * /api/v1/showTimes/{id}:
 *   get:
 *     summary: Get details of a specific showtime
 *     tags: [ShowTimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the showtime
 *     responses:
 *       200:
 *         description: Showtime details
 *       404:
 *         description: Showtime not found
 */
showTimeRouter.get(
  "/:id",
  checkExists(ShowTimes),
  checkActive(ShowTimes),
  getDetails
);

/**
 * @swagger
 * /api/v1/showTimes/{id}:
 *   delete:
 *     summary: Delete a specific showtime
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the showtime
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       404:
 *         description: Showtime not found
 */
showTimeRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(ShowTimes),
  deleteShowTimes
);

/**
 * @swagger
 * /api/v1/showTimes/{id}:
 *   put:
 *     summary: Update a specific showtime
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the showtime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cinemaId:
 *                 type: string
 *               filmId:
 *                 type: string
 *               showTime:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       400:
 *         description: Bad request
 */
showTimeRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(ShowTimes),
  checkActive(ShowTimes),
  update
);

/**
 * @swagger
 * /api/v1/showTimes/status/{id}:
 *   put:
 *     summary: Change status of a specific showtime
 *     tags: [ShowTimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the showtime
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Showtime status changed successfully
 *       400:
 *         description: Bad request
 */
showTimeRouter.put(
  "/status/:id",
  authentication,
  authorize,
  checkExists(ShowTimes),
  changeStatusShowTime
);

module.exports = {
  showTimeRouter,
};
