const express = require("express");
const { Rooms, Cinemas } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { checkActive } = require("../middleware/validations/checkActive");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getAll,
  getDetails,
  deleteRoom,
  update,
  getRoomByIDCinema,
} = require("../controllers/Room.controller");

const roomRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management API
 */

/**
 * @swagger
 * /api/v1/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cinemaId:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created successfully
 *       400:
 *         description: Bad request
 */
roomRouter.post("/", authentication, authorize, create);

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of all rooms
 */
roomRouter.get("/", getAll);

/**
 * @swagger
 * /api/v1/rooms/cinemaID/{id}:
 *   get:
 *     summary: Get rooms by cinema ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The cinema ID
 *     responses:
 *       200:
 *         description: List of rooms for the given cinema ID
 *       404:
 *         description: Cinema not found
 */
roomRouter.get("/cinemaID/:id", checkExists(Cinemas), getRoomByIDCinema);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   get:
 *     summary: Get details of a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 */
roomRouter.get(
  "/:id",
  authentication,
  authorize,
  checkExists(Rooms),
  checkActive(Rooms),
  getDetails
);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   delete:
 *     summary: Delete a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
roomRouter.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Rooms),
  deleteRoom
);

/**
 * @swagger
 * /api/v1/rooms/{id}:
 *   put:
 *     summary: Update a room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cinemaId:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Room not found
 */
roomRouter.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Rooms),
  checkActive(Rooms),
  update
);

module.exports = {
  roomRouter,
};
