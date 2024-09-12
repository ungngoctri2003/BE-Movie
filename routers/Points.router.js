const express = require("express");
const pointsRouter = express.Router();
const { addPointsAfterPayment } = require("../controllers/Points.controller");
// Thêm authentication middleware nếu yêu cầu bảo mật
const { authentication } = require("../middleware/auth/authentication");

/**
 * @swagger
 * tags:
 *   name: Points
 *   description: API for managing user points
 */

/**
 * @swagger
 * /api/v1/points:
 *   post:
 *     summary: Add points after payment
 *     tags: [Points]
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
 *                 description: ID of the user
 *               points:
 *                 type: integer
 *                 description: Points to be added
 *     responses:
 *       200:
 *         description: Points added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
pointsRouter.post("/", addPointsAfterPayment);

module.exports = {
  pointsRouter,
};
