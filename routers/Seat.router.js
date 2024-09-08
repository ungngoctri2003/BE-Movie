const express = require("express");
const { Seats } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getByIdShowTime,
  update,
  details,
} = require("../controllers/Seat.controller");

const seatRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat management API
 */

/**
 * @swagger
 * /api/v1/seats:
 *   post:
 *     summary: Create a new seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatNumber:
 *                 type: string
 *               showTimeId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Seat created successfully
 *       400:
 *         description: Bad request
 */
seatRouter.post("/", authentication, authorize, create);

/**
 * @swagger
 * /api/v1/seats:
 *   put:
 *     summary: Update an existing seat
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatId:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *               showTimeId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Seat updated successfully
 *       400:
 *         description: Bad request
 */
seatRouter.put("/", authentication, authorize, update);

/**
 * @swagger
 * /api/v1/seats:
 *   get:
 *     summary: Get seats by showtime ID
 *     tags: [Seats]
 *     parameters:
 *       - in: query
 *         name: showTimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the showtime to get seats for
 *     responses:
 *       200:
 *         description: List of seats for the given showtime ID
 *       404:
 *         description: Show time not found
 */
seatRouter.get("/", authentication, getByIdShowTime);

/**
 * @swagger
 * /api/v1/seats/priceSeats:
 *   get:
 *     summary: Get seat details including price
 *     tags: [Seats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seat details including price
 *       404:
 *         description: Seats not found
 */
seatRouter.get("/priceSeats", authentication, authorize, details);

module.exports = {
  seatRouter,
};
