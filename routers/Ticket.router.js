const express = require("express");
const { Tickets, Users } = require("../models");
const { checkExists } = require("../middleware/validations/checkExists");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const {
  create,
  getTicketByIdUser,
  listTicketWithUser,
  getToTalWithMonth,
  getTotalWithDay,
  getTicketByDay,
} = require("../controllers/Ticket.controller");
const { checkUserBlock } = require("../middleware/validations/checkUserBlock");
const {
  contentQRcode,
} = require("../middleware/nodoMailer/contentMail/contentQrCode");
const { sendMail } = require("../middleware/nodoMailer");
const ticketRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Tickets management API
 */

/**
 * @swagger
 * /api/v1/tickets/total:
 *   get:
 *     summary: Get total tickets for the current month
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total tickets for the current month
 *       401:
 *         description: Unauthorized
 */
ticketRouter.get("/total", authentication, authorize, getToTalWithMonth);

/**
 * @swagger
 * /api/v1/tickets/totalByDay:
 *   get:
 *     summary: Get total tickets for the current day
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total tickets for the current day
 *       401:
 *         description: Unauthorized
 */
ticketRouter.get("/totalByDay", authentication, authorize, getTotalWithDay);

/**
 * @swagger
 * /api/v1/tickets:
 *   post:
 *     summary: Create a new ticket and send QR code via email
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               showTimeId:
 *                 type: string
 *               seatId:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully and QR code sent via email
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
ticketRouter.post("/", authentication, create, contentQRcode, sendMail);

/**
 * @swagger
 * /api/v1/tickets/{id}:
 *   get:
 *     summary: Get ticket details by user ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Ticket details for the specified user
 *       401:
 *         description: Unauthorized
 */
ticketRouter.get("/:id", authentication, getTicketByIdUser);

/**
 * @swagger
 * /api/v1/tickets/test:
 *   post:
 *     summary: Test QR code generation and email sending
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               showTimeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: QR code generated and email sent
 *       400:
 *         description: Bad request
 */
ticketRouter.post("/test", contentQRcode, sendMail);

/**
 * @swagger
 * /api/v1/tickets/listTicket/{id}:
 *   get:
 *     summary: Get list of tickets for a specific user
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of tickets for the specified user
 *       401:
 *         description: Unauthorized
 */
ticketRouter.get(
  "/listTicket/:id",
  authentication,
  checkExists(Users),
  listTicketWithUser
);

/**
 * @swagger
 * /api/v1/tickets/day:
 *   post:
 *     summary: Get tickets for a specific day
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: List of tickets for the specified day
 *       400:
 *         description: Bad request
 */
ticketRouter.post("/day", authentication, getTicketByDay);

module.exports = {
  ticketRouter,
};
